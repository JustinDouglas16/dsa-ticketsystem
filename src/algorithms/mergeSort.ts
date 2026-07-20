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

function merge<T>(
  left: T[],
  right: T[],
  compare: (first: T, second: T) => number,
): T[] {
  const result: T[] = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    const leftItem = left[leftIndex];
    const rightItem = right[rightIndex];

    if (compare(leftItem, rightItem) <= 0) {
      result.push(leftItem);
      leftIndex++;
    } else {
      result.push(rightItem);
      rightIndex++;
    }
  }

  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }

  return result;
}
