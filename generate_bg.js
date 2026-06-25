const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const WIDTH = 1160;
const HEIGHT = 740;
const OUTPUT = path.join(__dirname, 'sprites', 'bg.png');

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function drawPixelGrid() {
  const dotColor = '#e8dcc8';
  const spacing = 20;
  ctx.save();
  ctx.fillStyle = dotColor;
  ctx.globalAlpha = 0.35;

  for (let x = 0; x <= WIDTH; x += spacing) {
    for (let y = 0; y <= HEIGHT; y += spacing) {
      ctx.fillRect(x, y, 1, 1);
    }
  }

  ctx.restore();
}

function drawMountainRange() {
  const mountainColor = '#9aacb8';
  ctx.save();
  ctx.fillStyle = mountainColor;
  ctx.globalAlpha = 0.9;

  const peaks = [];
  for (let x = 0; x <= WIDTH; x += 18) {
    const ridge = 95 + ((x / 60) % 4) * 12 + (Math.sin(x / 40) * 8) + (x % 70 < 35 ? 6 : -2);
    peaks.push([x, ridge]);
  }

  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.75);
  peaks.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(WIDTH, HEIGHT * 0.75);
  ctx.closePath();
  ctx.fill();

  // second softer layer for depth
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.78);
  for (let x = 0; x <= WIDTH; x += 25) {
    const y = 125 + (Math.cos(x / 50) * 10) + ((x / 120) % 2) * 12 + (x % 180 < 90 ? 4 : -4);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(WIDTH, HEIGHT * 0.78);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawMaitigharMandala() {
  const x = WIDTH * 0.5;
  const y = HEIGHT * 0.78;
  const r = 78;

  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#8B0000';
  ctx.fillStyle = '#8B0000';
  ctx.lineWidth = 2;

  // faint circular silhouette
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // inner radial lines
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * (r + 12), y + Math.sin(angle) * (r + 12));
    ctx.stroke();
  }

  // subtle outer ring
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  ctx.arc(x, y, r + 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawCrosses() {
  const color = '#C41E3A';
  const count = 40;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 1;

  for (let i = 0; i < count; i++) {
    const x = rand(0, WIDTH);
    const y = rand(0, HEIGHT);
    const size = rand(2, 6);

    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGroundLine() {
  ctx.save();
  ctx.strokeStyle = '#c4a882';
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 620);
  ctx.lineTo(WIDTH, 620);
  ctx.stroke();
  ctx.restore();
}

function main() {
  // Base background
  ctx.fillStyle = '#f5efe0';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle pixel grid
  drawPixelGrid();

  // Mountains
  drawMountainRange();

  // Protest crosses
  drawCrosses();

  // Mandala watermark
  drawMaitigharMandala();

  // Ground line
  drawGroundLine();

  const out = fs.createWriteStream(OUTPUT);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', () => {
    console.log('Generated ' + OUTPUT);
  });

  out.on('error', (err) => {
    console.error('Failed to write image:', err);
    process.exit(1);
  });
}

main();
