1)N-Queens Visualizer
<img width="942" alt="image" src="https://github.com/user-attachments/assets/d9150aa9-81fc-4389-a589-fbc95613fe35">


Description:

This visualizer provides an interactive demonstration of the N-Queens problem, a classic puzzle in computer science. The goal is to place N queens on an N×N chessboard in a way that no two queens attack each other. This visualizer allows you to explore different board sizes, observe the solving process step-by-step, and visualize multiple solutions if they exist.

How to Use:

Open the HTML file: Ensure you have an HTML editor and a web browser installed. Open the index.html file in your preferred HTML editor.
Run the code: To view the visualizer, open the index.html file in a web browser.
Interact with the controls:
Board Size: Adjust the board size by entering a number in the input field (minimum 4).
Speed: Select the desired speed for the animation (Slow, Normal, Fast).
Solve with Animation: Click this button to watch the solver find a solution step by step.
Solve Instantly: Click this button to find all solutions without animation.
Reset: Click this button to clear the board and start over.
Random Problem: Click this button to generate a random N-Queens problem.
Visual Feedback:

The chessboard will display the current placement of queens.
Attacked squares will be highlighted during the solving process.
The solver will display the number of solutions found and provide buttons to navigate through them.
Additional Notes:

For very large board sizes, the solving process might take longer, especially with animation enabled.
The visualizer is designed to provide a clear understanding of the N-Queens problem and its solving techniques.

2)Graph Coloring Visualization
<img width="955" alt="image" src="https://github.com/user-attachments/assets/7fa26156-4ac2-4a16-9db5-3c2bcb3421f6">


This project provides a dynamic and interactive web-based visualization for graph coloring, a fundamental algorithm in graph theory. It utilizes the D3.js library to create a visually appealing representation of the graph and its coloring solution.

Features

Graph Creation and Editing:
Create nodes and adjust their positions by dragging.
Add and remove edges to define connections between nodes.
Graph Coloring:
Implement the backtracking algorithm (included in the provided code) to color the graph.
Visualize the coloring solution with distinct colors for adjacent nodes.
Random Graph Generation:
Generate a random graph with a configurable number of nodes and edges.
Interactive Controls:
Buttons for adding, removing, coloring, and resetting the graph.
Option to change the node shape (circle, square, diamond, or triangle).
Adjacency matrix display for inspecting pairwise connections.
Responsive Design:
Adapts to different screen sizes and devices.
User-Friendly Interface:
Clear navigation with links to related visualization examples.
Status updates indicating coloring success or failure.
Usage

Clone or download the project files.
Open the index.html file in a web browser.
Interact with the provided controls to create and modify the graph.
Click the "Color Graph" button to apply the coloring algorithm.
Dependencies

D3.js library (included in the project)

3)Advanced Hamiltonian Cycle Visualization
<img width="960" alt="image" src="https://github.com/user-attachments/assets/1c432fd5-6541-48d4-89ed-599ce519f423">

This interactive web application provides a compelling visualization tool for exploring Hamiltonian cycles in graphs. It leverages the power of JavaScript libraries like D3.js to create a visually appealing representation of the graph and its Hamiltonian cycle solution.

Key Features:

Dynamic Graph Creation:
Effortlessly add nodes by clicking and dragging on the canvas.
Establish connections between nodes by drawing edges.
Hamiltonian Cycle Visualization:
Implement and visualize Hamiltonian cycles using the backtracking algorithm (code provided).
Distinct colors are assigned to adjacent nodes to enhance clarity.
Random Graph Generation:
Generate graphs with a configurable number of nodes and edges for an intuitive exploration experience.
User-Friendly Controls:
Utilize buttons to generate new cycles, animate the cycle visualization, and toggle the visibility of all edges.
Select from different graph layout options (random, circular, grid) to suit your needs.
Input a custom path to visualize a specific Hamiltonian cycle.
Control animation speed with a convenient slider.
Comprehensive Status Updates:
Real-time statistics display details like the number of nodes and edges, and the calculated cycle length.
The path order is visually represented for easy reference.
Usage

Clone or download the project repository.
Open the index.html file in a web browser.
Interact with the provided controls to create and modify the graph.
Click the "Generate New Cycle" button to generate a random Hamiltonian cycle.
Click the "Animate Cycle" button to initiate the cycle visualization animation.

4)Knight's Tour Visualization
<img width="932" alt="image" src="https://github.com/user-attachments/assets/62228f71-0337-4e60-a9e4-e67b27b86d66">
<img width="944" alt="image" src="https://github.com/user-attachments/assets/4225ea76-09ba-457d-a016-e771b7ba216b">


This is a web application that allows you to visualize the Knight's Tour problem on a chessboard. The Knight's Tour problem asks for a sequence of moves for a knight on a chessboard such that the knight visits every square exactly once.

Features:

Choose the size of the chessboard (5x5, 6x6, or 8x8)
Start a tour by clicking on a square
Visualize the knight's movement
See the move history
Toggle autoplay to automatically continue the tour
Solve the tour automatically to find a complete solution (if one exists)
Save and load tours
Toggle dark mode
How to Use

Open the index.html file in your web browser.
Choose the desired board size using the buttons under "Board Controls."
Click on a square on the chessboard to start the tour.
Use the following buttons to control the tour:
Next Move: Makes the next move in the tour.
Auto Play: Starts or stops automatic play of the tour.
Solve: Attempts to automatically solve the tour (find a complete path).
Reset: Resets the board and clears the tour.
Use the "Save Tour" and "Load Tour" buttons to save and load tours from local storage.
Toggle dark mode by clicking the "Toggle Dark Mode" button.
Explanation

The "Explanation" section provides a brief explanation of the Knight's Tour problem.
