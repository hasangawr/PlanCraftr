import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { afterEach } from 'vitest';

afterEach(cleanup);
afterEach(vi.restoreAllMocks);
