export default class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) this.adjacencyList.set(vertex, []);
  }

  addEdge(from, to) {
    this.addVertex(from);
    this.addVertex(to);
    const neighbors = this.adjacencyList.get(from);
    if (!neighbors.includes(to)) neighbors.push(to);
  }

  getVertices() {
    return [...this.adjacencyList.keys()];
  }

  getNeighbors(vertex) {
    return [...(this.adjacencyList.get(vertex) || [])];
  }
}
