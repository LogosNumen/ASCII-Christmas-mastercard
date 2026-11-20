// Encrypts every private/<code>.txt into cards/<id>.json, and removes card files whose code is gone.
// Run from the repo root:  node tools/encrypt.mjs
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { derive, encrypt, decrypt, isValidCode } from '../cards/crypt.mjs';

const PRIV = new URL('../private/', import.meta.url), CARDS = new URL('../cards/', import.meta.url);
const keep = new Set();

for (const name of (await readdir(PRIV)).filter(n => n.endsWith('.txt'))) {
  const code = name.slice(0, -4);
  if (!isValidCode(code)) { console.error(`skipped ${name}: codes are lowercase letters, numbers and dashes`); process.exitCode = 1; continue; }
  if (code.length < 12) console.warn(`warning: "${code}" is short; longer codes (3+ words) are much harder to guess`);
  const text = await readFile(new URL(name, PRIV), 'utf8');
  const { key, id } = await derive(code);
  const box = await encrypt(key, text);
  if (await decrypt(key, box) !== text) throw new Error(`round-trip failed for ${code}`);   // self-check
  await writeFile(new URL(`${id}.json`, CARDS), JSON.stringify(box) + '\n');
  keep.add(`${id}.json`);
  console.log(`${code}  ->  cards/${id}.json`);
}

// card files are named by a 32-hex-char id; anything else in cards/ is left alone
for (const name of await readdir(CARDS))
  if (/^[0-9a-f]{32}\.json$/.test(name) && !keep.has(name)) { await unlink(new URL(name, CARDS)); console.log(`removed stale cards/${name}`); }
