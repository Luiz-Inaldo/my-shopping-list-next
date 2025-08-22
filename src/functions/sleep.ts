/**
 * Sleep for a given number of seconds.
 * @param s The number of seconds to sleep.
 * @returns A promise that resolves after the specified time.
 */
export const sleep = (s: number) =>  new Promise((resolve) => setTimeout(resolve, (s * 1000)));