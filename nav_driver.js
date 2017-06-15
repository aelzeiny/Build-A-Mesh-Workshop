import Main from './lib/main';

/**** DOCUMENT *****/
document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  const controls = document.getElementById("controls");
  const resize = () => {
    canvasEl.width = window.innerWidth - 280;
    canvasEl.height = window.innerHeight - 30;
    controls.setAttribute("style", `height: ${window.innerHeight - 28}px`);
  };
  resize();
  window.addEventListener("resize", resize);
  const views = new Array(7);
  for(let i=0;i<7;i++) {
    views[i] = document.getElementById("step-" + i);
  }

  const main = new Main(canvasEl, views);

  // Control events
  document.getElementById("percentWalls").addEventListener("change", e => main.wallsPercent(e.currentTarget.value));
  document.getElementById("percentWalls").addEventListener("input", e => main.wallsPercent(e.currentTarget.value));
  document.getElementById("regenAutoma").addEventListener("click", (e) => main.regenAutoma());
  document.getElementById("clipperPlus").addEventListener("click", (e) => main.polygonClip(true));
  document.getElementById("clipperMinus").addEventListener("click", (e) => main.polygonClip(false));


  // Step Flow Events
  document.getElementById("next-0").addEventListener("click", (e) => main.next(0));
  document.getElementById("next-1").addEventListener("click", (e) => main.next(1));
  document.getElementById("next-2").addEventListener("click", (e) => main.next(2));
  document.getElementById("next-4").addEventListener("click", (e) => main.next(4));
  document.getElementById("next-5").addEventListener("click", (e) => main.next(5));
  // document.getElementById("reset").addEventListener("click", (e) => main.next(-1));

  // Mouse sensory events
  window.addEventListener("keydown", (e) => main.keyDown(e.keyCode), true);
  window.addEventListener("keyup", (e) => main.keyUp(e.keyCode), true);
  canvasEl.addEventListener("mousemove", main.mousemove.bind(main));
  canvasEl.addEventListener("mousedown", main.mousedown.bind(main));
  canvasEl.addEventListener("mouseup", main.mouseup.bind(main));
  canvasEl.addEventListener("mousewheel", main.mousewheel.bind(main));
  window.addEventListener("DOMMouseScroll", main.mousewheel.bind(main));
  window.addEventListener("resize", main.setSize.bind(main));
  main.start();
});
