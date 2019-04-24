// Helper to emulate python's range function
export const range = (end: number, start: number = 0): number [] => {
  return [...Array(end - start).keys()].map((value) => value + start);
};


export const maximumBy = <T>(array: T[], comparisonFunction: (element: T) => number): T | null => {
  let valueForCurrentMaximum: number | null = null;
  return array.reduce((maximum: T, element: T) => {
    const valueForCurrentElement = comparisonFunction(element);
    if (valueForCurrentMaximum === null ||
        (valueForCurrentMaximum < valueForCurrentElement)) {
      [maximum, valueForCurrentMaximum] = [element, valueForCurrentElement];
    }
    return maximum;
  }, null);
}


export const minimumBy = <T>(array: T[], comparisonFunction: (element: T) => number): T | null => {
  return maximumBy(array, (element: T) => comparisonFunction(element) * -1);
}
