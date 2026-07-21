export interface BinarySearchResult<T> {
  item: T | undefined;
  index: number;
  comparisons: number;
}

export function binarySearch<T, K>(
  items: T[],
  target: K,
  compare: (item: T, target: K) => number,
): BinarySearchResult<T> {
  let leftIndex = 0;
  let rightIndex = items.length - 1;
  let comparisons = 0;

  while (leftIndex <= rightIndex) {
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    const middleItem = items[middleIndex];

    comparisons++;

    const comparison = compare(middleItem, target);

    if (comparison === 0) {
      return {
        item: middleItem,
        index: middleIndex,
        comparisons,
      };
    }

    if (comparison < 0) {
      leftIndex = middleIndex + 1;
    } else {
      rightIndex = middleIndex - 1;
    }
  }

  return {
    item: undefined,
    index: -1,
    comparisons,
  };
}
