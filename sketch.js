let lines = [];           
let preLines = [];        
let postLines = [];       
let rectangles = [];      
let filledRects = [];     
let horizontal = true;    
let clickCount = 0;       
let gameStarted = false;  
let instructionsVisible = true; 
let lineWidth = 6;        

function setup() {
  createCanvas(windowWidth, windowHeight); 
  textAlign(CENTER, CENTER);               
  textSize(18);                            
  noLoop();                                
  background(255);                         
  showInstructions();                      
}

function showInstructions() {
  background(255);
  fill(0);
  noStroke();
  // Display multi-line instructional text at center
  text(
    "Click the edge of the canvas to add lines. Click to add straight lines. Double-click to generate rectangles (please double-click only after more than 5 lines are created).\n" +
    "Feel free to create your own Mondrian-style artwork!\nClick any blank area to start.",
    width / 2,
    height / 2
  );
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
  let edgeMargin = 30;
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

function doubleClicked() {
  if (lines.length < 5) return; // Require at least 5 lines before filling

  // Sort horizontal and vertical line positions
  let hLines = lines.filter(l => l.type === 'h').map(l => l.pos).sort((a, b) => a - b);
  let vLines = lines.filter(l => l.type === 'v').map(l => l.pos).sort((a, b) => a - b);

  // Iterate through all grid rectangles formed by adjacent lines
  for (let i = 0; i < hLines.length - 1; i++) {
    for (let j = 0; j < vLines.length - 1; j++) {
      // Compute rectangle dimensions, offsetting for line thickness
      let x = vLines[j] + lineWidth / 2;
      let y = hLines[i] + lineWidth / 2;
      let w = vLines[j + 1] - vLines[j] - lineWidth;
      let h = hLines[i + 1] - hLines[i] - lineWidth;

      // Check if the mouse click is inside this rectangle
      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        // Get neighbor colors to avoid duplicates
        let neighbors = getNeighborColors(x, y, w, h);
        let choices = ['red', 'yellow', 'blue'].filter(c => !neighbors.includes(c));
        if (choices.length === 0) return;

        // Randomly choose a new color from allowed options
        let picked = random(choices);
        filledRects.push({ x, y, w, h, color: picked });
        redraw();
        return;
      }
    }
  }
}

function getNeighborColors(x, y, w, h) {
  let neighbors = [];
  for (let r of filledRects) {
    // Check top, bottom, left, right adjacency
    if (
      (abs(r.y + r.h - y) <= lineWidth && r.x < x + w && r.x + r.w > x) ||
      (abs(y + h - r.y) <= lineWidth && r.x < x + w && r.x + r.w > x) ||
      (abs(r.x + r.w - x) <= lineWidth && r.y < y + h && r.y + r.h > y) ||
      (abs(x + w - r.x) <= lineWidth && r.y < y + h && r.y + r.h > y)
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

  // Draw post-rectangle lines (appear above rectangles)
  stroke(0);
  strokeWeight(lineWidth);
  for (let l of postLines) {
    if (l.type === 'v') line(l.pos, 0, l.pos, height);
    else line(0, l.pos, width, l.pos);
  }

  // Draw all filled rectangles
  for (let r of filledRects) {
    noStroke();
    fill(r.color);
    rect(r.x, r.y, r.w, r.h);
  }

  // Draw pre-rectangle lines (appear below rectangles)
  stroke(0);
  strokeWeight(lineWidth);
  for (let l of preLines) {
    if (l.type === 'v') line(l.pos, 0, l.pos, height);
    else line(0, l.pos, width, l.pos);
  }
}
