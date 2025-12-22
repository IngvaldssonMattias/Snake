const COLORS = ["#f2c14e", "#e63946", "#a8dadc", "#457b9d", "#ff6b6b", "#ffb400"];
const CONFETTI_COUNT = 120;
const GRAVITY = 0.0875;

class Celebration {
  constructor() {
    this.confettiCanvas = document.createElement("canvas");
    this.confettiCanvas.id = "confetti-canvas";
    this.confettiCanvas.style.position = "fixed";
    this.confettiCanvas.style.inset = "0";
    this.confettiCanvas.style.pointerEvents = "none";
    this.confettiCanvas.style.zIndex = "9998";
    document.body.appendChild(this.confettiCanvas);

    this.ctx = this.confettiCanvas.getContext("2d");
    this.confetti = [];
    this.confettiActive = false;
    this.gravityDirection = 1;
    this.waveCount = 0;
    this.waveLocked = false;

    this.resizeCanvas = this.resizeCanvas.bind(this);
    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();

    this.fireworksContainer = document.getElementById("fireworks-container");
  }

  resizeCanvas() {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  createConfetti() {
    this.confetti = [];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      this.confetti.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * -300,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 0.5 + 0.5,
        size: 6 + Math.random() * 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  createConfettiPuff(x, y) {
    const PUFF_COUNT = 20;
    for (let i = 0; i < PUFF_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      this.confetti.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 3,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  showFireworks() {
    if (!this.fireworksContainer) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = Math.random() * vw;
    const cy = Math.random() * vh * 0.6;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.classList.add("firework");
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.style.setProperty("--x", (Math.random() - 0.5) * 500 + "px");
      p.style.setProperty("--y", (Math.random() - 0.5) * 500 + "px");
      this.fireworksContainer.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }

    this.createConfettiPuff(cx, cy);
  }

  updateConfetti() {
    if (!this.confettiActive) return;

    this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    let countInZone = 0;

    this.confetti.forEach((p) => {
      p.vy += GRAVITY * this.gravityDirection;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;

      if (
        (this.gravityDirection === 1 && p.y > this.confettiCanvas.height * 0.75) ||
        (this.gravityDirection === -1 && p.y < this.confettiCanvas.height * 0.25)
      ) {
        countInZone++;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    });

    if (!this.waveLocked && countInZone > this.confetti.length * 0.6) {
      this.gravityDirection *= -1;
      this.waveCount++;
      this.waveLocked = true;
      this.confetti.forEach((p) => (p.vy *= -0.7));
      setTimeout(() => (this.waveLocked = false), 600);
    }

    if (this.waveCount >= 5) {
      this.confettiActive = false;
      this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      return;
    }

    requestAnimationFrame(() => this.updateConfetti());
  }

  startCelebration() {
    this.waveCount = 0;
    this.confettiActive = true;
    this.gravityDirection = 1;
    this.waveLocked = false;

    this.createConfetti();
    this.updateConfetti();

    let fireworkCount = 0;
    const interval = setInterval(() => {
      this.showFireworks();
      fireworkCount++;
      if (fireworkCount >= 15) clearInterval(interval);
    }, 500);
  }
}

export const celebration = new Celebration();
