// T means generic class means it can have different values
export class PriorityQueue<T> {
  private heap: T[] = [];

  private readonly compare: (first: T, second: T) => number;

  constructor(compare: (first: T, second: T) => number) {
    this.compare = compare;
  }

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
    return this.heap[0];
  }

  toArray(): T[] {
    return [...this.heap];
  }

  /**
   * enqueue() adds an item to the Priority Queue.
   * The steps are:
   * Add the item to the end of the array.
   * Compare the item with its parent.
   * Does the item have a higher priority? Swap the two.
   * Repeat until the heap is correct.
   */

  enqueue(item: T) {
    this.heap.push(item);
    this.bubbleUp();
  }

  //   dequeue
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const highestPriorityItem = this.heap[0];
    const lastItem = this.heap.pop();

    if (lastItem === undefined) {
      return undefined;
    }

    this.heap[0] = lastItem;
    this.bubbleDown();

    return highestPriorityItem;
  }

  // bubbleUp()
  private bubbleUp(): void {
    let currentIndex = this.heap.length - 1;
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);

      const currentItem = this.heap[currentIndex];
      const parentItem = this.heap[parentIndex];

      const currentHasHigherPriority =
        this.compare(currentItem, parentItem) > 0;

      if (!currentHasHigherPriority) {
        break;
      }

      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  // bubbleDown()
  private bubbleDown(): void {
    let currentIndex = 0;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);

      let highestPriorityIndex = currentIndex;

      if (
        leftChildIndex < this.heap.length &&
        this.compare(
          this.heap[leftChildIndex],
          this.heap[highestPriorityIndex],
        ) > 0
      ) {
        highestPriorityIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.heap.length &&
        this.compare(
          this.heap[rightChildIndex],
          this.heap[highestPriorityIndex],
        ) > 0
      ) {
        highestPriorityIndex = rightChildIndex;
      }

      if (highestPriorityIndex === currentIndex) {
        break;
      }

      this.swap(currentIndex, highestPriorityIndex);
      currentIndex = highestPriorityIndex;
    }
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
