import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // TODO: Add real authentication here
    // Example: Check against database, hash password, etc.
    
    // Demo: Accept a test user
    if (username === 'testbruker' && password === 'test123') {
      return NextResponse.json({
        success: true,
        user: {
          username,
          name: 'Test Bruker',
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Feil brukernavn eller passord',
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Noe gikk galt',
      },
      { status: 500 }
    );
  }
}
