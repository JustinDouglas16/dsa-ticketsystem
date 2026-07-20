export function mergeSort<T>(
  items: T[],
  compare: (first: T, second: T) => number,
): T[] {
  if (items.length <= 1) {
    return [...items];
  }

  const middleIndex = Math.floor(items.length / 2);

  const leftHalf = items.slice(0, middleIndex);
  const rightHalf = items.slice(middleIndex);

  const sortedLeftHalf = mergeSort(leftHalf, compare);
  const sortedRightHalf = mergeSort(rightHalf, compare);

  return merge(sortedLeftHalf, sortedRightHalf, compare);
}
