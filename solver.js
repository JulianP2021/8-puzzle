/**
 * Generate all possible edges for a given node in the 8-puzzle.
 * @param {number} node
 * @returns {Set<number>}
 */
function generateEdgesForNode(node) {
	const edges = new Set();
	// Ensure we always work with a 9-character representation (preserve leading zeros)
	const strNode = node.toString().padStart(9, "0");
	const zeroIndex = strNode.indexOf("0");
	const row = Math.floor(zeroIndex / 3);
	const col = zeroIndex % 3;
	const directions = [
		{ dr: -1, dc: 0 }, // Up
		{ dr: 1, dc: 0 }, // Down
		{ dr: 0, dc: -1 }, // Left
		{ dr: 0, dc: 1 }, // Right
	];
	for (const { dr, dc } of directions) {
		const newRow = row + dr;
		const newCol = col + dc;
		if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
			const newIndex = newRow * 3 + newCol;
			const arrNode = strNode.split("");
			[arrNode[zeroIndex], arrNode[newIndex]] = [
				arrNode[newIndex],
				arrNode[zeroIndex],
			];
			edges.add(parseInt(arrNode.join(""), 10));
		}
	}
	return edges;
}

/**
 * Render the board DOM from the `board` array.
 * @param {number[]} arr
 * @returns {{nodes: Map<number, any>, edges: Map<number, Set<number>}}
 */
function setupGraph() {
	const nodes = new Map();
	const edges = new Map();
    let edgesCount = 0;

	const alreadyUsed = new Set();
	for (let i = 0; i <= 8; i++) {
		alreadyUsed.add(i);
		for (let j = 0; j <= 8; j++) {
			if (alreadyUsed.has(j)) continue;
			alreadyUsed.add(j);
			for (let k = 0; k <= 8; k++) {
				if (alreadyUsed.has(k)) continue;
				alreadyUsed.add(k);
				for (let l = 0; l <= 8; l++) {
					if (alreadyUsed.has(l)) continue;
					alreadyUsed.add(l);
					for (let m = 0; m <= 8; m++) {
						if (alreadyUsed.has(m)) continue;
						alreadyUsed.add(m);
						for (let n = 0; n <= 8; n++) {
							if (alreadyUsed.has(n)) continue;
							alreadyUsed.add(n);
							for (let o = 0; o <= 8; o++) {
								if (alreadyUsed.has(o)) continue;
								alreadyUsed.add(o);
								for (let p = 0; p <= 8; p++) {
									if (alreadyUsed.has(p)) continue;
									alreadyUsed.add(p);
									for (let q = 0; q <= 8; q++) {
										if (alreadyUsed.has(q)) continue;
										const nodeKey = parseInt(`${i}${j}${k}${l}${m}${n}${o}${p}${q}`, 10);
										nodes.set(nodeKey, { visited: false, parent: null });
										const neighbors = generateEdgesForNode(nodeKey);
										edges.set(nodeKey, neighbors);
										edgesCount += neighbors.size;
									}
									alreadyUsed.delete(p);
								}
								alreadyUsed.delete(o);
							}
							alreadyUsed.delete(n);
						}
						alreadyUsed.delete(m);
					}
					alreadyUsed.delete(l);
				}
				alreadyUsed.delete(k);
			}
			alreadyUsed.delete(j);
		}
		alreadyUsed.delete(i);
	}
	console.log(`Total number of nodes: ${nodes.size}`);
	
    console.log(`Total edges generated: ${edgesCount}`);

	return { nodes, edges };
}

/**
 * Reset the graph's visited and parent properties.
 * @returns {void}
 */
function resetGraph() {
    graph.nodes.forEach((node) => {
        node.visited = false;
        node.parent = null;
    });
}

const graph = setupGraph();
/**
 * Solve the puzzle using BFS.
 * @param {number} start
 * @param {number} goal
 * @returns {number[] | null}
 */
function solvePuzzle(start, goal = 123456780) {
    const queue = [];
    queue.push(start);
    console.log(graph.nodes.get(start));
    
    graph.nodes.get(start).visited = true;
    while (queue.length > 0) {
        const current = queue.shift();
        if (current === goal) {
            // Reconstruct path
            const path = [];
            let step = current;
            while (step !== null) {
                path.push(step);
                step = graph.nodes.get(step).parent;
            }
            resetGraph(); // Reset graph for future calls
            return path.reverse();
        }
        for (const neighbor of graph.edges.get(current) || []) {
            if (!graph.nodes.get(neighbor).visited) {
                graph.nodes.get(neighbor).visited = true;
                graph.nodes.get(neighbor).parent = current;
                queue.push(neighbor);
            }
        }
    }
    resetGraph(); // Reset graph for future calls
    return null; // No path found
}

