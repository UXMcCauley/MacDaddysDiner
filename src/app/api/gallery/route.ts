import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { put, del } from '@vercel/blob';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: 'food' | 'interior' | 'team' | 'exterior';
  order: number;
  createdAt: string;
}

// GET - Fetch all gallery images
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('gallery');

    const images = await collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

// POST - Upload new gallery image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt = formData.get('alt') as string || '';
    const category = formData.get('category') as string || 'interior';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Use JPEG, PNG, WebP, or AVIF.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for gallery)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate filename
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Get current max order
    const { db } = await connectToDatabase();
    const collection = db.collection('gallery');
    const maxOrderDoc = await collection.find().sort({ order: -1 }).limit(1).toArray();
    const nextOrder = maxOrderDoc.length > 0 ? (maxOrderDoc[0].order || 0) + 1 : 0;

    // Save to database
    const imageDoc: GalleryImage = {
      id: `gallery-${Date.now()}`,
      url: blob.url,
      alt: alt || 'Gallery image',
      category: category as GalleryImage['category'],
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    await collection.insertOne(imageDoc);

    return NextResponse.json({
      success: true,
      data: imageDoc,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// PUT - Update image metadata or reorder
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, alt, category, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('gallery');

    const updates: Partial<GalleryImage> = {};
    if (alt !== undefined) updates.alt = alt;
    if (category !== undefined) updates.category = category;
    if (order !== undefined) updates.order = order;

    await collection.updateOne({ id }, { $set: updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE - Remove gallery image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('gallery');

    // Get image to delete from blob
    const image = await collection.findOne({ id });
    if (image?.url) {
      try {
        await del(image.url);
      } catch (e) {
        console.error('Error deleting from blob:', e);
      }
    }

    await collection.deleteOne({ id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
