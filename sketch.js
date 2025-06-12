let lines = [];
let preLines = [];        // Lines created before any rectangle (top layer)
let postLines = [];       // Lines created after rectangle creation (bottom layer)
let rectangles = [];      // Unused here but can be extended for rectangle objects
let filledRects = [];     // Array to store colored rectangles
let horizontal = true;
let clickCount = 0;
let gameStarted = false;  // Track whether instructions have been dismissed
let instructionsVisible = true; // Control whether to show the instruction screen

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(18);
  noLoop();
  background(255);
  showInstructions(); // Show rules before user interaction
}

function showInstructions() {
  background(255);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  text(
    "Click the edge of the canvas to add lines. Click to add straight lines. Double-click to generate rectangles (please double-click only after more than 5 lines are created).\nFeel free to create your own Mondrian-style artwork!\nClick any blank area to start.",
    width / 2,
    height / 2
  );
}

function mousePressed() {
  // If instructions are visible, dismiss them on first click
  if (!gameStarted) {
    gameStarted = true;
    instructionsVisible = false;
    background(255);
    redraw();
    return;
  }

  // Detect edge click and determine whether to draw a horizontal or vertical line
  let edgeMargin = 30;
  if (
    mouseX < edgeMargin || mouseX > width - edgeMargin ||
    mouseY < edgeMargin || mouseY > height - edgeMargin
  ) {
    let newLine;
    if (mouseX > mouseY) {
      newLine = { type: 'v', pos: mouseX }; // vertical line
    } else {
      newLine = { type: 'h', pos: mouseY }; // horizontal line
    }

    // Add line to proper layer
    if (filledRects.length === 0) {
      preLines.push(newLine);  // top layer lines (before rectangles)
    } else {
      postLines.push(newLine); // bottom layer lines (after rectangles)
    }
    lines.push(newLine);
    redraw();
  }
}

function doubleClicked() {
  // Require at least 5 lines to allow rectangle creation
  if (lines.length < 5) return;

  // Sort all horizontal and vertical line positions
  let hLines = lines.filter(l => l.type === 'h').map(l => l.pos).sort((a, b) => a - b);
  let vLines = lines.filter(l => l.type === 'v').map(l => l.pos).sort((a, b) => a - b);

  // Loop through all grid intersections to find rectangles
  for (let i = 0; i < hLines.length - 1; i++) {
    for (let j = 0; j < vLines.length - 1; j++) {
      let x = vLines[j];
      let y = hLines[i];
      let w = vLines[j + 1] - x;
      let h = hLines[i + 1] - y;

      // Check if mouse is inside the current rectangle
      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        // Avoid adjacent rectangles having the same color
        let neighbors = getNeighborColors(x, y, w, h);
        let choices = ['red', 'yellow', 'blue'].filter(c => !neighbors.includes(c));
        if (choices.length === 0) return;

        let picked = random(choices);
        filledRects.push({ x, y, w, h, color: picked });
        redraw();
        return;
      }
    }
  }
}

function getNeighborColors(x, y, w, h) {
  // Get colors of directly adjacent rectangles
  let neighbors = [];
  for (let r of filledRects) {
    if (
      (r.x === x && abs(r.y + r.h - y) < 2) ||         // top neighbor
      (r.x === x && abs(y + h - r.y) < 2) ||           // bottom neighbor
      (r.y === y && abs(r.x + r.w - x) < 2) ||         // left neighbor
      (r.y === y && abs(x + w - r.x) < 2)              // right neighbor
    ) {
      neighbors.push(r.color);
    }
  }
  return neighbors;
}

function draw() {
  background(255);

  // If instruction screen is active, show it and skip drawing
  if (instructionsVisible) {
    showInstructions();
    return;
  }

  // Draw bottom-layer lines
  stroke(0);
  strokeWeight(6);
  for (let l of postLines) {
    if (l.type === 'v') line(l.pos, 0, l.pos, height);
    else line(0, l.pos, width, l.pos);
  }

  // Draw colored rectangles (middle layer)
  for (let r of filledRects) {
    noStroke();
    fill(r.color);
    rect(r.x, r.y, r.w, r.h);
  }

  // Draw top-layer lines
  stroke(0);
  strokeWeight(6);
  for (let l of preLines) {
    if (l.type === 'v') line(l.pos, 0, l.pos, height);
    else line(0, l.pos, width, l.pos);
  }
}
