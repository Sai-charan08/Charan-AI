import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ChatSessionModel } from '@/lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const sessions = await ChatSessionModel.find({ userId }).sort({ updatedAt: -1 });

      const formattedSessions = sessions.map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messages: s.messages || [],
      }));

      return NextResponse.json({ success: true, sessions: formattedSessions });
    } catch (dbErr: any) {
      console.warn('MongoDB GET Sessions Notice:', dbErr?.message || dbErr);
      return NextResponse.json({ success: false, fallback: true, sessions: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, sessions, session } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();

      // If array of sessions is provided, save/upsert all
      if (sessions && Array.isArray(sessions)) {
        const bulkOps = sessions.map((s: any) => ({
          updateOne: {
            filter: { userId, id: s.id },
            update: {
              $set: {
                userId,
                id: s.id,
                title: s.title,
                messages: s.messages || [],
                createdAt: s.createdAt || Date.now(),
                updatedAt: s.updatedAt || Date.now(),
              },
            },
            upsert: true,
          },
        }));

        if (bulkOps.length > 0) {
          await ChatSessionModel.bulkWrite(bulkOps);
        }
      } else if (session && session.id) {
        // Single session update
        await ChatSessionModel.findOneAndUpdate(
          { userId, id: session.id },
          {
            userId,
            id: session.id,
            title: session.title,
            messages: session.messages || [],
            createdAt: session.createdAt || Date.now(),
            updatedAt: session.updatedAt || Date.now(),
          },
          { upsert: true, new: true }
        );
      }

      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.warn('MongoDB POST Sessions Notice:', dbErr?.message || dbErr);
      return NextResponse.json({ success: false, fallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save sessions' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();

      if (sessionId) {
        await ChatSessionModel.deleteOne({ userId, id: sessionId });
      } else {
        await ChatSessionModel.deleteMany({ userId });
      }

      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.warn('MongoDB DELETE Sessions Notice:', dbErr?.message || dbErr);
      return NextResponse.json({ success: false, fallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete session' }, { status: 500 });
  }
}
