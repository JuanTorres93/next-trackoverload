import { JSENDFailure } from "@/app/_types/JSEND";
import { isDomainError } from "@/domain/common/errors";

export function handleActionErrors(error: Error): JSENDFailure {
  const jsend: JSENDFailure = {
    status: "fail",
    data: {},
  };

  let errorMessage =
    "Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde.";

  if (isDomainError(error)) {
    errorMessage = error.message;
  }

  jsend.data = { message: errorMessage };

  return jsend;
}
