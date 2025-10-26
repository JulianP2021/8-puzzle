# 8-Puzzle (plain HTML/CSS/JS)

This workspace contains a minimal, plain HTML/CSS/JavaScript implementation of the 8-puzzle UI with a drag-only-empty-tile interaction and a win check.

What this supplies
- `index.html` — the game UI shell
- `styles.css` — layout, tile styles, and winning animation
- `script.js` — minimal logic: only the blank tile is draggable; dropping it on an adjacent tile swaps them. Automatically detects a solved board and shows a winning overlay.

Notes / Constraints
- There is intentionally NO shuffle or solvability check. You requested to implement any shuffling/solver yourself.
- Drag interaction uses HTML5 Drag & Drop; only the blank tile is draggable.
- The script is intentionally small and self-contained so you can extend it easily.

How to try it
1. Open `index.html` in your browser (double-click or use a simple static server).
2. Drag the empty tile (the visually blank square) onto an adjacent tile to slide it.
3. When the tiles are in order 1–8 with the blank in the last position, the winning animation and overlay appear.

Next steps you might want
- Add a shuffle button (no solvability check required per your request).
- Add move counter, timer, undo stack, or keyboard controls.
- Replace drag-and-drop with pointer/touch drag for a richer mobile experience.

If you want, I can now
- add a lightweight shuffle (without solvability check), or
- implement touch-friendly pointer dragging for mobile.
# 8-puzzle

