export function isNextRedirectError(error: unknown): boolean {
  return error instanceof Error && /.*NEXT_REDIRECT.*/i.test(error.message);
}
