import { JSENDResponse } from "shared";

export type HandledJSENDResponse<T> = {
  isSuccess: boolean;
  data: T | null;
  errorComponent: React.ReactNode | null;
};

export function handleJSENDResponse<T>(
  response: JSENDResponse<T>,
): HandledJSENDResponse<T> {
  if (response.status === "success") {
    return {
      isSuccess: true,
      data: response.data,
      errorComponent: null,
    };
  }

  // TODO IMPORTANT: Improve error component
  const errorComponent = (
    <div className="p-4 text-red-700 bg-red-100 rounded">
      <p className="font-bold">Error</p>
    </div>
  );

  return {
    isSuccess: false,
    data: null,
    errorComponent,
  };
}
