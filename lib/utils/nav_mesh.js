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

  /// Bi-Directional connection is not assumed by default
  connect(ptA, ptB, isBidi = false) {
    ptA.connect(ptB);
    if(isBidi)
      ptB.connect(ptA);
  }

  aStar(start, end) {
    const closed = {};
    const q = new PriorityQueue({comparator: (a, b) => a - b});
    const beginning = [start];
    beginning.totalCost = 0;
    q.queue(beginning, 0.0);
    while(q.length !== 0) {
      debugger;
      const p = q.dequeue();
      const pLast = p[p.length - 1];
      const pHash = this._hash(pLast. value);
      // if closed contains the last item in p
      if (closed[pHash])
        continue;
      if(pLast === end)
        return p;
      closed[pHash] = pLast;
      for(let i=0;i<pLast.neighbors.length;i++) {
        const n = pLast.neighbors[i];
        p.push(n);
        p.totalCost += this._estimateCost(n, end);
        q.queue(p, p.totalCost);
      }
    }
    return null;
  }

  _estimateCost(a, b) {
    return Math.pow(b.value.X - a.X, 2) + Math.pow(b.Y - a.Y, 2);
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

  distance(other) {
    return Math.sqrt(Math.pow(this.X - other.X, 2) + Math.pow(this.Y - other.Y, 2));
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
