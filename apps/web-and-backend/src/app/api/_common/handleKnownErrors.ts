import { NextResponse } from "next/server";

import {
  AlreadyExistsError,
  DomainError,
  NotFoundError,
  PermissionError,
  ValidationError,
  isDomainError,
} from "../../../domain/common/errors";
import { JSENDFailure } from "../../_types/JSEND";

export function handleKnownErrors(error: Error): NextResponse<JSENDFailure> {
  const jsend: JSENDFailure = {
    status: "fail",
    data: {},
  };
  let statusCode = 500;
  let errorMessage =
    "Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde.";

  if (process.env.NODE_ENV !== "test") console.error("Domain error:", error);

  if (isDomainError(error)) {
    errorMessage = error.message;
    statusCode = getStatusForApplicationError(error);
  }

  jsend.data = { message: errorMessage };

  return NextResponse.json(jsend, {
    status: statusCode,
  });
}

function getStatusForApplicationError(err: DomainError): number {
  if (err instanceof AlreadyExistsError) return 409;
  if (err instanceof NotFoundError) return 404;
  if (err instanceof PermissionError) return 404;
  if (err instanceof ValidationError) return 400;

  return 500;
}
