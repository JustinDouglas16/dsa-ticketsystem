export function binarySearch<T>(
  items: T[],
  target: T,
  compare: (item: T, target: T) => number,
): T | undefined {
  let leftIndex = 0;
  let rightIndex = items.length - 1;

  while (leftIndex <= rightIndex) {
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    const middleItem = items[middleIndex];
    const comparison = compare(middleItem, target);

    if (comparison === 0) {
      return middleItem;
    }

    if (comparison < 0) {
      leftIndex = middleIndex + 1;
    } else {
      rightIndex = middleIndex - 1;
    }
  }

  return undefined;
}
