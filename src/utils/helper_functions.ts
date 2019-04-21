// Helper to emulate python's range function
export const range = (end: number, start: number = 0): number [] => {
  return [...Array(end - start).keys()].map((value) => value + start);
};
