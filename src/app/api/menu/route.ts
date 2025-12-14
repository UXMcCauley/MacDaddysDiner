import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import menuDataJson from '@/data/menu.json';
import { Document } from 'mongodb';

// GET - Fetch entire menu
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Try to get menu from MongoDB
    let menu = await db.collection('menu').findOne({}) as Document | null;

    // If no menu in DB, seed it from the JSON file
    if (!menu) {
      const seedData = {
        ...menuDataJson,
        lastUpdated: new Date().toISOString(),
        categories: menuDataJson.categories.map((cat, index) => ({
          ...cat,
          order: index,
          items: cat.items.map(item => ({
            ...item,
            available: true,
          })),
        })),
        specials: {
          daily: menuDataJson.specials.daily.map(special => ({
            ...special,
            active: true,
          })),
        },
      };

      await db.collection('menu').insertOne(seedData);
      menu = seedData as Document;
    }

    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

// PUT - Update entire menu (mainly for reordering categories)
export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const result = await db.collection('menu').updateOne(
      {},
      {
        $set: {
          ...body,
          lastUpdated: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}
