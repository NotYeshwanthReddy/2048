//So, intially in part-1 we have done with only one direction (down) 
let grid;
let grid_new;
let score = 0;
let dragging = false;
let mouse_position = (0, 0);


function isGameWon() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] == 2048) {
                return true;
            }
        }
    }
    return false;
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] == 0) {   // This should tell me if i get through every single spot and its not equal to what is through right of it and below to it or not a zero! then the game is over...
                return false;
            }
            if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
            if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}


function blankGrid() {
    return [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
    ];
}
function setup() {
    createCanvas(400, 400);
    noLoop();
    grid = blankGrid();
    grid_new = blankGrid();
    //console.table(grid);  //really nice way to display an array in the browser(like js console!)
    addNumber();
    addNumber();
    updateCanvas();
    //console.table(grid);
}

// It should pick a random location that has a zero and it should add a 2 or 4 there. 
function addNumber() {
    let options = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] == 0) {
                options.push({
                    x: i,
                    y: j
                });
            }
        }
    }

    if (options.length > 0) {
        let spot = random(options);
        let r = random(1); // take a random number between 0 and 1
        grid[spot.x][spot.y] = r > 0.1 ? 2 : 4;
        grid_new[spot.x][spot.y] = 1;
    }
}

function compare(a, b) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (a[i][j] !== b[i][j]) {
                return true;  // true means something changed
            }
        }
    }
    return false;
}

function copyGrid(grid) {  //Copy the grid to extra!
    let extra = blankGrid();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            extra[i][j] = grid[i][j];
        }
    }
    return extra;
}

function flipGrid(grid) {
    for (let i = 0; i < 4; i++) {
        grid[i].reverse();
    }
    return grid;
}

function transposeGrid(grid, direction) {
    let newGrid = blankGrid();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (direction == 1) {
                newGrid[i][j] = grid[j][i];
            } else {
                newGrid[j][i] = grid[i][j];
            }
        }
    }
    return newGrid;
}


//This is like One Move!!!!!!!!!!!
function keyPressed() {  // i.e evrytime i press a key!
    console.log(keyCode);
    let flipped = false;
    let rotated = false;
    let played = true;
    switch (keyCode) {
        case DOWN_ARROW:
            console.log("Down arrow!");
            //do nothing   
            break;
        case UP_ARROW:
            grid = flipGrid(grid);
            flipped = true;
            break;
        case RIGHT_ARROW:
            grid = transposeGrid(grid, 1);
            rotated = true;
            break;
        case LEFT_ARROW:
            grid = transposeGrid(grid, 1);
            grid = flipGrid(grid);
            rotated = true;
            flipped = true;
            break;
        default:
            played = false;
    }

    if (played) {
        let past = copyGrid(grid);  // I should'nt be adding numbers if nothing moves so take a copyGrifd and comare with the original one and if there is any change return true else false.if false then no change!
        for (let i = 0; i < 4; i++) {
            grid[i] = operate(grid[i]);
        }

        let changed = compare(past, grid);

        if (flipped) {
            grid = flipGrid(grid);
        }

        if (rotated) {
            grid = transposeGrid(grid, -1);
        }


        if (changed) {
            addNumber();
        }
        updateCanvas();
        let gameover = isGameOver();
        if (gameover) {
            console.log("GAME OVER!");
        }

        let gamewon = isGameWon();
        if (gamewon) {
            console.log("GAME WON!");
        }
    } // if played you can do these all opearations
}

function mousePressed() {
    dragging = true;
    mouse_position = [mouseX, mouseY];
    // console.log("Mouse Down");
    console.log(mouse_position);
}

function mouseReleased() {
    let played = true;
    let flipped = false;
    let rotated = false;
    // console.log("Mouse Up", played, dragging);
    if (dragging) {
        dragging = false;
        new_mouse_position = [mouseX, mouseY]
        if (Math.abs(mouse_position[0] - new_mouse_position[0]) >= Math.abs(mouse_position[1] - new_mouse_position[1])) {
            // Move left of right
            if (mouse_position[0] - new_mouse_position[0] > 0) { // Left
                grid = transposeGrid(grid, 1);
                grid = flipGrid(grid);
                rotated = true;
                flipped = true;
                console.log("Move Left")
            } else { // Right
                grid = transposeGrid(grid, 1);
                rotated = true;
                console.log("Move Right")
            }
        }
        else {
            console.log(Math.abs(mouse_position[0] - new_mouse_position[0]))
            // Move Up or Down
            if (mouse_position[1] - new_mouse_position[1] > 0) {
                grid = flipGrid(grid);
                flipped = true;
                console.log("Move Up")
            } else {
                console.log("Move Down");
            }
        }
    }
    if (played) {
        let past = copyGrid(grid);  // I should'nt be adding numbers if nothing moves so take a copyGrifd and comare with the original one and if there is any change return true else false.if false then no change!
        for (let i = 0; i < 4; i++) {
            grid[i] = operate(grid[i]);
        }
        let changed = compare(past, grid);
        if (flipped) {
            grid = flipGrid(grid);
        }
        if (rotated) {
            grid = transposeGrid(grid, -1);
        }
        if (changed) {
            addNumber();
        }
        updateCanvas();
        let gameover = isGameOver();
        if (gameover) {
            console.log("GAME OVER!");
        }
        let gamewon = isGameWon();
        if (gamewon) {
            console.log("GAME WON!");
        }
    } // if played you can do these all opearations
}

function operate(row) {
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row;
}

function updateCanvas() {
    background(250);
    drawGrid();
    select('#score').html(score);
}

// Think you have the [2,0,2,0] So i would pack everything to the right so that any empty spots would be left on left side!(i.e [0,0,2,2])
function slide(row) {
    let arr = row.filter(val => val); // This is actually will keep everything that is not actually zero! like [2,2]
    let missing = 4 - arr.length; // Here, missing = 4-2 =2
    let zeros = Array(missing).fill(0); // Here, [0,0]
    arr = zeros.concat(arr); //[0,0,2,2]
    return arr;
}

//operaring on a single array i.e if [0,0,2,2] u r making [0,0,0,4]
function combine(row) {
    for (let i = 3; i >= 1; i--) {
        let a = row[i];
        let b = row[i - 1];
        if (a == b) {
            row[i] = a + b;
            score += row[i];
            row[i - 1] = 0;
        }
    }
    return row;
}

function drawGrid() {
    let w = 100;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            noFill();
            strokeWeight(2);
            let val = grid[i][j];
            let s = val.toString();
            if (grid_new[i][j] === 1) {
                stroke(200, 0, 200);
                strokeWeight(8);
                grid_new[i][j] = 0;
            } else {
                strokeWeight(4);
                stroke(0);
            }

            if (val !== 0) {
                stroke(0);
                fill(colorsSizes[s].color);
            } else {
                noFill();
            }
            rect(i * w, j * w, w, w);
            if (grid[i][j] !== 0) {
                textAlign(CENTER, CENTER);
                noStroke();
                fill(0);
                textSize(colorsSizes[s].size);
                text(val, i * w + w / 2, j * w + w / 2);
            }
        }
    }
}