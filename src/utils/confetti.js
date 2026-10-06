// Pure Canvas celebratory confetti explosion effect (zero external dependencies)

export function fireConfetti(canvasRef) {
  const canvas = canvasRef?.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#38bdf8', '#818cf8', '#f43f5e', '#fb7185', '#fbbf24', '#34d399', '#a78bfa'];
  const particleCount = 100;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: width / 2,
      y: height / 2 - 80,
      vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
      vy: Math.sin(angle) * speed - 3 - Math.random() * 4,
      size: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      gravity: 0.22,
      drag: 0.98,
    });
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;
    particles.forEach((p) => {
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRotation;
      p.alpha -= 0.009;

      if (p.alpha > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  render();

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
