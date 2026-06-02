import { JSENDFailure } from "shared";

import { isDomainError } from "@/domain/common/errors";
import { logNoTest } from "@/utils/logNoTest";

export function handleActionErrors(error: Error): JSENDFailure {
  logNoTest(`Error in server action`);
  logNoTest(error.stack || error.message);

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
