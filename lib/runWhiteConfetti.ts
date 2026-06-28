import confetti from 'canvas-confetti';

const WHITE_COLORS = ['#FFFFFF', '#FAF7EF', '#F0EDE6', '#E8E4DC'];

let confettiInstance: ReturnType<typeof confetti.create> | null = null;
let canvas: HTMLCanvasElement | null = null;

export function runWhiteConfetti(
  container: HTMLElement,
  event?: { clientX: number; clientY: number }
) {
  if (!canvas || !container.contains(canvas)) {
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '200';
    container.appendChild(canvas);
    confettiInstance = confetti.create(canvas, { resize: true, useWorker: true });
  }

  const fire = confettiInstance!;
  const rect = container.getBoundingClientRect();
  const origin = event
    ? {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      }
    : { x: 0.5, y: 0.55 };

  fire({
    particleCount: 70,
    spread: 72,
    startVelocity: 40,
    origin,
    colors: WHITE_COLORS,
    ticks: 200,
    gravity: 0.85,
    scalar: 0.95,
    shapes: ['square', 'circle'],
  });

  fire({
    particleCount: 45,
    spread: 110,
    startVelocity: 30,
    origin: { x: origin.x, y: Math.max(0.1, origin.y - 0.04) },
    colors: WHITE_COLORS,
    ticks: 220,
    gravity: 0.75,
    scalar: 0.8,
  });
}
