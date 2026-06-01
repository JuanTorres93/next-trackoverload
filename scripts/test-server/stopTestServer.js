#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");
const { isPortInUse, NEXT_TEST_PORT } = require("./checkPortInUse");

if (!isPortInUse()) {
  console.log(
    `No test server running on port ${NEXT_TEST_PORT}. Nothing to stop.`,
  );

  process.exit(0);
}

console.log(`Stopping test server on port ${NEXT_TEST_PORT}...`);

try {
  execSync(`fuser -k ${NEXT_TEST_PORT}/tcp`, {
    stdio: "inherit",
    shell: true,
  });

  console.log("Test server stopped.");
} catch {
  console.error("Failed to stop test server.");

  process.exit(1);
}
