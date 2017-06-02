class AutomaToClipperConverter {
  constructor(automa) {
    this.automa = automa.grid;
    for(let i=0;i<this.automa.length;i++) {
      for(let j=0;j<this.automa[j].length;j++) {
        const neighs = this.getNeighbors(i,j);
      }
    }
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
}

export default AutomaToClipperConverter;
