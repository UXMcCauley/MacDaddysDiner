import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Feedback } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Fetch all feedback (admin)
export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);

    // Filter options
    const filter: Record<string, unknown> = {};
    const archived = searchParams.get('archived');
    const read = searchParams.get('read');
    const type = searchParams.get('type');

    if (archived !== null) {
      filter.archived = archived === 'true';
    } else {
      // By default, don't show archived
      filter.archived = false;
    }

    if (read !== null) {
      filter.read = read === 'true';
    }

    if (type) {
      filter.type = type;
    }

    const feedback = await db
      .collection<Feedback>('feedback')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// POST - Submit new feedback (public)
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const feedback: Feedback = {
      name: body.name,
      email: body.email,
      phone: body.phone || undefined,
      type: body.type || 'other',
      message: body.message,
      rating: body.rating || undefined,
      visitDate: body.visitDate || undefined,
      createdAt: new Date(),
      read: false,
      replied: false,
      archived: false,
    };

    const result = await db.collection('feedback').insertOne(feedback);

    return NextResponse.json({
      success: true,
      data: { id: result.insertedId },
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// PUT - Update feedback (mark read, reply, archive)
export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID required' },
        { status: 400 }
      );
    }

    // Handle reply
    if (updates.replyMessage) {
      updates.replied = true;
      updates.repliedAt = new Date();
    }

    const result = await db.collection('feedback').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete feedback
export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID required' },
        { status: 400 }
      );
    }

    const result = await db.collection('feedback').deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
