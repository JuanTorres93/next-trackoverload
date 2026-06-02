export function isTestRuntime(): boolean {
  return (
    process.env.NODE_ENV === "test" || process.env.MOBILE_TESTING === "true"
  );
}

export function isTestingMobile(): boolean {
  return process.env.MOBILE_TESTING === "true";
}
