export default class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) this.adjacencyList.set(node, []);
  }

  addEdge(from, to) {
    this.addNode(from);
    this.addNode(to);
    const neighbors = this.adjacencyList.get(from);
    if (!neighbors.includes(to)) neighbors.push(to);
  }

  hasNode(node) {
    return this.adjacencyList.has(node);
  }

  hasEdge(from, to) {
    return this.getNeighbors(from).includes(to);
  }

  getNodes() {
    return [...this.adjacencyList.keys()];
  }

  getNeighbors(node) {
    return [...(this.adjacencyList.get(node) || [])];
  }
}

export const navigationGraph = new Graph();
const routes = ["/catalog", "/favorites", "/planner"];

routes.forEach((route) => navigationGraph.addNode(route));
routes.forEach((from) => {
  routes.forEach((to) => {
    if (from !== to) navigationGraph.addEdge(from, to);
  });
});
