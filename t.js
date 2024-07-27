const treeContainer = document.getElementById('tree-container');
const generateBinaryButton = document.getElementById('generate-binary');
const solveButton = document.getElementById('solve');
const resetButton = document.getElementById('reset');
const statusElement = document.getElementById('status');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

let root = null;
let targetSum = 0;
let solver = null;

class TreeNode {
    constructor(value, x, y) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = x;
        this.y = y;
    }
}

function generateRandomBinaryTree(maxDepth = 5, maxNodes = 20) {
    const rootValue = Math.floor(Math.random() * 10) + 1;
    root = new TreeNode(rootValue, 400, 30);
    let nodeCount = 1;

    function generateNode(node, depth, x, y) {
        if (depth >= maxDepth || nodeCount >= maxNodes) return;

        const gap = 400 / Math.pow(2, depth);

        if (Math.random() < 0.7 && nodeCount < maxNodes) {
            const leftValue = Math.floor(Math.random() * 10) + 1;
            node.left = new TreeNode(leftValue, x - gap, y + 60);
            nodeCount++;
            generateNode(node.left, depth + 1, x - gap, y + 60);
        }

        if (Math.random() < 0.7 && nodeCount < maxNodes) {
            const rightValue = Math.floor(Math.random() * 10) + 1;
            node.right = new TreeNode(rightValue, x + gap, y + 60);
            nodeCount++;
            generateNode(node.right, depth + 1, x + gap, y + 60);
        }
    }

    generateNode(root, 1, 400, 30);
    return root;
}

function createTreeVisualization(node) {
    const treeWrapper = document.querySelector('.tree-wrapper');
    treeWrapper.innerHTML = '';
    
    function createNodeElement(node) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        nodeDiv.style.left = `${node.x}px`;
        nodeDiv.style.top = `${node.y}px`;
        nodeDiv.innerHTML = `<span class="value">${node.value}</span><span class="sum"></span>`;
        treeWrapper.appendChild(nodeDiv);

        if (node.left) {
            createLink(node, node.left);
            createNodeElement(node.left);
        }
        if (node.right) {
            createLink(node, node.right);
            createNodeElement(node.right);
        }
    }

    function createLink(parent, child) {
        const link = document.createElement('div');
        link.className = 'link';
        const dx = child.x - parent.x;
        const dy = child.y - parent.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        link.style.width = `${length}px`;
        link.style.left = `${parent.x + 30}px`;
        link.style.top = `${parent.y + 30}px`;
        link.style.transform = `rotate(${angle}rad)`;
        treeWrapper.appendChild(link);
    }

    createNodeElement(node);
}

function* backtrackingSolver(node, targetSum, currentSum = 0, path = []) {
    if (!node) return false;
    
    currentSum += node.value;
    path.push(node);
    
    yield { type: 'visit', node, currentSum };
    
    if (!node.left && !node.right) {
        if (currentSum === targetSum) {
            yield { type: 'found', path };
            return true;
        }
    } else {
        if (node.left) {
            const result = yield* backtrackingSolver(node.left, targetSum, currentSum, path);
            if (result) return true;
        }
        if (node.right) {
            const result = yield* backtrackingSolver(node.right, targetSum, currentSum, path);
            if (result) return true;
        }
    }
    
    path.pop();
    yield { type: 'backtrack', node };
    return false;
}

function* searchValueSolver(node, targetValue, path = []) {
    if (!node) return false;
    
    path.push(node);
    yield { type: 'visit', node };
    
    if (node.value === targetValue) {
        yield { type: 'found', path };
        return true;
    }
    
    if (node.left) {
        const result = yield* searchValueSolver(node.left, targetValue, path);
        if (result) return true;
    }
    if (node.right) {
        const result = yield* searchValueSolver(node.right, targetValue, path);
        if (result) return true;
    }
    
    path.pop();
    yield { type: 'backtrack', node };
    return false;
}

function generateNewBinaryTree() {
    root = generateRandomBinaryTree();
    createTreeVisualization(root);
    
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
    
    statusElement.textContent = `Target sum: ${targetSum}`;
    solver = backtrackingSolver(root, targetSum);
}

function solveStep() {
    if (!solver) return;
    
    const result = solver.next();
    if (result.done) {
        statusElement.textContent = "No solution found.";
        return;
    }
    
    const { type, node, currentSum, path } = result.value;
    const nodeElement = Array.from(document.querySelectorAll('.node'))
        .find(el => parseInt(el.style.left) === node.x && parseInt(el.style.top) === node.y);
    
    if (type === 'visit') {
        nodeElement.classList.add('visited');
        nodeElement.querySelector('.sum').textContent = currentSum || '';
        statusElement.textContent = `Visiting node with value ${node.value}${currentSum ? `. Current sum: ${currentSum}` : ''}`;
    } else if (type === 'backtrack') {
        nodeElement.classList.remove('visited');
        nodeElement.classList.add('backtracked');
        statusElement.textContent = `Backtracking from node with value ${node.value}`;
    } else if (type === 'found') {
        path.forEach(node => {
            const el = Array.from(document.querySelectorAll('.node'))
                .find(el => parseInt(el.style.left) === node.x && parseInt(el.style.top) === node.y);
            el.classList.add('goal');
        });
        statusElement.textContent = "Solution found!";
        solver = null;
    }
}

function reset() {
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        node.classList.remove('visited', 'current', 'backtracked', 'goal');
        node.querySelector('.sum').textContent = '';
    });
    solver = backtrackingSolver(root, targetSum);
    statusElement.textContent = `Target sum: ${targetSum}`;
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

generateBinaryButton.addEventListener('click', generateNewBinaryTree);
solveButton.addEventListener('click', solveStep);
resetButton.addEventListener('click', reset);
searchButton.addEventListener('click', searchValue);

// Initialize
generateNewBinaryTree();