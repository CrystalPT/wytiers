import { NextRequest, NextResponse } from 'next/server';

// Get NameMC avatar URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');

    if (!uuid) {
      return NextResponse.json(
        { error: 'UUID is required', success: false },
        { status: 400 }
      );
    }

    // NameMC uses a direct URL format for avatars
    const avatarUrl = `https://mc-heads.net/avatar/${uuid}/128`;

    return NextResponse.json({
      avatarUrl,
      success: true
    });
  } catch (error) {
    console.error('Error generating avatar URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar URL', success: false },
      { status: 500 }
    );
  }
}

