
class Interface {
  public Interface(map) {
    this.map = map;
  }

  update(deltaTime) {}


  mousedown(pt) {
    this.mouseDrag = true;
  }

  mousemove() {
    if(this.mouseDrag) {
      console.log('dragon');
    }
  }

  mouseup(pt) {
    this.mouseDrag = false;
  }

  draw(ctx) {

  }
}

export default Interface;
