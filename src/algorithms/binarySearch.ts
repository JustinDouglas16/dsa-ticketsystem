export function binarySearch<T, K>(
  // T = Ticket, K = string
  items: T[],
  target: K,
  compare: (item: T, target: K) => number,
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
