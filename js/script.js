const sphereCanvas = document.createElement("canvas");
const context = sphereCanvas.getContext("2d"),
  sphereWidth = (sphereCanvas.width = 420),
  sphereHeight = (sphereCanvas.height = 420);

document.body.appendChild(sphereCanvas);

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  rotateX(amount) {
    let y = this.y;
    this.y = y * Math.cos(amount) + this.z * Math.sin(amount) * -1.0;
    this.z = y * Math.sin(amount) + this.z * Math.cos(amount);
  }

  rotateY(amount) {
    let x = this.x;
    this.x = x * Math.cos(amount) + this.z * Math.sin(amount) * -1.0;
    this.z = x * Math.sin(amount) + this.z * Math.cos(amount);
  }

  rotateZ(amount) {
    let x = this.x;
    this.x = x * Math.cos(amount) + this.y * Math.sin(amount) * -1.0;
    this.y = x * Math.sin(amount) + this.y * Math.cos(amount);
  }

  getProjection(distance, xy, offSet, offSetZ) {
    return (distance * xy) / (this.z - offSetZ) + offSet;
  }

  draw(x, y, size, color) {
    context.save();
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, size, 0, 2 * Math.PI, true);
    context.fill();
    context.restore();
  }
}

class Sphere {
  constructor(radius = 20.0) {
    this.point = [];
    this.color = "rgb(100,0,255)";
    this.radius = radius;
    this.numberOfVertexes = 0;

    this.rotation = 0;
    this.distance = 0;

    this.init();
  }

  init() {
    for (let alpha = 0; alpha <= 6.28; alpha += 0.17) {
      let p = (this.point[this.numberOfVertexes] = new Point());

      p.x = Math.cos(alpha) * this.radius;
      p.y = 0;
      p.z = Math.sin(alpha) * this.radius;

      this.numberOfVertexes++;
    }

    for (let direction = 1; direction >= -1; direction -= 2) {
      for (let beta = 0.17; beta < Math.PI; beta += 0.17) {
        let radius = Math.cos(beta) * this.radius;
        let fixedY = Math.sin(beta) * this.radius * direction;

        for (let alpha = 0; alpha < 6.28; alpha += 0.17) {
          let p = (this.point[this.numberOfVertexes] = new Point());

          p.x = Math.cos(alpha) * radius;
          p.y = fixedY;
          p.z = Math.sin(alpha) * radius;

          this.numberOfVertexes++;
        }
      }
    }
  }

  draw() {
    let x, y;
    let p = new Point();

    for (let i = 0; i < this.numberOfVertexes; i++) {
      p.x = this.point[i].x;
      p.y = this.point[i].y;
      p.z = this.point[i].z;

      p.rotateX(this.rotation);
      p.rotateY(this.rotation);
      p.rotateZ(this.rotation);

      x = p.getProjection(this.distance, p.x, sphereWidth / 2.0, 100.0);
      y = p.getProjection(this.distance, p.y, sphereHeight / 2.0, 100.0);

      if (x >= 0 && x < sphereWidth) {
        if (y >= 0 && y < sphereHeight) {
          if (p.z < 0) {
            p.draw(x, y, 1, "rgba(200,200,200,0.6)");
          } else {
            p.draw(x, y, 1, "rgb(255,255,255)");
          }
        }
      }
    }
  }

  update() {
    this.rotation += Math.PI / 360.0;

    if (this.distance < 1000) {
      this.distance += 10;
    }
  }
}

const sphere = new Sphere();

function draw() {
  window.requestAnimationFrame(draw);

  context.save();
  context.clearRect(0, 0, sphereWidth, sphereHeight);

  sphere.draw();

  context.restore();

  sphere.update();
}

draw();
