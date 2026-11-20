// Card encryption, shared by the site (browser) and tools/encrypt.mjs (Node): both use Web Crypto.
// One slow PBKDF2 per code yields both the AES key and the card's file id, so the public
// file names give no shortcut for guessing codes.
const enc = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...bytes));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

export const normalize = code => code.trim().toLowerCase();
export const isValidCode = code => /^[a-z0-9-]{1,60}$/.test(code);

export async function derive(code) {
  const base = await crypto.subtle.importKey('raw', enc.encode(normalize(code)), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode('ascii-christmas-cards-v1'), iterations: 300000 }, base, 384));
  const key = await crypto.subtle.importKey('raw', bits.slice(0, 32), 'AES-GCM', false, ['encrypt', 'decrypt']);
  const id = [...bits.slice(32)].map(b => b.toString(16).padStart(2, '0')).join('');
  return { key, id };
}

export async function encrypt(key, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text)));
  return { v: 1, iv: b64(iv), data: b64(data) };
}

export async function decrypt(key, box) {
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(box.iv) }, key, unb64(box.data));
  return new TextDecoder().decode(plain);
}

// Browser: fetch and open the card for a code. Returns null if no card has that code.
export async function openCard(code) {
  const { key, id } = await derive(code);
  const res = await fetch(new URL(`${id}.json`, import.meta.url));
  if (!res.ok) return null;
  return decrypt(key, await res.json());
}
