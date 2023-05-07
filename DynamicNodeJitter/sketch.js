// Constants and global variables
const xSpacing = 8;
const maxWaves = 4;
const numParticles = 50;
const numNodes = 5;
const tickleDistance = 20;

let waveWidth;
let theta = 0.0;
let amplitudes = new Array(maxWaves);
let dx = new Array(maxWaves);
let yValues;
let particles = [];

let centerX = 0.0,
  centerY = 0.0;
let radius = 45,
  rotationAngle = -90;
let accelerationX = 0.0,
  accelerationY = 0.0;
let deltaX = 0.0,
  deltaY = 0.0;
let springiness = 0.0009,
  dampingFactor = 0.98;
let nodeStartX = [],
  nodeStartY = [],
  nodeX = [],
  nodeY = [],
  angle = [],
  frequency = [];
let organicConstant = 1.0;

// Particle class definition
class Particle {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.radius = random(1, 8);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-1, 1.5);
  }

  createParticle() {
    noStroke();
    fill('rgba(200,169,169,0.5)');
    circle(this.x, this.y, this.radius);
  }

  moveParticle() {
    this.tickle();
    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  tickle() {
    let distance = dist(this.x, this.y, mouseX, mouseY);
    if (distance < tickleDistance) {
      this.x += random(-1, 2);
      this.y += random(-2, 1);
    }
  }

  joinParticles(particles) {
    particles.forEach(element => {
      let distance = dist(this.x, this.y, element.x, element.y);
      if (distance < 85) {
        stroke('rgba(255,255,255,0.04)');
        line(this.x, this.y, element.x, element.y);
      }
    });
  }
}

function setup() {
  const canvas = createCanvas(710, 400);
  frameRate(30);
  colorMode(RGB, 255, 255, 255, 100);
  waveWidth = width + 16;
  centerX = width / 2;
  centerY = height / 2;

  // Center the canvas in the middle of the screen
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  canvas.position(x, y);

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

    for (let i = 0; i < maxWaves; i++) {
    amplitudes[i] = random(10, 30);
    const period = random(100, 300);
    dx[i] = (TWO_PI / period) * xSpacing;
  }

  for (let i = 0; i < numNodes; i++) {
    nodeStartX[i] = 0;
    nodeStartY[i] = 0;
    nodeX[i] = 0;
    nodeY[i] = 0;
    angle[i] = 0;
  }

  for (let i = 0; i < numNodes; i++) {
    frequency[i] = random(5, 12);
  }

  yValues = new Array(floor(waveWidth / xSpacing));
}

function draw() {
  background(0);
  drawGradient();
  drawShape();
  moveShape();
  renderParticles();
  calculateWave();
  renderWave();
}

function drawGradient() {
  const gradient = createGraphics(width, height);
  const startColor = color(100, 100, 100);
  const endColor = color(0, 0, 0);

  gradient.noFill();
  for (let x = 0; x < gradient.width; x++) {
    const inter = map(x, 0, gradient.width, 0, 1);
    const c = lerpColor(startColor, endColor, inter);
    gradient.stroke(c);
    gradient.line(x, 0, x, gradient.height);
  }

  image(gradient, 0, 0);
}

function drawShape() {
  calculateNodePositions();

  curveTightness(organicConstant);
  fill(255);
  beginShape();
  for (let i = 0; i < numNodes; i++) {
    curveVertex(nodeX[i], nodeY[i]);
  }
  for (let i = 0; i < numNodes - 1; i++) {
    curveVertex(nodeX[i], nodeY[i]);
  }
  endShape(CLOSE);
}

function calculateNodePositions() {
  for (let i = 0; i < numNodes; i++) {
    nodeStartX[i] = centerX + cos(radians(rotationAngle)) * radius;
    nodeStartY[i] = centerY + sin(radians(rotationAngle)) * radius;
    rotationAngle += 360.0 / numNodes;
  }
}

function moveShape() {
  deltaX = mouseX - centerX;
  deltaY = mouseY - centerY;

  deltaX *= springiness;
  deltaY *= springiness;
  accelerationX += deltaX;
  accelerationY += deltaY;

  centerX += accelerationX;
  centerY += accelerationY;

  accelerationX *= dampingFactor;
  accelerationY *= dampingFactor;

  organicConstant = 1 - ((abs(accelerationX) + abs(accelerationY)) * 0.1);

  for (let i = 0; i < numNodes; i++) {
    if (dist(mouseX, mouseY, nodeStartX[i], nodeStartY[i]) < tickleDistance) {
      nodeStartX[i] += random(-0.5, 0.1);
      nodeStartY[i] += random(-0.5, 0.1);
    }
        nodeX[i] = nodeStartX[i] + sin(radians(angle[i])) * (accelerationX * 2);
    nodeY[i] = nodeStartY[i] + sin(radians(angle[i])) * (accelerationY * 2);
    angle[i] += frequency[i];
  }
}

function renderParticles() {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.createParticle();
    particle.moveParticle();
    // particle.joinParticles(particles.slice(i)); // Comment out this line to remove the connecting lines
  }
}

function calculateWave() {
  theta += 0.02;
  yValues.fill(0);

  for (let j = 0; j < maxWaves; j++) {
    let x = theta;
    for (let i = 0; i < yValues.length; i++) {
      yValues[i] += (j % 2 === 0 ? sin(x) : cos(x)) * amplitudes[j];
      x += dx[j];
    }
  }
}

function renderWave() {
  noStroke();
  fill(255, 50);
  ellipseMode(CENTER);
  for (let x = 0; x < yValues.length; x++) {
    ellipse(x * xSpacing, width / 2 + yValues[x], 16, 16);
  }
}

function windowResized() {
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  canvas.position(x, y);
}
