import { pullAt } from "lodash-es";

export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  // Remove the item from the original index
  const item: T = pullAt(array, fromIndex)[0];

  if (item) {
    // Insert the item at the new index
    array.splice(toIndex, 0, item);
  }

  return array;
}
