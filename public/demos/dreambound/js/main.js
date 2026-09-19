window.addEventListener("load", () => {
  "use strict";
  const canvas = document.getElementById("gameCanvas");
  const game = new window.DR.Game(canvas);
  window.DreamboundRealm = game;
  requestAnimationFrame((time) => game.loop(time));
});
