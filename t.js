// ... (Keep the existing TreeNode, BinaryTree, and helper functions)

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

function drawTree() {
    svg.innerHTML = '';
    if (!root) return;

    const nodeRadius = 20;
    const levelHeight = 60;
    const svgWidth = 600;
    const svgHeight = 400;

    function drawNode(node, x, y, level) {
        if (!node) return;

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
}

function generateNewBinaryTree() {
    root = generateRandomBinaryTree();
    drawTree();
    
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
    
    targetSumDisplay.textContent = targetSum;
    currentNodeDisplay.textContent = 'None';
    currentSumDisplay.textContent = '0';
    treeHeightDisplay.textContent = getTreeHeight(root);
    statusElement.textContent = `New tree generated. Target sum: ${targetSum}`;
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

function clearHighlights() {
    document.querySelectorAll('.highlighted').forEach(cell => cell.classList.remove('highlighted'));
}

function displaySolution(index) {
    board = allSolutions[index];
    displayBoard();
    document.getElementById('solutionCount').textContent = `Solution ${index + 1} of ${solutionCount}`;
}

function nextSolution() {
    currentSolutionIndex = (currentSolutionIndex + 1) % solutionCount;
    displaySolution(currentSolutionIndex);
}

function prevSolution() {
    currentSolutionIndex = (currentSolutionIndex - 1 + solutionCount) % solutionCount;
    displaySolution(currentSolutionIndex);
}

function highlightAttacked(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells[row * n + col].classList.add('attacked');
    setTimeout(() => cells[row * n + col].classList.remove('attacked'), getSpeed());
}

function reset() {
    solving = false;
    board = Array(n).fill().map(() => Array(n).fill(0));
    solutionCount = 0;
    allSolutions = [];
    displayBoard();
    updateInfo();
    updateMessage("Board reset. Ready to solve!");
    document.getElementById('solutionNav').style.display = 'none';
}

function generateRandom() {
    const randomSize = Math.floor(Math.random() * 5) + 4; // Random size between 4 and 8
    document.getElementById('boardSize').value = randomSize;
    reset();
    n = randomSize;
    let placedQueens = 0;
    
    while (placedQueens < n) {
        let row = Math.floor(Math.random() * n);
        let col = placedQueens;
        
        if (isSafeInstant(board, row, col)) {
            board[row][col] = 1;
            placedQueens++;
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

generateBinaryButton.addEventListener('click', generateNewBinaryTree);
solveButton.addEventListener('click', solveStep);
resetButton.addEventListener('click', reset);
searchButton.addEventListener('click', searchValue);

// Initialize
generateNewBinaryTree();