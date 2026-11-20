# ASCII Christmas

A rotating 3D Christmas tree drawn entirely with ASCII characters. Click the tree, a present appears, type your code, and it opens your Christmas card.

Open `index.html` in any browser (or host it with GitHub Pages). No build, no dependencies.

## Adding a card

1. Copy `cards/merry.html` to `cards/<code>.html`. The file name **is** the code, so use lowercase letters, numbers and dashes only (e.g. `cards/nan-2026.html` → code `nan-2026`).
2. Change the text inside `<pre id="card"> ... </pre>`. Line breaks are kept; the ASCII frame, tree, snow and back link are added for you.

Try the example with the code `merry`.

Note: this is a public static site, so codes keep cards out of sight, not secret. Anyone browsing the repo can see every card.
