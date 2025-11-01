import { NextRequest, NextResponse } from 'next/server';

// Fetch UUID from Mojang API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required', success: false },
        { status: 400 }
      );
    }

    // Call Mojang API to get UUID
    const response = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Player not found', success: false },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch UUID from Mojang API');
    }

    const data = await response.json();

    return NextResponse.json({
      uuid: data.id,
      username: data.name,
      success: true
    });
  } catch (error) {
    console.error('Error fetching UUID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UUID', success: false },
      { status: 500 }
    );
  }
}

