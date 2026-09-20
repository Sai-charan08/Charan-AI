import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserModel } from '@/lib/db/models';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, displayName, photoURL, settings } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();

      const updatedUser = await UserModel.findOneAndUpdate(
        { userId },
        {
          userId,
          email: email || '',
          displayName: displayName || '',
          photoURL: photoURL || '',
          lastLoginAt: Date.now(),
          ...(settings ? { settings } : {}),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return NextResponse.json({ success: true, user: updatedUser });
    } catch (dbErr: any) {
      console.warn('MongoDB User Sync Notice:', dbErr?.message || dbErr);
      return NextResponse.json({ success: false, fallback: true, message: 'Database fallback mode active' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to sync user' }, { status: 500 });
  }
}
