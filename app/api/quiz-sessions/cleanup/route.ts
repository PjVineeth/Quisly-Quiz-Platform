import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QuizSession from '@/lib/models/QuizSession';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Remove sessions older than configured TTL (default 2 hours)
    const ttlHoursEnv = process.env.QUIZ_SESSION_TTL_HOURS;
    const ttlHours = ttlHoursEnv ? Number(ttlHoursEnv) : 2;
    const ttlMs = isNaN(ttlHours) ? 2 * 60 * 60 * 1000 : ttlHours * 60 * 60 * 1000;
    const thresholdDate = new Date(Date.now() - ttlMs);
    
    const result = await QuizSession.deleteMany({
      startTime: { $lt: thresholdDate }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} old sessions`
    });

  } catch (error) {
    console.error('Error cleaning up sessions:', error);
    return NextResponse.json(
      { message: 'Failed to cleanup sessions' },
      { status: 500 }
    );
  }
}
