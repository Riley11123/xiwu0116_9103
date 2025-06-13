let lines = [];
let preLines = [];
let postLines = [];
let filledRects = [];
let horizontal = true;
let gameStarted = false;
let instructionsVisible = true;
let lineWidth = 6;
let pressStartTime = null;
let pressStartPos = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(18);
  noLoop();
  background(255);
  showInstructions(); // Show rules at the beginning
}

function showInstructions() {
  background(255);

  // Instruction box dimensions
  let boxWidth = Math.floor(width * 0.4);
  let boxHeight = height * 0.58;
  let boxX = (width - boxWidth) / 2;
  let boxY = (height - boxHeight) / 2;
  let padding = 48;
  let radius = 30;

  // Draw white rounded instruction panel
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(boxX, boxY, boxWidth, boxHeight, radius);

  // Set text style
  textAlign(LEFT, TOP);
  textSize(18);
  textLeading(28); // Set line spacing
  fill(0);
  noStroke();

  // Text position and width
  let x = boxX + padding;
  let y = boxY + padding;
  let tw = boxWidth - padding * 2;

  // Instruction text
  let msg = 
    "Welcome to the Mondrian Canvas!\n" +
    "Here you can create your own unique Mondrian-style artwork.\n\n" +
    "Rules:\n" +
    "Rule 1: Click on the edge of the canvas to add straight lines. Once there are more than 5 lines, Rule 2 will be enabled.\n" +
    "Rule 2: Double-click on a rectangle formed by the lines to fill it with red, yellow, or blue. You can double-click again to change the color.\n" +
    "Rule 3: Long-press on a filled rectangle for 2 seconds to turn it white. This makes the rectangle unchangeable and is useful for removing colors.\n\n" +
    "Click any blank area to start your creation!";

  text(msg, x, y, tw); // Draw wrapped instruction text
}

function mousePressed() {
  if (!gameStarted) {
    // First click: start interaction and hide instructions
    gameStarted = true;
    instructionsVisible = false;
    background(255);
    redraw();
    return;
  }

  // Only allow adding lines near canvas edges
  // Start long-press timer
  pressStartTime = millis(); // New https://p5js.org/reference/#/p5/millis
  pressStartPos = { x: mouseX, y: mouseY };

  let edgeMargin = 30;
  // Only allow line creation near the canvas edges
  if (
    mouseX < edgeMargin || mouseX > width - edgeMargin ||
    mouseY < edgeMargin || mouseY > height - edgeMargin
  ) {
    let newLine;
    // Decide orientation: vertical if mouseX > mouseY, else horizontal
    if (mouseX > mouseY) {
      newLine = { type: 'v', pos: mouseX };
    } else {
      newLine = { type: 'h', pos: mouseY };
    }

    // Push to preLines or postLines depending on whether rectangles exist
    if (filledRects.length === 0) {
      preLines.push(newLine);
    } else {
      postLines.push(newLine);
    }
    lines.push(newLine);
    redraw(); // Force canvas redraw after adding a line
  }
}

function mouseReleased() { // New function https://p5js.org/reference/p5/mouseReleased/
  if (!pressStartTime) return;

  let heldTime = millis() - pressStartTime;
  // If long press is over 2 seconds, turn matching rect white and lock it
  if (heldTime >= 2000) {
    for (let r of filledRects) {
      if (
        pressStartPos.x > r.x && pressStartPos.x < r.x + r.w &&
        pressStartPos.y > r.y && pressStartPos.y < r.y + r.h
      ) {
        r.color = [255, 255, 255]; // Turn to white
        r.locked = true;           // Prevent further edits
        redraw();
        break;
      }
    }
  }

  pressStartTime = null;
  pressStartPos = null;
}

function doubleClicked() {
  if (lines.length < 5) return; // Require at least 5 lines before filling

  // First: check if clicking on an existing rectangle
  for (let r of filledRects) {
    if (
      mouseX > r.x && mouseX < r.x + r.w &&
      mouseY > r.y && mouseY < r.y + r.h
    ) {
      if (!r.locked) {
        let neighbors = getNeighborColors(r.x, r.y, r.w, r.h);
        let choices = ['red', 'yellow', 'blue'].filter(c => !neighbors.includes(c));
        if (choices.length === 0) return;
        r.color = random(choices);
        redraw();
      }
      return;
    }
  }

  // Continue using line intersections to define new rectangles (only if not already filled)
  let hLines = lines.filter(l => l.type === 'h').map(l => l.pos).sort((a, b) => a - b);
  let vLines = lines.filter(l => l.type === 'v').map(l => l.pos).sort((a, b) => a - b);

  for (let i = 0; i < hLines.length - 1; i++) {
    for (let j = 0; j < vLines.length - 1; j++) {
      let x = vLines[j] + lineWidth / 2;
      let y = hLines[i] + lineWidth / 2;
      let w = vLines[j + 1] - vLines[j] - lineWidth;
      let h = hLines[i + 1] - hLines[i] - lineWidth;

      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        let exists = filledRects.some(r => // New https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
          r.x === x && r.y === y && r.w === w && r.h === h
        );
        if (exists) return;

        let neighbors = getNeighborColors(x, y, w, h);
        let choices = ['red', 'yellow', 'blue'].filter(c => !neighbors.includes(c));
        if (choices.length === 0) return;
        let picked = random(choices);
        filledRects.push({ x, y, w, h, color: picked, locked: false });
        redraw();
        return;
      }
    }
  }
}

function getNeighborColors(x, y, w, h) {
  let neighbors = [];
  for (let r of filledRects) {
    if (
      (abs(r.y + r.h - y) <= lineWidth && r.x < x + w && r.x + r.w > x) ||  // Top
      (abs(y + h - r.y) <= lineWidth && r.x < x + w && r.x + r.w > x) ||    // Bottom
      (abs(r.x + r.w - x) <= lineWidth && r.y < y + h && r.y + r.h > y) ||  // Left
      (abs(x + w - r.x) <= lineWidth && r.y < y + h && r.y + r.h > y)       // Right
    ) {
      neighbors.push(r.color);
    }
  }
  return neighbors;
}

function draw() {
  background(255);

  // Re-show rules if game not started
  if (instructionsVisible) {
    showInstructions();
    return;
  }

  // Draw lines created after first rectangle (bottom layer)
  stroke(0);
  strokeWeight(lineWidth);
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

  // Draw lines created before rectangles (top layer)
  stroke(0);
  strokeWeight(lineWidth);
  for (let l of preLines) {
    if (l.type === 'v') line(l.pos, 0, l.pos, height);
    else line(0, l.pos, width, l.pos);
  }
}
