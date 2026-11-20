# ASCII Christmas

A rotating 3D Christmas tree drawn entirely with ASCII characters. Click the tree, a present appears, type your code, and your Christmas card opens.

Host it with GitHub Pages (or any web server). No build, no dependencies. It won't open cards from a plain `file://` double-click because browsers block the fetches.

## Cards are encrypted

The repo only holds encrypted blobs: `cards/<id>.json`. Each card's code is its password. One slow PBKDF2 (300k rounds) on the code gives both the AES-GCM key and the file name, so neither the text nor the codes can be read from the public repo. The plain text lives in `private/`, which git ignores.

## Adding a card

1. Write the message in `private/<code>.txt`. The file name is the code: lowercase letters, numbers and dashes, e.g. `private/purple-walrus-teacup.txt`. Line breaks are kept.
2. Run `node tools/encrypt.mjs` (Node 20+). It encrypts every card in `private/`, and removes encrypted cards whose `.txt` you deleted.
3. Commit and push `cards/`.

The person types the code on the present, or you can send a direct link: `https://<your-site>/cards/card.html#<code>`.

Use codes of three or more random words. Someone who downloads the repo can keep guessing codes offline, and a short code can be guessed.
Keep a backup of `private/`: it's the only readable copy, and lost codes can't be recovered.
