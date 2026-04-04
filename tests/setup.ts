// These next 2 imports are for removing default behaviors of react-testing-library of showing HTML in failed tests
import { configure as domConfigure } from "@testing-library/dom";
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { configure as reactConfigure } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

import "./mocks/nextjs";

vi.mock("@zxing/library", () => import("./mocks/zxing"));

expect.extend(matchers);

// IntersectionObserver is not implemented in jsdom; provide a no-op stub
vi.stubGlobal(
  "IntersectionObserver",
  vi.fn(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  })),
);

afterEach(() => {
  cleanup();
});

// Remove HTML from error messages to make them cleaner
const testingLibraryConfig = {
  getElementError: (message: string | null) => {
    const error = new Error(message ?? "Query failed");
    error.name = "TestingLibraryElementError";
    return error;
  },
};

domConfigure(testingLibraryConfig);
reactConfigure(testingLibraryConfig);
