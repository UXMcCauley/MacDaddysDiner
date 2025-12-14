import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/lib/types';
import { Document } from 'mongodb';

// POST - Add new category
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const category: MenuCategory = await request.json();

    // Generate ID if not provided
    if (!category.id) {
      category.id = category.name.toLowerCase().replace(/\s+/g, '-');
    }

    // Get current menu and update manually
    const menu = await db.collection('menu').findOne({});

    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    const newOrder = menu.categories?.length || 0;
    const newCategory = {
      ...category,
      order: newOrder,
      items: category.items || [],
    };

    const categories = [...(menu.categories || []), newCategory];

    const result = await db.collection('menu').updateOne(
      { _id: menu._id },
      {
        $set: {
          categories,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add category' },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { categoryId, updates } = await request.json();

    // Fetch, modify, replace approach
    const menu = await db.collection('menu').findOne({}) as Document | null;

    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    const categoryIndex = menu.categories?.findIndex(
      (c: { id: string }) => c.id === categoryId
    );

    if (categoryIndex === -1 || categoryIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    menu.categories[categoryIndex] = { ...menu.categories[categoryIndex], ...updates };
    menu.lastUpdated = new Date().toISOString();

    const result = await db.collection('menu').replaceOne({ _id: menu._id }, menu);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Remove category
export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID required' },
        { status: 400 }
      );
    }

    // Fetch, modify, replace approach
    const menu = await db.collection('menu').findOne({}) as Document | null;

    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    menu.categories = menu.categories?.filter(
      (c: { id: string }) => c.id !== categoryId
    ) || [];
    menu.lastUpdated = new Date().toISOString();

    const result = await db.collection('menu').replaceOne({ _id: menu._id }, menu);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
