// board
let gameStarted = false;
let board;
let boardWidth = 880;
let boardHeight = 600;
let context;
let gameOver = false;
let score = 0;

// aeroplane
let planeWidth = 120;
let planeHeight = 70;
let planeX = boardWidth / 8;
let planeY = boardHeight / 2;
let planeImg1;
let planeImg2;
let currentPlaneImg;
let planeMusic = new Audio('./m3.mp3'); // Flap sound effect
planeMusic.volume = 0.1;

let bgm = new Audio('./bgm.mp3');
bgm.loop = true;
bgm.volume = 0.1;

// plane object
let plane = {
    x: planeX,
    y: planeY,
    width: planeWidth,
    height: planeHeight
};

// buildings
let buildingArray = [];
let buildingWidth = 120;
let buildingHeight = 450;
let buildingX = boardWidth;
let buildingY = 0;

let topBuildingImg;
let bottomBuildingImg;

// physics part
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

// initialization
window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Loadin images
    planeImg1 = new Image();
    planeImg1.src = "./aeroplanee.png";

    planeImg2 = new Image();
    planeImg2.src = "./aeroplanee2.png";

    // plane immg
    planeImg1.onload = function () {
        currentPlaneImg = planeImg1;
    };

    topBuildingImg = new Image();
    topBuildingImg.src = "./buildingtop.png";

    bottomBuildingImg = new Image();
    bottomBuildingImg.src = "./buildingbottom.png";

 
    document.addEventListener("keydown", startBackgroundMusic);  // Start on key press
    document.addEventListener("click", startBackgroundMusic);   // Start on mouse click

    requestAnimationFrame(update);
    setInterval(placeBuildings, 2750);
    document.addEventListener("keydown", movePlane);
};

// Function to play background music
function startBackgroundMusic() {
    // Only start the music once
    if (bgm.paused) {
        bgm.play().catch((error) => {
            console.error('Error playing background music:', error);
        });
    }
    // Remove event listener after music starts to avoid it starting multiple times
    document.removeEventListener("keydown", startBackgroundMusic);
    document.removeEventListener("click", startBackgroundMusic);
}

function update() {
    requestAnimationFrame(update);

    if (plane.y > board.height) {
        gameOver = true;
    }
    if (gameOver) {
        // Display "Game Over" and final score
        context.fillStyle = "white";
        context.font = "60px Arial";
        context.textAlign = "center";
        context.fillText("Game Over", boardWidth / 2, boardHeight / 2);
        context.fillStyle = "white";
        context.font = "40px Arial";
        context.fillText(`Score: ${score}`, boardWidth / 2, boardHeight / 2 + 50);
        return; // Stop the game loop
    }

    context.clearRect(0, 0, boardWidth, boardHeight);

    if (gameStarted) {
        // Apply gravity and update plane position
        velocityY += gravity;
        plane.y = Math.max(plane.y + velocityY, 0); // Prevent plane from going above the board
    }

    // Draw the current plane image
    if (currentPlaneImg) {
        context.drawImage(currentPlaneImg, plane.x, plane.y, plane.width, plane.height);
    }

    // Animate buildings
    for (let i = 0; i < buildingArray.length; i++) {
        let building = buildingArray[i];
        building.x += velocityX;
        context.drawImage(building.img, building.x, building.y, building.width, building.height);

        // Update score when plane passes a building
        if (!building.passed && plane.x > building.x + building.width) {
            score += 0.5;
            building.passed = true;
        }

        // Check for collision
        if (detectCollision(plane, building)) {
            gameOver = true;
        }
    }

    // Display score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // Clear off-screen buildings
    while (buildingArray.length > 0 && buildingArray[0].x < -buildingWidth) {
        buildingArray.shift();
    }
}

function placeBuildings() {
    if (gameOver) {
        return;
    }
    let randomBuildingY = buildingY - buildingHeight / 4 - Math.random() * buildingHeight / 2;
    let topBuilding = {
        img: topBuildingImg,
        x: buildingX,
        y: randomBuildingY,
        width: buildingWidth,
        height: buildingHeight,
        passed: false,
    };
    let bottomBuilding = {
        img: bottomBuildingImg,
        x: buildingX,
        y: randomBuildingY + buildingHeight + board.height / 4,
        width: buildingWidth,
        height: buildingHeight,
        passed: false
    };

    buildingArray.push(topBuilding);
    buildingArray.push(bottomBuilding);
}

function movePlane(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        if (!gameStarted) {
            // Start the game on the first key press
            gameStarted = true;
        }
        velocityY = -6;

        // Change the image to 
        currentPlaneImg = planeImg2;

        // Play flap sound
        planeMusic.currentTime = 0; // Reset sound to start
        planeMusic.play();

        // Reset back to the idle image after 200ms
        setTimeout(() => {
            currentPlaneImg = planeImg1;
        }, 200);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
