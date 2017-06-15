import Interface from './interface';
import DrawInterface from './draw_interface';
import ClipperMap from './clipper_map';
import AutomaMap from './automa_map';
import Vector from './utils/vector';
import NavMesh from './utils/nav_mesh';
import NavMeshAnimator from './nav_mesh_animator';
import Navigator from './navigator';
import AutomaToClipperConverter from './automa_to_clipper';
import WekDriver from './wek/wek_driver';
import * as COLORS from './utils/colors';

const GRID = 20;
class Main {
  constructor(canvas, views) {
    this.canvas = canvas;
    this.setSize();

    this.automa = new AutomaMap (
      Math.floor(this.canvas.height / GRID),
      Math.floor(this.canvas.width / GRID), GRID
    );

    this.views = views;
  }

  next(input) {
    console.log("NEXT: ", input);
    // oh, you know, just some casual METAPROGRAMMING
    // ... no biggie :p
    if(input < 0)
      this.reset();
    else
      this["next" + input].apply(this, arguments);
  }
  next0() {
    this._switchView(1);

    this.automa.RandomFillMap();
    this.automa.MakeCaverns();
    this.gameObjects = [this.automa];
  }

  next1() {
    const converter = new AutomaToClipperConverter(this.automa, GRID);
    this.clipperMap = converter.generateClipper();
    this.interface = new DrawInterface(this.clipperMap);
    this.gameObjects = [this.interface, this.clipperMap];
    this._switchView(2);

    this.automa = undefined;
  }

  next2() {
    // this.navMesh = new NavMesh(this.clipperMap);
    this.gameObjects.splice(0,1);
    this.playerDrop = true;
    this._switchView(3);
  }

  next3() {
    this.playerDrop = undefined;
    const doneFunct = () => {
      this.next(4);
    };
    this.navMeshAnimator = new NavMeshAnimator(this.offsetMap, doneFunct);
    this.gameObjects = [this.navMeshAnimator, this.offsetMap, this.clipperMap];
    this._switchView(4);

    this.interface = undefined;
  }

  next4() {
    this.mesh = this.navMeshAnimator.generateMesh();
    this.navigator =
      new Navigator(this.mesh, this.offsetMap, this.clipperMap.startPoint);
    this.gameObjects = [this.navigator, this.clipperMap];
    this._switchView(5);

    this.navMeshAnimator = undefined;
  }

  next5() {
    // NB: Wek is the sound a penguin makes
    this.wek = new WekDriver(this.navigator, this.clipperMap.paths, this.clipperMap.holesI);
    this.gameObjects = [this.wek];
    this._switchView(6);
  }

  reset() {
    // remove all surperflous stored objects on this class
    this.clipperMap = this.wek = this.mesh = this.navigator =
      this.interface = this.automa = this.playerDrop =
      this.navMeshAnimator = this.offsetMap = undefined;
  }

  ensureMeshSelected(pt) {
    this.offsetMap = this.clipperMap.selectPrimaryMesh(pt);
    if(this.offsetMap)
      this.next(3);
  }

  wallsPercent(value) {
    this.automa.PercentAreWalls = value;
    this.automa.RandomFillMap();
    this.automa.MakeCaverns();
  }

  regenAutoma() {
    this.automa.RandomFillMap();
    this.automa.MakeCaverns();
  }

  polygonClip(isUnion) {
    this.clipperMap.isUnion = isUnion;
  }

  start() {
    const ctx = this.canvas.getContext("2d");
    this.currentTime = new Date().getTime();
    const animateCallback = () => {
      this.update();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw(ctx);
      requestAnimationFrame(animateCallback);
    };
    animateCallback();
  }

  update() {
    const delta = new Date().getTime() - this.currentTime;
    this._update(delta);
    this.currentTime += delta;
  }

  draw(ctx) {
    if(!this.wek)
      this._drawGrid(ctx);
    for (var i = this.gameObjects.length - 1; i >= 0; i--)
      this.gameObjects[i].draw(ctx);
  }


  _update(delta) {
    for (var i = this.gameObjects.length - 1; i >= 0; i--)
      if(this.gameObjects[i].update)
        this.gameObjects[i].update(delta);
  }

  _drawGrid(ctx) {
    ctx.strokeStyle = COLORS.GRID_LINES;
    ctx.lineWidth = .1;

    for(let x=0;x<this.width;x+=GRID) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for(let y=0;y<this.height;y+=GRID) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
    ctx.lineWidth = .2;
    for(let x=0;x<this.width;x+=GRID*5) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for(let y=0;y<this.height;y+=GRID*5) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
  }

  _switchView(idx) {
    for(let i=0;i<this.views.length;i++)
      this._setVisibility(i, i === idx);
  }

  _setVisibility(idx, isVisible) {
    // this.views[idx].setAttribute("style",
    //   isVisible ? "visibility: visible;" : "visibility: hidden;");
    this.views[idx].setAttribute("class",
      isVisible ? "step active" : "step");
  }

  /********* EVENT LISTENERS ***********/
  setSize() {
    this.width = this.canvas.getAttribute("width");
    this.height = this.canvas.getAttribute("height");
    if(this.automa) {
      this.automa.setSize(this.width, this.height);
    }
  }
  keyDown(keyCode) {
    if(this.interface)
      this.interface.keyDown(keyCode);
  }

  keyUp(keyCode) {

  }

  mousemove(e) {
    if(this.wek)
      this.wek.mousemove(this.getMousePos(e));
    else if(this.interface)
      this.interface.mousemove(this.getMousePos(e));
    else if(this.navigator)
      this.navigator.mousemove(this.getMousePos(e));
  }

  mousedown(e) {
    if(this.playerDrop)
      this.ensureMeshSelected(this.getMousePos(e));
    if(this.interface)
      this.interface.mousedown(this.getMousePos(e));
  }

  mouseup(e) {
    if(this.interface)
      this.interface.mouseup(this.getMousePos(e));
  }

  getMousePos(e) {
    var rect = this.canvas.getBoundingClientRect();
    let x = e.x - rect.left;
    let y =  e.y - rect.top;
    return new Vector(x, y);
  }

  mousewheel(e) {
    // if you ever want to implement zoom or pan:
    //https://stackoverflow.com/questions/2916081/
  }

}

export default Main;
