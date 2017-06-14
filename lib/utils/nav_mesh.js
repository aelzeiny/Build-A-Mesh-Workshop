import PriorityQueue from 'js-priority-queue';
class NavMesh {
  constructor(verticies, edges = []) {
    this.verts = {};
    verticies.forEach(pt => {this.addNode(pt);});

    // assume singly connected edges
    for(let i=0;i<edges.length;i++) {
      let from = this.findNode(edges[i][0]);
      let to = this.findNode(edges[i][1]);
      from.connect(to);
    }
  }

  getVerts() {
    return Object.values(this.verts);
  }

  addNode(pt) {
    const key = this._hash(pt);
    this.verts[key] = new NavNode(pt);
    return this.verts[key];
  }

  findNode(pt) {
    return this.verts[this._hash(pt)];
  }

  removeNode(node) {
    const key = this._hash(node.value);
    for(let i=0;i<node.neighbors.length;i++)
      node.neighbors[i].removeNode(node);
    delete this.verts[key];
  }

  connectNodes(nodeA, nodeB) {
    nodeA.connect(nodeB);
    nodeB.connect(nodeA);
  }

  disconnectNodes(nodeA, nodeB) {
    nodeA.disconnect(nodeB);
    nodeB.disconnect(nodeA);
  }

  /// Bi-Directional connection is not assumed by default
  connect(ptA, ptB, isBidi = false) {
    ptA.connect(ptB);
    if(isBidi)
      ptB.connect(ptA);
  }

  aStar(start, end) {
    // OPEN = priority queue containing START
    const open = new PriorityQueue({comparator: (a, b) => b - a});
    // CLOSED = empty set.
    // In this implementation we're combining closed & CostSoFar
    // since we need other sets to keep track of cost and origin
    const cameFrom = {};
    const costSoFar = {};
    // Put start in priority queue & friends
    const sHash = this._hash(start.value); 
    const openContianer = {};
    open.queue(start, 0);
    cameFrom[sHash] = null;
    costSoFar[sHash] = 0;
    // while lowest rank in OPEN is not the GOAL:
    while(open.length !== 0) {
      // current = remove lowest rank item from OPEN
      const current = open.dequeue();
      const cHash = this._hash(current.value);
      
      // In this implementation, we're not going to exit when you found the goal
      // if (current === end)
      //   break;
      // for neighbors of current:
      for(let i = 0; i < current.neighbors.length; i++) {
        const n = current.neighbors[i];
        const nHash = this._hash(n.value);
        const e = current.edges[i];
        // cost = g(current) + movementcost(current, neighbor)
        const newCost = costSoFar[cHash] + e; 
        // if neighbor in OPEN and cost less than g(neighbor):
        if (!costSoFar[nHash] || newCost < costSoFar[nHash]) {
          // remove neighbor from OPEN, because new path is better
          costSoFar[nHash] = newCost;
          const priority = newCost + this._estimateCost(n, end);
          open.queue(n, priority);
          cameFrom[nHash] = current;
        }
      }
    }
    // reconstruct reverse path from goal to start by following parents
    const path = [];
    // return empty array if no path exists
    if (!cameFrom[this._hash(end.value)])
      return path;
    for(let curr = end, currHash = this._hash(end.value); curr !== start; curr = cameFrom[currHash], currHash = this._hash(curr.value)) {
      path.push(curr.value);
    }
    path.push(start.value);
    return path;
  }

  _estimateCost(a, b) {
    return a.distance(b);//Math.pow(b.value.X - a.value.X, 2) + Math.pow(b.value.Y - a.value.Y, 2);
  }

  // 229 will suffice as a prime number here
  _hash(pt) {
    return (15485867 + pt.X) * 15485867 + pt.Y;
  }
}

class NavNode {
  constructor(pt) {
    this.value = pt;
    this.edges = [];
    this.neighbors = [];
  }

  connect(other) {
    this.neighbors.push(other);
    this.edges.push(this.distance(other));
  }

  disconnect(other) {
    let i = this.neighbors.indexOf(other);
    if(i < 0)
      return;
    this.neighbors.splice(i, 1);
  }

  distance(other) {
    return Math.sqrt(Math.pow(this.value.X - other.value.X, 2) + Math.pow(this.value.Y - other.value.Y, 2));
  }


  _estimateCost(other) {
    return Math.pow(other.value.X - this.value.X, 2) + Math.pow(other.value.Y - this.value.Y, 2);
  }

  removeNode(other) {
    for(let i=0;i<this.neighbors.length;i++) {
      if(this.neighbors[i].value === other.value) {
        this.neighbors.splice(i, 1);
        this.edges.splice(i, 1);
        return;
      }
    }
  }
}


export default NavMesh;
