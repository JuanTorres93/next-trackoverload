import { AppAuthService } from '@/interface-adapters/app/services/AppAuthService';
import { AppLoginUsecase } from '@/interface-adapters/app/use-cases/auth/Login/login';
import { JSENDResponse } from '@/app/_types/JSEND';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookieSessionName } from '../cookie';
import { AuthError } from '@/domain/common/errors';

export async function POST(
  _req: NextRequest,
): Promise<NextResponse<JSENDResponse<string>>> {
  try {
    const body = await _req.json();
    const { email, plainPassword } = body;

    const newUser = await AppLoginUsecase.execute({
      email,
      plainPassword,
    });

    const token = await AppAuthService.generateToken(newUser.id);

    const response = NextResponse.json(
      {
        status: 'success' as const,
        data: 'User logged in successfully',
      },
      { status: 200 },
    );

    response.cookies.set(cookieSessionName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('app/api/auth/login: Error logging in user:', error);

    return handleErrors(error as Error);
  }
}

function handleErrors(error: Error): NextResponse<JSENDResponse<string>> {
  if (error instanceof AuthError) {
    return NextResponse.json(
      {
        status: 'fail' as const,
        data: {
          authError: 'Email o contraseña incorrectos.',
        },
      },
      { status: 422 },
    );
  }

  // Unhandled errors
  return NextResponse.json(
    {
      status: 'error' as const,
      message: 'Error al crear el usuario.',
    },
    { status: 500 },
  );
}
