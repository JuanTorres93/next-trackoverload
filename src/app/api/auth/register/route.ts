import { AppAuthService } from '@/interface-adapters/app/services/AppAuthService';
import { AppCreateUserUsecase } from '@/interface-adapters/app/use-cases/user';

import { JSENDResponse } from '@/app/_types/JSEND';
import { AlreadyExistsError, ValidationError } from '@/domain/common/errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookieSessionName } from '../cookie';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, plainPassword, name } = body;

    const newUser = await AppCreateUserUsecase.execute({
      email,
      plainPassword,
      name,
    });

    const token = await AppAuthService.generateToken(newUser.id);

    const response = NextResponse.redirect(new URL('/app', request.url));

    response.cookies.set(cookieSessionName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('app/api/auth/register: Error creating user:', error);

    return handleErrors(error as Error);
  }
}

function handleErrors(error: Error): NextResponse<JSENDResponse<string>> {
  if (error instanceof AlreadyExistsError) {
    return NextResponse.json(
      {
        status: 'fail' as const,
        data: { email: 'Este email ya está registrado.' },
      },
      { status: 409 },
    );
  }

  if (error instanceof ValidationError) {
    const errorMessage = error.message;
    let passwordErrorMessage = 'Error al crear el usuario.';

    if (/Password.*at least.*characters/i.test(errorMessage)) {
      passwordErrorMessage = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (/Password.*one.*uppercase.*letter/i.test(errorMessage)) {
      passwordErrorMessage =
        'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (/Password.*one.*lowercase.*letter/i.test(errorMessage)) {
      passwordErrorMessage =
        'La contraseña debe contener al menos una letra minúscula.';
    }
    if (/Password.*one.*number/i.test(errorMessage)) {
      passwordErrorMessage = 'La contraseña debe contener al menos un número.';
    }
    if (/Password.*one.*special.*character/i.test(errorMessage)) {
      passwordErrorMessage =
        'La contraseña debe contener al menos un carácter especial.';
    }

    return NextResponse.json(
      {
        status: 'fail' as const,
        data: {
          password: passwordErrorMessage,
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
