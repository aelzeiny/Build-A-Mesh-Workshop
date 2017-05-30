import * as ClipperLib from '../node_modules/js-clipper/clipper.js'
class Map {
  constructor() {
    this.clipper = new ClipperLib.Clipper();
  }
}
export default Map;
