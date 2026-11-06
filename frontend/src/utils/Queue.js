export default class Queue {
  constructor(items = []) {
    this.items = [...items];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }

  toArray() {
    return [...this.items];
  }
}
