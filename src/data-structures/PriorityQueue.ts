// T means generic class means it can have different values
export class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private readonly compare: (first: T, second: T) => number) {}

// This function returns the number of items in the queue.
  size(): number {
    return this.heap.length;
  }

// This function returns true when queueu is empty or false when one or more items are in the queue.
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

// peek() examines the most important item without deleting it. 
// When the queue is empty, index 0 does not exist. Therefore, the function can return undefined.
  peek(): T | undefined {
    return this.heap.[0];
  }

  private getParentIndex(index: number): number {
  return Math.floor((index - 1) / 2);
}

private getLeftChildIndex(index: number): number {
  return 2 * index + 1;
}

private getRightChildIndex(index: number): number {
  return 2 * index + 2;
}

private swap(firstIndex: number, secondIndex: number): void {
const temporaryItem = this.heap[firstIndex];

this.heap[firstIndex] = this.heap[secondIndex];
this.heap[secondIndex] = temporaryItem;
}

// can also be written like this
/**
 * private swap(firstIndex: number, secondIndex: number): void {
  [this.heap[firstIndex], this.heap[secondIndex]] = [
    this.heap[secondIndex],
    this.heap[firstIndex],
  ];
}
 */
}
