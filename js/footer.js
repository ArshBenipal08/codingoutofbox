// import Controls from "./controls";
var canvas = document.querySelector("#paper");
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;
var w = window.innerWidth / 2;
var h = window.innerWidth / 2;
var ctx = canvas.getContext("2d");
var settings = {
  countInLayer: 20,
  layerCount: 15,
  maxBlur: 40,
  maxFalloff: 60,
  radius: 3,
  maxSpeed: 1,
};
// new Controls(settings, document.querySelector("div.ctrls"));
var positions = [];
function makePositions() {
  positions = [];
  for (var x = 0; x < settings.layerCount; x++) {
    var layer = [];
    for (var y = 0; y < settings.countInLayer / (x * 2 + 1); y++) {
      layer.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedX: Math.random() * settings.maxSpeed - settings.maxSpeed / 2,
        speedY: Math.random() * settings.maxSpeed - settings.maxSpeed / 2,
      });
    }
    positions.push(layer);
  }
}
makePositions();
var draw = function (t) {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  for (var x = 0; x < positions.length; x++) {
    ctx.filter = "blur(".concat(
      ((settings.maxBlur / settings.layerCount) * x) / 5,
      "px)"
    );
    ctx.fillStyle = "rgba(255, 255, 255, ".concat(
      ((settings.layerCount / settings.maxFalloff) * 1) / x,
      ")"
    );
    for (var y = 0; y < positions[x].length; y++) {
      var margin =
        settings.radius * x + 1 + (settings.maxBlur / settings.layerCount) * x;
      positions[x][y].x += positions[x][y].speedX;
      positions[x][y].y += positions[x][y].speedY;
      if (positions[x][y].x > width + margin) positions[x][y].x = 0 - margin;
      if (positions[x][y].x < 0 - margin) positions[x][y].x = width + margin;
      if (positions[x][y].y > height + margin) positions[x][y].y = 0 - margin;
      if (positions[x][y].y < 0 - margin) positions[x][y].y = height + margin;
      ctx.beginPath();
      ctx.arc(
        positions[x][y].x,
        positions[x][y].y,
        settings.radius * x + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
};
draw(1);
document.getElementById("drawButton").addEventListener("click", function () {
  makePositions();
});
