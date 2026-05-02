export const isRunningInCICD = Boolean(
  process.env.CI || process.env.GITHUB_ACTIONS,
);
