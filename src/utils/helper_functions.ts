// Helper to emulate python's range function
export const range = (end: number, start: number = 0): number [] => {
  return [...Array(end - start).keys()].map((value) => value + start);
};

// Helper to find the element in a homogenous list for which an element returns
// the highest numerical value
export const maximumBy = <T>(array: T[], valueFunction: (element: T) => number): T | null => {
  let valueForCurrentMaximum: number | null = null;
  return array.reduce((maximum: T, element: T) => {
    const valueForCurrentElement = valueFunction(element);
    if (valueForCurrentMaximum === null ||
        (valueForCurrentMaximum < valueForCurrentElement)) {
      [maximum, valueForCurrentMaximum] = [element, valueForCurrentElement];
    }
    return maximum;
  }, null);
};

// Helper to find the element in a homogenous list for which an element returns
// the lowest numerical value
export const minimumBy = <T>(array: T[], valueFunction: (element: T) => number): T | null => {
  return maximumBy(array, (element: T) => valueFunction(element) * -1);
};

// Helper to get a random element from an array.
export const sample = <T>(array: T[]): T | null => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex] || null;
};
