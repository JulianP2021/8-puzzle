// Simple 8-puzzle interaction: only the blank tile (0) is draggable.
// Dragging the blank onto an adjacent tile swaps them. When board is solved,
// a winning animation/overlay is shown. No solvability checks included.

import { solvePuzzle } from "./solver.js";

/** @type {HTMLElement|null} */
const boardEl = document.getElementById("board");
/** @type {HTMLElement|null} */
const resetBtn = document.getElementById("resetBtn");
/** @type {HTMLElement|null} */
const playAgain = document.getElementById("playAgain");
/** @type {HTMLElement|null} */
const winOverlay = document.getElementById("winOverlay");
/** @type {HTMLElement|null} */
const hintBtn = document.getElementById("hintBtn");

/**
 * Current board state as a length-9 array. 0 === blank.
 * @type {number[]}
 */
let board = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 0]);

/**
 * Render the board DOM from the `board` array.
 * @returns {void}
 */
function render() {
	if (!boardEl) return;
	boardEl.innerHTML = "";
	board.forEach((val, idx) => {
		const tile = document.createElement("div");
		tile.className = "tile";
		tile.dataset.index = idx;
		tile.dataset.value = val;
		tile.setAttribute("role", "button");
		if (val === 0) {
			// blank tile is the drop target, not draggable
			tile.classList.add("blank");
			tile.setAttribute("draggable", "false");
			tile.setAttribute("aria-label", "empty tile (drop target)");
		} else {
			// numbered tiles are draggable so the user can move them into the blank
			tile.textContent = String(val);
			tile.setAttribute("draggable", "true");
			tile.setAttribute("aria-label", `tile ${val}`);
		}

		tile.addEventListener("dragstart", onDragStart);
		tile.addEventListener("dragover", onDragOver);
		tile.addEventListener("drop", onDrop);
		tile.addEventListener("dragend", onDragEnd);

		boardEl.appendChild(tile);
	});
}

/** @type {number|null} */
let dragFromIndex = null;

/**
 * Handle dragstart on a tile. Only numbered tiles (non-blank) should be draggable.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragStart(e) {
	const el = /** @type {HTMLElement} */ (e.currentTarget);
	const idx = Number(el.dataset.index);
	// Only allow dragging numbered tiles (defensive check)
	if (board[idx] === 0) {
		e.preventDefault();
		return;
	}
	dragFromIndex = idx;
	if (e.dataTransfer) {
		e.dataTransfer.setData("text/plain", String(idx));
		e.dataTransfer.effectAllowed = "move";
	}
	el.classList.add("dragging");
}

/**
 * Handle dragover — allow drop.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragOver(e) {
	e.preventDefault();
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
}

/**
 * Handle drop on a target tile. If a numbered tile is dragged onto the blank
 * and the blank is adjacent, swap them (i.e. move the tile into the empty slot).
 * @param {DragEvent} e
 * @returns {void}
 */
function onDrop(e) {
	e.preventDefault();
	const toIndex = Number(e.currentTarget.dataset.index);
	const fromIndex = Number(
		e.dataTransfer ? e.dataTransfer.getData("text/plain") : dragFromIndex
	);
	// Sanity: only allow dragging a numbered tile
	if (board[fromIndex] === 0) return;

	// Only allow dropping onto the blank tile, and only if adjacent
	if (board[toIndex] === 0 && isAdjacent(fromIndex, toIndex)) {
		swap(fromIndex, toIndex);
		render();
		if (checkWin()) triggerWin();
	} else {
		// brief visual feedback
		const target = /** @type {HTMLElement} */ (e.currentTarget);
		target.classList.add("invalid");
		setTimeout(() => target.classList.remove("invalid"), 300);
	}
}

/**
 * Handle dragend — clear dragging state.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragEnd(e) {
	const el = /** @type {HTMLElement} */ (e.currentTarget);
	el.classList.remove("dragging");
	dragFromIndex = null;
}

/**
 * Return true if two indices in the 3x3 board are adjacent (Manhattan distance 1).
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
function isAdjacent(a, b) {
	const ax = a % 3,
		ay = Math.floor(a / 3);
	const bx = b % 3,
		by = Math.floor(b / 3);
	return Math.abs(ax - bx) + Math.abs(ay - by) === 1;
}

/**
 * Swap two positions on the board array in-place.
 * @param {number} i
 * @param {number} j
 * @returns {void}
 */
function swap(i, j) {
	const tmp = board[i];
	board[i] = board[j];
	board[j] = tmp;
}

/**
 * Check whether the board is in the solved state [1..8,0].
 * @returns {boolean}
 */
function checkWin() {
	for (let i = 0; i < 8; i++) {
		if (board[i] !== i + 1) return false;
	}
	return board[8] === 0;
}

/**
 * Trigger the win UI.
 * @returns {void}
 */
function triggerWin() {
	if (boardEl) boardEl.classList.add("won");
	if (winOverlay) winOverlay.classList.add("visible");
	if (winOverlay) winOverlay.setAttribute("aria-hidden", "false");
}

/**
 * Fisher-Yates shuffle copy.
 * @param {number[]} arr
 * @returns {number[]}
 */
function shuffleArray(arr) {
	const array = arr.slice();
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/**
 * Reset the board to a random (unverified) permutation and clear win UI.
 * @returns {void}
 */
function reset() {
	board = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 0]);

	if (boardEl) boardEl.classList.remove("won");
	if (winOverlay) winOverlay.classList.remove("visible");
	if (winOverlay) winOverlay.setAttribute("aria-hidden", "true");
	render();
}

/**
 * Show a simple hint (placeholder).
 * @returns {void}
 */
function showHint() {
    const start = parseInt(board.reduce((acc, val) => acc + String(val), ""), 10);
	const path = solvePuzzle(start, 123456780);
	if (path) {
        console.log(path);
		const nextStep = path[1];
		const blankPos = board.indexOf(0);
		if (nextStep) {
			const nextblankPos = String(nextStep).split("").indexOf("0");
			if (isAdjacent(blankPos, nextblankPos)) {
				alert(`Hint: Move tile ${board[nextblankPos]} into the blank space.`);
				return;
			}
		} else {
			alert(
				"Hint: Try to move the tiles in order from 1 to 8, leaving the blank space at the end!"
			);
		}
	} else {
		alert("No solution found.");
	}
}

// wire controls (defensive checks for null elements)
if (resetBtn) resetBtn.addEventListener("click", reset);
if (hintBtn) hintBtn.addEventListener("click", showHint);
if (playAgain) playAgain.addEventListener("click", reset);

// initial render
render();
