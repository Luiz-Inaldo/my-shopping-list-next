import { debounce } from "@/functions/debounce";

describe("debounce Utility Function", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call the function after the delay", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);

    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should only call the function once if called multiple times within the delay", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(1000);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
