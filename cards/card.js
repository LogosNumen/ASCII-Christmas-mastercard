// Shared by every card: wraps the text in <pre id="card"> in an ASCII frame
// under a little ASCII tree, adds a back link, and lets ASCII snow fall behind it.
const pre = document.getElementById('card');
const lines = pre.textContent.replace(/^\s*\n|\s+$/g, '').split('\n');
const inner = Math.max(24, ...lines.map(l => l.length)) + 4;   // width inside the frame
const span = (t, c) => Object.assign(document.createElement('span'), { className: c, textContent: t });
const pad = (s, w) => ' '.repeat(Math.floor((w - s.length) / 2)) + s;
const total = inner + 2;

// little tree on top: [text, class] pieces per row
const tree = [
  [['*', 'f']],
  [['/', 'g'], ['o', 'r'], ['\\', 'g']],
  [['/', 'g'], ['*.', 'f'], ['o', 'r'], ['\\', 'g']],
  [['/', 'g'], ['o', 'r'], ['.*.', 'f'], ['o', 'r'], ['\\', 'g']],
  [['|_|', 'f']],
];
const out = [];
for (const row of tree) {
  const len = row.reduce((n, [t]) => n + t.length, 0);
  out.push(' '.repeat(Math.floor((total - len) / 2)), ...row.map(([t, c]) => span(t, c)), '\n');
}
const edge = '.~*~'.repeat(Math.ceil(total / 4)).slice(0, total);
out.push(span(edge + '\n', 'f'), span('*' + ' '.repeat(inner) + '*\n', 'f'));
for (const l of lines) out.push(span('|  ', 'f'), l.padEnd(inner - 4), span('  |\n', 'f'));
out.push(span('*' + ' '.repeat(inner) + '*\n', 'f'), span(edge.replace(/\./g, "'"), 'f'));
pre.replaceChildren(...out);
pre.style.fontSize = `min(16px, ${(92 / (total * 0.6)).toFixed(2)}vw)`;  // fit phones without sideways scroll
pre.setAttribute('aria-label', lines.join(' '));

const back = Object.assign(document.createElement('a'), { href: '../index.html', textContent: '[ < back to the tree ]' });
document.body.append(back);

// ASCII snow
const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
cv.setAttribute('aria-hidden', 'true');
document.body.prepend(cv);
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W, H;
const flakes = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), v: 0.02 + Math.random() * 0.05, ch: '.*+·'[Math.floor(Math.random() * 4)], a: 0.25 + Math.random() * 0.6 }));
function size() { const d = devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.font = '14px ui-monospace, Menlo, Consolas, monospace'; }
addEventListener('resize', size); size();
let last = 0;
function snow(ms) {
  const dt = Math.min(0.05, (ms - last) / 1000); last = ms;
  ctx.clearRect(0, 0, W, H);
  for (const f of flakes) {
    if (!still) { f.y += f.v * dt; f.x += Math.sin(ms / 1500 + f.v * 99) * 0.004 * dt; if (f.y > 1) { f.y = 0; f.x = Math.random(); } }
    ctx.fillStyle = `rgba(230,235,255,${f.a})`;
    ctx.fillText(f.ch, f.x * W, f.y * H);
  }
  if (!still) requestAnimationFrame(snow);
}
requestAnimationFrame(snow);
