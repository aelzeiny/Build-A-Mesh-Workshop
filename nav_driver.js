import Main from './lib/main';

/**** DOCUMENT *****/
document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  const resize = () => {
    canvasEl.width = window.innerWidth - 30;
    canvasEl.height = window.innerHeight - 30;
  };
  resize();
  window.addEventListener("resize", resize);
  const main = new Main(canvasEl);
  main.start();
  window.addEventListener("keydown", (e) => main.keyDown(e.keyCode), true);
  window.addEventListener("keyup", (e) => main.keyUp(e.keyCode), true);
  window.addEventListener("mousemove", main.mousemove.bind(main));
  window.addEventListener("mousedown", main.mousedown.bind(main));
  window.addEventListener("mouseup", main.mouseup.bind(main));
  window.addEventListener("mousewheel", main.mousewheel.bind(main));
  window.addEventListener("DOMMouseScroll", main.mousewheel.bind(main));
});
