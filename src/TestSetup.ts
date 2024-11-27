import * as matchers from "@testing-library/jest-dom/matchers";
import userEvent from "@testing-library/user-event";
import { expect, MockInstance } from "vitest";

import "@testing-library/jest-dom";
import "vitest-canvas-mock";

expect.extend(matchers);

// Fix vi bug where TextEncoder is not defined;

export let useDispatchSpy: MockInstance;
export const globalMockDispatch = vi.fn();

export const setupUserEvents = (options?: Parameters<typeof userEvent.setup>[0]) => {
  const { applyAccept = false, skipHover = false, delay = null } = options || {};

  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime, applyAccept, skipHover, delay });
};

beforeAll(() => {
  globalThis.jest = {
    ...vi,
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  };

  Object.defineProperty(window, 'matchMedia', {
    value: () => {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {}
      };
    }
})
});
