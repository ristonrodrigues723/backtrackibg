const svg = document.getElementById('tree-svg');
const generateBinaryButton = document.getElementById('generate-binary');
const solveButton = document.getElementById('solve');
const resetButton = document.getElementById('reset');
const statusElement = document.getElementById('status');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const targetSumDisplay = document.getElementById('targetSumDisplay');
const currentNodeDisplay = document.getElementById('currentNodeDisplay');
const currentSumDisplay = document.getElementById('currentSumDisplay');
const treeHeightDisplay = document.getElementById('treeHeight');

let root = null;
let targetSum = 0;
let solver = null;

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

function drawTree() {
    console.log("Drawing tree...");
    svg.innerHTML = '';
    if (!root) {
        console.log("No root, tree not drawn");
        return;
    }

    const nodeRadius = 20;
    const levelHeight = 60;
    const svgWidth = 600;
    const svgHeight = 400;

    function drawNode(node, x, y, level) {
        if (!node) return;

        console.log(`Drawing node: value=${node.value}, x=${x}, y=${y}, level=${level}`);

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(g);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", nodeRadius);
        circle.setAttribute("fill", getRandomColor());
        circle.classList.add("node-circle");
        g.appendChild(circle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.textContent = node.value;
        text.classList.add("node-text");
        g.appendChild(text);

        if (node.left) {
            const leftX = x - svgWidth / Math.pow(2, level + 2);
            const leftY = y + levelHeight;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y + nodeRadius);
            line.setAttribute("x2", leftX);
            line.setAttribute("y2", leftY - nodeRadius);
            line.setAttribute("stroke", "black");
            svg.appendChild(line);
            drawNode(node.left, leftX, leftY, level + 1);
        }

        if (node.right) {
            const rightX = x + svgWidth / Math.pow(2, level + 2);
            const rightY = y + levelHeight;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y + nodeRadius);
            line.setAttribute("x2", rightX);
            line.setAttribute("y2", rightY - nodeRadius);
            line.setAttribute("stroke", "black");
            svg.appendChild(line);
            drawNode(node.right, rightX, rightY, level + 1);
        }
    }

    drawNode(root, svgWidth / 2, nodeRadius + 10, 0);
    console.log("Tree drawing complete");
}

function generateRandomBinaryTree(maxDepth = 5, maxNodes = 20) {
    console.log("Generating random binary tree...");
    const rootValue = Math.floor(Math.random() * 10) + 1;
    const root = new TreeNode(rootValue);
    let nodeCount = 1;

    function generateNode(node, depth) {
        if (depth >= maxDepth || nodeCount >= maxNodes) return;

        if (Math.random() < 0.7 && nodeCount < maxNodes) {
            const leftValue = Math.floor(Math.random() * 10) + 1;
            node.left = new TreeNode(leftValue);
            nodeCount++;
            generateNode(node.left, depth + 1);
        }

        if (Math.random() < 0.7 && nodeCount < maxNodes) {
            const rightValue = Math.floor(Math.random() * 10) + 1;
            node.right = new TreeNode(rightValue);
            nodeCount++;
            generateNode(node.right, depth + 1);
        }
    }

    generateNode(root, 1);
    console.log("Random binary tree generated:", root);
    return root;
}

function generateNewBinaryTree() {
    console.log("Generating new binary tree...");
    root = generateRandomBinaryTree();
    console.log("Root generated:", root);
    drawTree();
    console.log("Tree drawn");
    
    // Set a random target sum
    const leafSums = [];
    function calculateLeafSums(node, currentSum = 0) {
        currentSum += node.value;
        if (!node.left && !node.right) {
            leafSums.push(currentSum);
        } else {
            if (node.left) calculateLeafSums(node.left, currentSum);
            if (node.right) calculateLeafSums(node.right, currentSum);
        }
    }
    calculateLeafSums(root);
    targetSum = leafSums[Math.floor(Math.random() * leafSums.length)];
    
    console.log("Target sum calculated:", targetSum);
    
    targetSumDisplay.textContent = targetSum;
    currentNodeDisplay.textContent = 'None';
    currentSumDisplay.textContent = '0';
    treeHeightDisplay.textContent = getTreeHeight(root);
    statusElement.textContent = `New tree generated. Target sum: ${targetSum}`;
    solver = backtrackingSolver(root, targetSum);
    
    console.log("Tree generation complete");
}

function solveStep() {
    if (!solver) return;
    
    const result = solver.next();
    if (result.done) {
        statusElement.textContent = "No solution found.";
        return;
    }
    
    const { type, node, currentSum, path } = result.value;
    const nodeElement = Array.from(svg.querySelectorAll('circle'))
        .find(el => parseInt(el.getAttribute('cx')) === node.x && parseInt(el.getAttribute('cy')) === node.y);
    
    if (type === 'visit') {
        nodeElement.classList.add('visited');
        currentNodeDisplay.textContent = node.value;
        currentSumDisplay.textContent = currentSum || '0';
        statusElement.textContent = `Visiting node with value ${node.value}${currentSum ? `. Current sum: ${currentSum}` : ''}`;
    } else if (type === 'backtrack') {
        nodeElement.classList.remove('visited');
        nodeElement.classList.add('backtracked');
        statusElement.textContent = `Backtracking from node with value ${node.value}`;
    } else if (type === 'found') {
        path.forEach(pathNode => {
            const el = Array.from(svg.querySelectorAll('circle'))
                .find(el => parseInt(el.getAttribute('cx')) === pathNode.x && parseInt(el.getAttribute('cy')) === pathNode.y);
            el.classList.add('goal');
        });
        statusElement.textContent = "Solution found!";
        solver = null;
    }
}

function reset() {
    const nodes = svg.querySelectorAll('circle');
    nodes.forEach(node => {
        node.classList.remove('visited', 'current', 'backtracked', 'goal');
    });
    solver = backtrackingSolver(root, targetSum);
    currentNodeDisplay.textContent = 'None';
    currentSumDisplay.textContent = '0';
    statusElement.textContent = `Reset. Target sum: ${targetSum}`;
}

function searchValue() {
    const targetValue = parseInt(searchInput.value);
    
    if (isNaN(targetValue)) {
        statusElement.textContent = "Please enter a valid number.";
        return;
    }
    
    reset();
    solver = searchValueSolver(root, targetValue);
    solveStep();
}
function getTreeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
}

function* backtrackingSolver(node, targetSum, currentSum = 0, path = []) {
    if (!node) return;
    currentSum += node.value;
    path.push(node);
    yield { type: 'visit', node, currentSum, path: [...path] };
    if (!node.left && !node.right && currentSum === targetSum) {
        yield { type: 'found', node, currentSum, path: [...path] };
    } else {
        if (node.left) yield* backtrackingSolver(node.left, targetSum, currentSum, path);
        if (node.right) yield* backtrackingSolver(node.right, targetSum, currentSum, path);
    }
    path.pop();
    yield { type: 'backtrack', node, currentSum: currentSum - node.value, path: [...path] };
}

function* searchValueSolver(node, targetValue, path = []) {
    if (!node) return;
    path.push(node);
    yield { type: 'visit', node, path: [...path] };
    if (node.value === targetValue) {
        yield { type: 'found', node, path: [...path] };
    } else {
        if (node.left) yield* searchValueSolver(node.left, targetValue, path);
        if (node.right) yield* searchValueSolver(node.right, targetValue, path);
    }
    path.pop();
    yield { type: 'backtrack', node, path: [...path] };
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    generateBinaryButton.addEventListener('click', generateNewBinaryTree);
    solveButton.addEventListener('click', solveStep);
    resetButton.addEventListener('click', reset);
    searchButton.addEventListener('click', searchValue);

    // Initialize
    generateNewBinaryTree();
});