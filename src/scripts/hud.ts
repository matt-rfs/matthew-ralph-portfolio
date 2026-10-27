// The seven cards are the layers of one instrument: a dial, built the way a watch is, one part per role.
// Stacked, they line up into one face; apart, each layer shows the part that role added.
//   base plate      the company        56 markers, one per person
//   outer bezel     real estate        the financial scale
//   minute track    property finance   250 ticks, one per unit
//   sub-dial (9)    client operations  the account lifecycle, ~30 accounts
//   sub-dial (3)    sales leadership   15 points around a coach (amber: a person decides)
//   sub-dial (6)    enablement         the research timer, 20–30 → 5–10 minutes
//   hands + jewel   AI                 the mechanism, still being built (amber jewel: a person makes the call)
// Each layer is drawn white-on-transparent; the hologram shader (studio.ts) lights it. A second canvas carries the
// layer's callout, shown only when that role is in focus.

const W = 1200;
const H = 800;
const C = { x: 600, y: 400 };
const ICE = (a: number) => `rgba(222, 248, 252, ${a})`;
const TEAL = (a: number) => `rgba(99, 214, 200, ${a})`;
const AMBER = (a: number) => `rgba(255, 178, 74, ${a})`;
const TAU = Math.PI * 2;

type G = CanvasRenderingContext2D;

const canvas = () => {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  return { c, g };
};
const glow = (g: G, color: string, blur = 10) => {
  g.shadowColor = color;
  g.shadowBlur = blur;
};
const circle = (g: G, x: number, y: number, r: number, stroke: string, w = 2, dash: number[] = []) => {
  g.setLineDash(dash);
  g.strokeStyle = stroke;
  g.lineWidth = w;
  g.beginPath();
  g.arc(x, y, r, 0, TAU);
  g.stroke();
  g.setLineDash([]);
};
const arc = (g: G, x: number, y: number, r: number, a0: number, a1: number, stroke: string, w = 2) => {
  g.strokeStyle = stroke;
  g.lineWidth = w;
  g.beginPath();
  g.arc(x, y, r, a0, a1);
  g.stroke();
};
const dot = (g: G, x: number, y: number, r: number, fill: string) => {
  g.fillStyle = fill;
  g.beginPath();
  g.arc(x, y, r, 0, TAU);
  g.fill();
};
const tick = (g: G, x: number, y: number, a: number, r0: number, r1: number, stroke: string, w = 2) => {
  g.strokeStyle = stroke;
  g.lineWidth = w;
  g.beginPath();
  g.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
  g.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
  g.stroke();
};
const text = (g: G, s: string, x: number, y: number, size: number, fill: string, align: CanvasTextAlign = 'left', weight = 600) => {
  g.font = `${weight} ${size}px "Archivo Variable", system-ui, sans-serif`;
  g.letterSpacing = size < 30 ? '0.14em' : '0';
  g.textAlign = align;
  g.textBaseline = 'middle';
  g.fillStyle = fill;
  g.fillText(s, x, y);
};
// angle for a dial position: 0 at twelve o'clock, clockwise
const at = (k: number, n: number) => (k / n) * TAU - Math.PI / 2;

const SUB = { left: { x: 430, y: 400 }, right: { x: 770, y: 400 }, low: { x: 600, y: 568 } };
const SUB_R = 74;

function layer(id: string, g: G) {
  glow(g, TEAL(0.85), 9);
  switch (id) {
    case 'right-choice': {
      // base plate: the dial's edge, and 56 markers (one per person; every 7th a little stronger)
      circle(g, C.x, C.y, 352, ICE(0.35), 1.5);
      for (let k = 0; k < 56; k++) {
        const a = at(k, 56);
        dot(g, C.x + Math.cos(a) * 326, C.y + Math.sin(a) * 326, k % 7 === 0 ? 6 : 4, ICE(k % 7 === 0 ? 0.95 : 0.7));
      }
      break;
    }
    case 'ralph-realty': {
      // outer bezel: a financial scale, like a tachymeter
      circle(g, C.x, C.y, 392, ICE(0.55), 2);
      circle(g, C.x, C.y, 372, ICE(0.3), 1.2);
      for (let k = 0; k < 60; k++) {
        const a = at(k, 60);
        tick(g, C.x, C.y, a, k % 5 === 0 ? 372 : 380, 392, ICE(k % 5 === 0 ? 0.9 : 0.5), k % 5 === 0 ? 2.4 : 1.4);
      }
      ['0', '100', '250', '500', '750'].forEach((s, k) => {
        const a = at(k * 12, 60); // on every twelfth tick
        const r = 412;
        text(g, s, C.x + Math.cos(a) * r, C.y + Math.sin(a) * r, 18, ICE(0.75), 'center', 650);
      });
      break;
    }
    case 'wasatch': {
      // minute track: 250 ticks, one per unit; the few vacant ones stay faint
      const vacant = new Set([12, 47, 83, 98, 131, 160, 177, 199, 214, 236, 241, 7, 66, 120, 188]);
      for (let k = 0; k < 250; k++) {
        tick(g, C.x, C.y, at(k, 250), 296, 310, ICE(vacant.has(k) ? 0.16 : 0.7), 1.3);
      }
      circle(g, C.x, C.y, 290, ICE(0.22), 1);
      break;
    }
    case 'apex-labs': {
      // sub-dial at nine: the account lifecycle, set-up → service → review → renewal, around ~30 accounts
      const s = SUB.left;
      circle(g, s.x, s.y, SUB_R + 6, ICE(0.28), 1.2);
      for (let k = 0; k < 4; k++) arc(g, s.x, s.y, SUB_R - 10, at(k, 4) + 0.12, at(k + 1, 4) - 0.12, TEAL(0.95), 3);
      for (let k = 0; k < 30; k++) {
        const a = at(k, 30);
        dot(g, s.x + Math.cos(a) * (SUB_R - 26), s.y + Math.sin(a) * (SUB_R - 26), 2.4, ICE(0.8));
      }
      dot(g, s.x, s.y, 4, ICE(0.9));
      break;
    }
    case 'vessel-brand': {
      // sub-dial at three: 15 account executives around the person coaching them
      const s = SUB.right;
      circle(g, s.x, s.y, SUB_R + 6, ICE(0.28), 1.2);
      for (let k = 0; k < 15; k++) {
        const a = at(k, 15);
        const x = s.x + Math.cos(a) * (SUB_R - 14);
        const y = s.y + Math.sin(a) * (SUB_R - 14);
        g.strokeStyle = ICE(0.22);
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(s.x, s.y);
        g.lineTo(x, y);
        g.stroke();
        dot(g, x, y, 4, ICE(0.9));
      }
      glow(g, AMBER(0.9), 10);
      circle(g, s.x, s.y, 12, AMBER(0.95), 2.4);
      dot(g, s.x, s.y, 5, AMBER(1));
      break;
    }
    case 'visiativ': {
      // sub-dial at six: the research timer, 0–30 minutes; 20–30 faint, 5–10 bright
      const s = SUB.low;
      circle(g, s.x, s.y, SUB_R + 6, ICE(0.28), 1.2);
      for (let k = 0; k < 30; k++) tick(g, s.x, s.y, at(k, 30), SUB_R - (k % 5 === 0 ? 14 : 8), SUB_R, ICE(k % 5 === 0 ? 0.8 : 0.4), k % 5 === 0 ? 2 : 1);
      arc(g, s.x, s.y, SUB_R - 22, at(20, 30), at(30, 30), ICE(0.25), 5);
      arc(g, s.x, s.y, SUB_R - 22, at(5, 30), at(10, 30), TEAL(1), 6);
      dot(g, s.x, s.y, 4, ICE(0.9));
      break;
    }
    case 'ai-systems': {
      // the hands and the jewel: the mechanism, still being built (the minute hand is only partly drawn)
      g.strokeStyle = ICE(0.95);
      g.lineWidth = 6;
      g.beginPath();
      const h = at(10, 12);
      g.moveTo(C.x - Math.cos(h) * 30, C.y - Math.sin(h) * 30);
      g.lineTo(C.x + Math.cos(h) * 190, C.y + Math.sin(h) * 190);
      g.stroke();
      g.lineWidth = 3.5;
      g.setLineDash([16, 12]);
      const m = at(2, 12);
      g.beginPath();
      g.moveTo(C.x - Math.cos(m) * 40, C.y - Math.sin(m) * 40);
      g.lineTo(C.x + Math.cos(m) * 280, C.y + Math.sin(m) * 280);
      g.stroke();
      g.setLineDash([]);
      glow(g, AMBER(0.95), 14);
      circle(g, C.x, C.y, 22, AMBER(0.95), 3);
      dot(g, C.x, C.y, 9, AMBER(1));
      break;
    }
  }
  g.shadowBlur = 0;
}

// where each layer's callout points (its part of the dial), and what it says
const CALLOUT: Record<string, { to: [number, number]; side: 'l' | 'r'; y: number; lines: [string, string] }> = {
  'right-choice': { to: [C.x - 326 * Math.cos(Math.PI / 4), C.y - 326 * Math.sin(Math.PI / 4)], side: 'l', y: 120, lines: ['THE TEAM', '56 PEOPLE'] },
  'ralph-realty': { to: [C.x + 392 * Math.cos(-Math.PI / 5), C.y + 392 * Math.sin(-Math.PI / 5)], side: 'r', y: 110, lines: ['THE FINANCIAL CASE', '~$750K A MONTH'] },
  wasatch: { to: [C.x - 303 * Math.cos(Math.PI / 6), C.y + 303 * Math.sin(Math.PI / 6)], side: 'l', y: 660, lines: ['250 UNITS', '92–95% OCCUPIED'] },
  'apex-labs': { to: [SUB.left.x - SUB_R, SUB.left.y], side: 'l', y: 400, lines: ['~30 ACCOUNTS', '+30% RECURRING'] },
  'vessel-brand': { to: [SUB.right.x + SUB_R, SUB.right.y], side: 'r', y: 400, lines: ['15 AES', '+35% DEAL SIZE'] },
  visiativ: { to: [SUB.low.x + SUB_R * 0.7, SUB.low.y + SUB_R * 0.7], side: 'r', y: 680, lines: ['RESEARCH PER LEAD', '20–30 → 5–10 MIN'] },
  'ai-systems': { to: [C.x + 18, C.y - 18], side: 'r', y: 130, lines: ['THE MECHANISM', 'STILL BUILDING'] },
};

function callout(id: string, g: G) {
  const k = CALLOUT[id];
  if (!k) return;
  const x = k.side === 'l' ? 40 : W - 40;
  const elbow = k.side === 'l' ? 200 : W - 200;
  glow(g, TEAL(0.8), 6);
  g.strokeStyle = ICE(0.7);
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(k.to[0], k.to[1]);
  g.lineTo(elbow, k.y);
  g.lineTo(x, k.y);
  g.stroke();
  dot(g, k.to[0], k.to[1], 5, ICE(1));
  const align = k.side === 'l' ? 'left' : 'right';
  text(g, k.lines[0], x, k.y - 26, 18, ICE(0.7), align, 650);
  text(g, k.lines[1], x, k.y + 22, 30, ICE(1), align, 700);
  g.shadowBlur = 0;
}

export function drawLayer(id: string) {
  const face = canvas();
  layer(id, face.g);
  const label = canvas();
  callout(id, label.g);
  return { face: face.c, label: label.c };
}

// the bright points of a layer, for the particles to gather onto (0..1 uv on the card)
export function brightPoints(c: HTMLCanvasElement, step = 6) {
  const d = c.getContext('2d')!.getImageData(0, 0, W, H).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 150) pts.push([x / W, 1 - y / H]);
  return pts;
}
