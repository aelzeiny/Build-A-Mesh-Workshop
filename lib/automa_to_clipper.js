import ClipperMap from './clipper_map';
import concaveman from 'concaveman';
import * as ClipperLib from 'js-clipper';


class AutomaToClipperConverter {
  constructor(automa, grid) {
    this.automa = automa.Map;
    this.grid = grid;
    this.edges = {};
    // find all points on edges. O(n^2)
    for(let i=0;i<this.automa.length;i++) {
      for(let j=0;j<this.automa[i].length;j++) {
        const neighs = this._getNeighbors(i, j);
        if(this.automa[i][j] && this._isOnEdgeCardinally(i,j))
          this.edges[this._hash(i, j)] = [i,j];
      }
    }

    this._seperatePolys();

    this._concaveman();
  }

  generateClipper() {
    const clipperPolys = new Array(this.seperatedPolys.length);
    for(let i=0; i<this.seperatedPolys.length; i++) {
      clipperPolys[i] = this.seperatedPolys[i].map((pt) => {
          return new ClipperLib.IntPoint (
            pt[1], pt[0]
          );
       });
    }
    return new ClipperMap(clipperPolys);
  }

  _concaveman() {
    for(let i=0;i<this.seperatedPolys.length;i++) {
      this.seperatedPolys[i] = concaveman(this.seperatedPolys[i], .5, 3);
    }
  }

  _seperatePolys() {
    this.touchedPoints = {};
    this.seperatedPolys = [];
    const edges = Object.values(this.edges);
    for(let i=0;i<edges.length;i++) {
      this.streak = [];
      this._touch(edges[i]);
      if(this.streak.length >= 3)
        this.seperatedPolys.push(this.streak);
    }
    // cleanup
    this.touchedPoints = undefined;
    this.streak = undefined;
  }

  _touch(edge) {
    const hashMe = this._hash(edge[0], edge[1]);
    // if point is already visited - visit no more
    if(this.touchedPoints[hashMe])
      return;
    this.touchedPoints[hashMe] = edge;
    // if point is edge but point is not yet touched
    if(this.edges[hashMe]) {
      const displayEdge = [
        edge[0]*this.grid + this.grid,
        edge[1]*this.grid + this.grid
      ];
      this.streak.push(displayEdge);
      const neighs = this._getNeighbors(edge[0], edge[1]);
      for(let i=0;i<neighs.length;i++)
        this._touch(neighs[i]);
    }
  }


  // 15,485,867 will suffice as a prime number here
  _hash(r,c) {
    return (15485867 + r) * 15485867 + c;
  }

  _isOnEdgeDiagonally(x,y) {
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

  _isOnEdgeCardinally(r,c) {
    const a = this.automa;
    if(this._rowInBounds(r-1) && !this.automa[r-1][c])
      return true;
    if(this._rowInBounds(r+1) && !this.automa[r+1][c])
      return true;
    if(this._colInBounds(c-1) && !this.automa[r][c-1])
      return true;
    if(this._colInBounds(c+1) && !this.automa[r][c+1])
      return true;
    return false;
  }

  _rowInBounds(r) {
    return r >= 0 && r < this.automa.length;
  }

  _colInBounds(c) {
    return c >= 0 && c < this.automa[0].length;
  }

  _getNeighbors(x,y) {
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

  // Draw the converter as a game object only for debugging purposes
  draw(ctx) {
    // const edges = Object.values(this.edges);
    // for(let i=0;i<edges.length;i++){
    //   ctx.beginPath();
    //   const r = edges[i][0];
    //   const c = edges[i][1];
    //   ctx.rect(c*this.grid, r*this.grid, this.grid, this.grid);
    //   ctx.fillStyle = "red";
    //   ctx.fill();
    // }
  }
}

export default AutomaToClipperConverter;
