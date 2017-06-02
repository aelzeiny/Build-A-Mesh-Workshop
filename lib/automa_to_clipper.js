class AutomaToClipperConverter {
  constructor(automa, grid) {
    this.automa = automa.Map;
    this.grid = grid;
    this.edges = [];
    for(let i=0;i<this.automa.length;i++) {
      for(let j=0;j<this.automa[i].length;j++) {
        const neighs = this.getNeighbors(i, j);
        if(this.automa[i][j] && this.isOnEdgeDiagonally(i,j))
          this.edges.push([i,j]);
      }
    }
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
    for(let i=0;i<this.edges.length;i++){
      ctx.beginPath();
      const r = this.edges[i][0];
      const c = this.edges[i][1];
      ctx.rect(c*this.grid, r*this.grid, this.grid, this.grid);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  }
}

export default AutomaToClipperConverter;
