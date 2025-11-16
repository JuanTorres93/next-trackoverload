import '@testing-library/jest-dom';
// DOC react-testing-library configuration for vitest: https://www.robinwieruch.de/vitest-react-testing-library/
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

import { mockServer } from './mocks/mockServer';

expect.extend(matchers);

beforeAll(() => mockServer.listen());
afterAll(() => mockServer.close());
afterEach(() => {
  cleanup();
  mockServer.resetHandlers();
});
