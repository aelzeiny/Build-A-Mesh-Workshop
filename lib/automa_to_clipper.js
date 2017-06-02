class AutomaToClipperConverter {
  constructor(automa, grid) {
    this.automa = automa.Map;
    this.grid = grid;
    this.edges = {};
    // find all points on edges. O(n^2)
    for(let i=0;i<this.automa.length;i++) {
      for(let j=0;j<this.automa[i].length;j++) {
        const neighs = this.getNeighbors(i, j);
        if(this.automa[i][j] && this.isOnEdgeCardinally(i,j))
          this.edges[this._hash(i, j)] = [i,j];
      }
    }

    this.seperateEdges();
  }

  seperateEdges() {
    this.touchedPoints = {};
    this.seperatedPoints = [];
    const edges = Object.values(this.edges);
    for(let i=0;i<edges.length;i++) {
      this.streak = [];
      this.touch(edges[i]);
      if(this.streak.length >= 3)
        this.seperatedPoints.push(this.streak);
    }
    window.toRender = this.seperatedPoints[0];
    window.allRenders = this.seperatedPoints;
  }

  touch(edge) {
    const hashMe = this._hash(edge[0], edge[1]);
    // if point is already visited - visit no more
    if(this.touchedPoints[hashMe])
      return;
    this.touchedPoints[hashMe] = edge;
    // if point is edge but point is not yet touched
    if(this.edges[hashMe]) {
      this.streak.push(edge);
      const neighs = this.getNeighbors(edge[0], edge[1]);
      for(let i=0;i<neighs.length;i++)
        this.touch(neighs[i]);
    }
  }


  // 15,485,867 will suffice as a prime number here
  _hash(r,c) {
    return (15485867 + r) * 15485867 + c;
  }

  isOnEdgeDiagonally(x,y) {
    for(let i=x-1;i<=x+1;i++) {
      for(let j=y-1;j<=y+1;j++) {
        if((i===x && j===y) || i < 0 || j < 0
          || i >= this.automa.length || j >= this.automa[i].length)
            continue;
        if(!this.automa[i][j])
          return true;
      }
    }
    return false;
  }

  isOnEdgeCardinally(r,c) {
    const a = this.automa;
    if(this.rowInBounds(r-1) && !this.automa[r-1][c])
      return true;
    if(this.rowInBounds(r+1) && !this.automa[r+1][c])
      return true;
    if(this.colInBounds(c-1) && !this.automa[r][c-1])
      return true;
    if(this.colInBounds(c+1) && !this.automa[r][c+1])
      return true;
    return false;
  }

  rowInBounds(r) {
    return r >= 0 && r < this.automa.length;
  }

  colInBounds(c) {
    return c >= 0 && c < this.automa[0].length;
  }

  getNeighbors(x,y) {
    const answer = [];
    for(let i=x-1;i<=x+1;i++) {
      for(let j=y-1;j<=y+1;j++) {
        if((i===x && j===y) || i < 0 || j < 0
          || i >= this.automa.length || j >= this.automa[i].length)
            continue;
        if(this.automa[i][j])
          answer.push([i,j]);
      }
    }
    return answer;
  }

  draw(ctx) {
    for(let i=0;i<window.toRender.length;i++){
      ctx.beginPath();
      const r = window.toRender[i][0];
      const c = window.toRender[i][1];
      ctx.rect(c*this.grid, r*this.grid, this.grid, this.grid);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  }
}

export default AutomaToClipperConverter;
