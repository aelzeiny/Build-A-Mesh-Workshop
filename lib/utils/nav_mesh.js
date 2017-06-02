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

  removeNode(other) {
    for(let i=0;i<this.neighbors;i++) {
      if(this.neighbors[i].value === other.value) {
        this.neighbors.splice(i, 1);
        this.edges.splice(i, 1);
        return;
      }
    }
  }
}

class NavMesh {
  constructor(verticies, edges = []) {
    this.verts = {};
    verticies.forEach(pt => {this.addNode(pt);});

    // assume singly connected edges
    for(let i=0;i<edges.length;i++) {
      let from = edges[i][0];
      let to = edges[i][1];
      this.verts[from].addEdge(to);
    }
  }

  addNode(pt, idx) {
    const key = this._hash(pt);
    this.verts[key] = new NavNode(pt);
    return this.verts[key];
  }

  removeNode(node) {
    const key = this._hash(node.value);
    for(let i=0;i<node.neighbors;i++)
      node.neighbors[i].removeNode(node);
    delete this.verts[key];
  }

  /// Bi-Directional connection is not assumed by default
  connect(ptA, ptB, isBidi = false) {
    ptA.connect(ptB);
    if(isBidi)
      ptB.connect(ptA);
  }

  // 229 will suffice as a prime number here
  _hash(pt) {
    return (229 + pt.X) * 229 + pt.Y;
  }
}

export default NavMesh;
