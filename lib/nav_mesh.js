class NavNode {
  constructor() {
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
}

class NavMesh {
  constructor(verticies, edges = []) {
    this.verts = {};
    verticies.forEach(pt => {this.addNode(pt);});

    for(let i=0;i<edges.length;i+=2) {
      let from = edges[i];
      let to = edges[i+1];
      this.verts[from].addEdge(to);
    }
  }

  addNode(pt) {
    this.verts[this._hash(pt)] = pt;
  }

  connect(ptA, ptB) {
    ptA.connect(ptB);
    ptB.connect(ptA);
  }

  // 229 will suffice as a prime number here
  _hash(pt) {
    return (229 + pt.X) * 229 + pt.Y;
  }
}

export default NavMesh;
