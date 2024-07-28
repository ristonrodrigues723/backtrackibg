const treeContainer = document.getElementById('tree-container');
const generateBinaryButton = document.getElementById('generate-binary');
const solveButton = document.getElementById('solve');
const resetButton = document.getElementById('reset');
const statusElement = document.getElementById('status');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const currentNodeDisplay = document.getElementById('currentNodeDisplay');
const treeHeightDisplay = document.getElementById('treeHeight');

let root = null;
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
    const rootValue = Math.floor(Math.random() * 20) + 1;
    root = new TreeNode(rootValue, 400, 30);
    let nodeCount = 1;

    function generateNode(node, depth, x, y) {
        if (depth >= maxDepth || nodeCount >= maxNodes) return;

        const gap = 400 / Math.pow(2, depth);

        if (Math.random() < 0.7 && nodeCount < maxNodes) {
            const leftValue = Math.floor(Math.random() * 20) + 1;
            node.left = new TreeNode(leftValue, x - gap, y + 60);
            nodeCount++;
            generateNode(node.left, depth + 1, x - gap, y + 60);
        }

        if (Math.random() < 0.7 && nodeCount < maxNodes) {
            const rightValue = Math.floor(Math.random() * 20) + 1;
            node.right = new TreeNode(rightValue, x + gap, y + 60);
            nodeCount++;
            generateNode(node.right, depth + 1, x + gap, y + 60);
        }
    }

    generateNode(root, 1, 400, 30);
    return root;
}

function createTreeVisualization(node) {
    const svg = document.getElementById('tree-svg');
    svg.innerHTML = '';
    
    function createNodeElement(node) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);
        circle.setAttribute("class", "node-circle");
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.setAttribute("class", "node-text");
        text.textContent = node.value;
        
        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);

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
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", parent.x);
        line.setAttribute("y1", parent.y);
        line.setAttribute("x2", child.x);
        line.setAttribute("y2", child.y);
        line.setAttribute("stroke", "black");
        svg.appendChild(line);
    }

    createNodeElement(node);
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
    updateTreeHeight();
    statusElement.textContent = "New binary tree generated. Enter a value to search.";
}

function solveStep() {
    if (!solver) return;
    
    const result = solver.next();
    if (result.done) {
        statusElement.textContent = "Search completed. Value not found.";
        return;
    }
    
    const { type, node, path } = result.value;
    const nodeElement = document.querySelector(`circle[cx="${node.x}"][cy="${node.y}"]`);
    
    if (type === 'visit') {
        nodeElement.classList.add('visited');
        currentNodeDisplay.textContent = node.value;
        statusElement.textContent = `Visiting node with value ${node.value}`;
    } else if (type === 'backtrack') {
        nodeElement.classList.remove('visited');
        nodeElement.classList.add('backtracked');
        statusElement.textContent = `Backtracking from node with value ${node.value}`;
    } else if (type === 'found') {
        path.forEach(node => {
            const el = document.querySelector(`circle[cx="${node.x}"][cy="${node.y}"]`);
            el.classList.add('goal');
        });
        statusElement.textContent = `Value found! Path: ${path.map(n => n.value).join(' -> ')}`;
        solver = null;
    }
}

function reset() {
    const nodes = document.querySelectorAll('.node-circle');
    nodes.forEach(node => {
        node.classList.remove('visited', 'backtracked', 'goal');
    });
    currentNodeDisplay.textContent = '';
    statusElement.textContent = "Tree reset. Enter a value to search.";
    solver = null;
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

function updateTreeHeight() {
    function getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    const height = getHeight(root);
    treeHeightDisplay.textContent = height;
}

generateBinaryButton.addEventListener('click', generateNewBinaryTree);
solveButton.addEventListener('click', solveStep);
resetButton.addEventListener('click', reset);
searchButton.addEventListener('click', searchValue);

// Initialize
generateNewBinaryTree();