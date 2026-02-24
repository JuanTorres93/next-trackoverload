import { AppCreateUserUsecase } from '@/interface-adapters/app/use-cases/user';
import { AppAuthService } from '@/interface-adapters/app/services/AppAuthService';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();
    const { email, plainPassword, name } = body;

    const newUser = await AppCreateUserUsecase.execute({
      email,
      plainPassword,
      name,
    });

    const token = AppAuthService.generateToken(newUser.id);

    const response = NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.log('app/api/auth/register: Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
