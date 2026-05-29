export function isTestRuntime(): boolean {
  return process.env.NODE_ENV === "test" || process.env.APP_ENV === "test";
}