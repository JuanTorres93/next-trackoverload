import { isTestRuntime } from "../application-layer/utils/isTestRuntime";

export function logNoTest(message: string): void {
  if (isTestRuntime()) {
    return;
  }

  console.log(message);
}
