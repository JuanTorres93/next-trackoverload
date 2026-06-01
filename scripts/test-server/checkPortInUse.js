const { execSync } = require("node:child_process");

// Port is defined in package.json
const NEXT_TEST_PORT = 3033;
exports.NEXT_TEST_PORT = NEXT_TEST_PORT;

function isPortInUse() {
  try {
    execSync(`ss -tulpn | grep :${NEXT_TEST_PORT}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}
exports.isPortInUse = isPortInUse;
