export function logNoTest(message: string): void {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  console.log(message);
}
