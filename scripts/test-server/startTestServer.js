#!/usr/bin/env node
"use strict";

const { spawn } = require("child_process");
const { isPortInUse, NEXT_TEST_PORT } = require("./checkPortInUse");

if (isPortInUse()) {
  console.log(
    `Test server already running on port ${NEXT_TEST_PORT}. Skipping start.`,
  );

  process.exit(0);
}

console.log(`Starting test server on port ${NEXT_TEST_PORT}...`);

const child = spawn(
  "npm",
  ["run", "start:test", "-w", "apps/web-and-backend"],
  {
    stdio: "inherit",
    detached: true,
  },
);

child.unref();
