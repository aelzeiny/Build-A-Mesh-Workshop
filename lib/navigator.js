class Navigator {
  constructor(clipperMap, mesh) {
    this.clipperMap = clipperMap;
    this.mesh = mesh;
  }

  mousemove(pt) {
    if(this.clipperMap.contains(pt)) {
      //add node
      this.mesh.addNode(pt);
      // connect node to entire map
    }
  }

  update(delta) {

  }

  draw(ctx) {

  }
}

export default Navigator;
