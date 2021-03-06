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

// Helper function to scale a number from one range to another.
export const scale = (
  value: number,
  initialMin: number,
  initialMax: number,
  finalMin: number,
  finalMax: number): number => {
    const initialRange = initialMax - initialMin;
    const finalRange = finalMax - finalMin;
    const diff = ((value - initialMin) * finalRange) / initialRange;
    return finalMin + diff;
};

// Helper to round a decimal to the provided number of decimal places
export const round = (value: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
};

export function camelToSnakeCase(value: string): string {
  return value.replace(/([A-Z])/g, (...args) => {
    const match = args[0];
    const offset = args[args.length - 2];
    const prefix = offset > 0 ? "_" : "";
    return prefix + match.toLowerCase();
   });
}

export function snakeToCamelCase(value: string): string {
  return value.replace(/_([a-z])/g, (_, capturedGroup) => {
    return capturedGroup.toUpperCase();
  });
}

export function groupBy<K, V>(array: V[], callback: (element: V) => K): Map<K, V[]> {
  const map: Map<K, V[]> = new Map([]);
  array.forEach((element) => {
    const key = callback.call(this, element);
    const value = (map.get(key) || []);
    value.push(element);
    map.set(key, value);
  });
  return map;
}

export function isEmpty<T extends {length: number}>(val: T): boolean {
  return !val.length;
}

export function hasKey<T>(obj: T, key: keyof any): key is keyof T {
  return key in obj;
}
