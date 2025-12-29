/// <reference types="vitest" />
// jest-dom/vitest adds custom vitest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { setImmediate } from 'node:timers';

// adds setImmediate to vitest to not throw errors
vi.stubGlobal('setImmediate', setImmediate);

// adds ResizeObserver to vitest to not throw errors
// Install and add a polyfill here if this mock is not enough
vi.stubGlobal(
  'ResizeObserver',
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
);

// To prevent accidental real requests in your tests & tests crash.
// Replace this with more advanced solutions if this is not enough.
vi.stubGlobal(
  'XMLHttpRequest',
  vi.fn(() => ({
    readyState: 4,
    timeout: 0,
    responseType: 'json',
    response: '"mockResponse"',
    responseText: '"mockResponseText"',
    status: 200,
    statusText: 'OK',
    upload: {},
    withCredentials: false,
    send: vi.fn(function () {
      this.onload();
    }),
    open: vi.fn(),
    abort: vi.fn(),
    getAllResponseHeaders: vi.fn(),
    getResponseHeader: vi.fn(),
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    overrideMimeType: vi.fn(),
    onreadystatechange: vi.fn(),
    removeEventListener: vi.fn(),
    setRequestHeader: vi.fn(),
  }))
);

// To prevent accidental real requests in your tests & tests crash.
// The mock is not complete, update it if you need.
// Replace this with more advanced solutions if this is not enough.
vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: '',
      json: vi.fn((async) => 'fetchJsonMock'),
      text: vi.fn((async) => 'fetchTextMock'),
      blob: vi.fn((async) => 'fetchBlobMock'),
    })
  )
);

Object.defineProperty(window, Symbol.for('socket'), {
  writable: true,
  value: {
    socket: {
      on: vi.fn(),
      off: vi.fn(),
    },
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    disconnect: vi.fn(),
  },
});
