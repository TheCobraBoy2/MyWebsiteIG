const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

const PARTICLE_COUNT = 30;

const CONFIG = {
  RADIUS_MIN: 2,
  RADIUS_RANGE: 3,

  DX_RANGE: 0.3,
  DY_MIN: 0.1,
  DY_RANGE: 0.4,

  ALPHA_MIN: 0.3,
  ALPHA_INITIAL_MIN: 0.5,
  ALPHA_INITIAL_RANGE: 0.5,
  ALPHA_CHANGE_RATE: 0.015,
  ALPHA_LOWER_BOUND: 0.1,

  HUE_BASE: 350,
  HUE_RANGE: 10,

  SHADOW_BLUR: 20,
  FADE_START_FACTOR: 0.85
};

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomBetween(min, range) {
  return Math.random() * range + min;
}

function resetParticle(p) {
  p.x = Math.random() * canvas.width;
  p.y = -p.r;
  p.r = randomBetween(CONFIG.RADIUS_MIN, CONFIG.RADIUS_RANGE);
  p.dx = (Math.random() - 0.5) * CONFIG.DX_RANGE;
  p.dy = randomBetween(CONFIG.DY_MIN, CONFIG.DY_RANGE);
  p.alpha = randomBetween(CONFIG.ALPHA_INITIAL_MIN, CONFIG.ALPHA_INITIAL_RANGE);
  p.hue = randomBetween(CONFIG.HUE_BASE, CONFIG.HUE_RANGE);
}

function createParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => {
    const r = randomBetween(CONFIG.RADIUS_MIN, CONFIG.RADIUS_RANGE);
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r,
      dx: (Math.random() - 0.5) * CONFIG.DX_RANGE,
      dy: randomBetween(CONFIG.DY_MIN, CONFIG.DY_RANGE),
      alpha: randomBetween(CONFIG.ALPHA_INITIAL_MIN, CONFIG.ALPHA_INITIAL_RANGE),
      hue: randomBetween(CONFIG.HUE_BASE, CONFIG.HUE_RANGE)
    };
  });
}

function updateAndDrawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur = CONFIG.SHADOW_BLUR;

  const fadeStart = canvas.height * CONFIG.FADE_START_FACTOR;
  const fadeRange = canvas.height - fadeStart;

  for (const p of particles) {
    p.alpha += (Math.random() - 0.5) * CONFIG.ALPHA_CHANGE_RATE;
    p.alpha = Math.min(1, Math.max(CONFIG.ALPHA_MIN, p.alpha));

    if (p.y > fadeStart) {
      const fadeFactor = 1 - (p.y - fadeStart) / fadeRange;
      p.alpha = Math.min(p.alpha, fadeFactor);
    }

    const color = `hsl(${p.hue}, 100%, 60%)`;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = p.alpha;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.y - p.r > canvas.height || p.alpha < CONFIG.ALPHA_LOWER_BOUND) {
      resetParticle(p);
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(updateAndDrawParticles);
}

createParticles();
updateAndDrawParticles();
