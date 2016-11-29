/**
 * Created by bobnweave on 6/14/16.
 */
var fish;
var corals;
var mines;
var currentState;
var score = 0;
var highScore = 0;

//document.getElementById("score").innerHTML = displayScore;
var states = {
    Splash: 0,
    Game: 1,
    Score: 2
};
var width;
var height;
var renderingContext;
var frames = 0;
var okButton;
var foregroundPosition = 0;


//note: the following two variables should be different numbers to offset the spawning of fish and mine instances
var fishQuantity = 100; //sets the frequency of fish instantiation.  Lower number means more fish
var mineQuantity = 110; //sets the frequency of mine instantiation.  Lower number means more fish


function CoralCollection() {
    this._corals = [];

    /**
     * Empty corals array
     */
    this.reset = function () {
        this._corals = [];
    };

    /**
     * Creates and adds a new Coral to the game.
     */
    this.add = function () {
        this._corals.push(new Coral()); // Create and push coral to array
    };

    /**
     * Update the position of existing corals and add new corals when necessary.
     */
    this.update = function () {

        //console.log(frames % 10);
        if (frames % fishQuantity === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._corals.length; i < len; i++) { // Iterate through the array of corals and update each.
            var coral = this._corals[i]; // The current coral.

            if (i <= 15) { // If this is the leftmost coral, it is the only coral that the fish can collide with . . .
                coral.detectCollision(); // . . . so, determine if the fish has collided with this leftmost coral.
            }

            coral.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
            if (coral.x < -coral.width) { // If the coral has moved off screen . . .
                if(coral.y < 500){  // if the fish was not moved by the shark, subtract 2 points from score
                    score = score - 2;
                }
                this._corals.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all corals to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._corals.length; i < len; i++) {

            var coral = this._corals[i];
            coral.draw();
        }
    };
}

/**
 * The Coral class. Creates instances of Coral.
 */
function Coral() {
    this.x = 500;
    this.y = (topCoralSprite.height  + 300 * Math.random());
    // these if statements check to see if the fish was drawn outside of the water, if so it places them within the screen
    if(this.y < 0) {
        this.y = 0;
    }
    if(this.y > 285){
        this.y = 285;
    }

    this.width = topCoralSprite.width;
    this.height = topCoralSprite.height;

    /**
     * Determines if the fish has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(fish.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(fish.y, this.y), this.y + this.height);
       // var cy2 = Math.min(Math.max(fish.y, this.y + this.height + 110), this.y + 2 * this.height + 80);
        // Closest difference
        var dx = fish.x - cx;
        var dy1 = fish.y - cy1;
       // var dy2 = fish.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
       // var d2 = dx * dx + dy2 * dy2;
        var r = fish.radius * fish.radius;
        // Determine intersection
        if (r > d1) {
            score++;
            if(score > highScore){
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }
            this.y += 500;

            //currentState = states.Score;
        }
    };


    this.draw = function () {
    //    bottomCoralSprite.draw(renderingContext, this.x, this.y);
        topCoralSprite.draw(renderingContext, this.x, this.y );
    }
}



//testing here

function Mine() {
    this.x = 500;
    this.y = (278 * Math.random());
    //these if statements makes sure the mine appears in the water. They are probably redundant as the math.random should already do that
    if(this.y < 0) {
        this.y = 0;
    }
    if(this.y > 278){
        this.y = 278;
    }
    this.width = mineSprite.width;
    this.height = mineSprite.height;

    /**
     * Determines if the fish has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(fish.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(fish.y, this.y), this.y + this.height);
        // var cy2 = Math.min(Math.max(fish.y, this.y + this.height + 110), this.y + 2 * this.height + 80);
        // Closest difference
        var dx = fish.x - cx;
        var dy1 = fish.y - cy1;
        // var dy2 = fish.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        // var d2 = dx * dx + dy2 * dy2;
        var r = fish.radius * fish.radius;
        // Determine intersection
        if (r > d1) {
            score = 0;
            currentState = states.Score;
        }
    };

    this.draw = function () {
        //    bottomCoralSprite.draw(renderingContext, this.x, this.y);
        mineSprite.draw(renderingContext, this.x, this.y );
    }
}



function MineCollection() {
    this._mines = [];

    /**
     * Empty corals array
     */
    this.reset = function () {
        this._mines = [];
    };

    /**
     * Creates and adds a new Coral to the game.
     */
    this.add = function () {
        this._mines.push(new Mine()); // Create and push coral to array
    };

    /**
     * Update the position of existing corals and add new corals when necessary.
     */
    this.update = function () {
        if (frames % mineQuantity === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._mines.length; i < len; i++) { // Iterate through the array of corals and update each.
            var mine = this._mines[i]; // The current coral.

            // these two if statments move the mines up and down but never off the screen
            if(i % 2 === 0 && this._mines[i].y > 0 && this._mines[i].y < 278){
                this._mines[i].y -= .5;
            }
            else if(i % 2 !== 0 && this._mines[i].y > 0 && this._mines[i].y < 278){
                this._mines[i].y += .5;
            }

            if (i <= 15) { // If this is the leftmost coral, it is the only coral that the fish can collide with . . .
                mine.detectCollision(); // . . . so, determine if the fish has collided with this leftmost coral.
            }

            mine.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
            if (mine.x < -mine.width) { // If the coral has moved off screen . . .
                this._mines.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all corals to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._mines.length; i < len; i++) {
            var mine = this._mines[i];
            mine.draw();
        }
    };
}



//end testing












function highScoreUpdate(){
    var high = localStorage.getItem("highScore");
    highScore = high;
}




/**
 * Fish class. Creates instances of Fish.
 * @constructor
 */
function Fish() {
    this.x = 140;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 3]; // The animation sequence

 //   this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.08;
    this._jump = 2.2;

    /**
     * Makes the Fish jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of Fish
     */
    this.update = function () {
        // Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleFish();
        } else { // Game state
            this.updatePlayingFish();
        }
    };

    /**
     * Runs the fish through its idle animation.
     */
    this.updateIdleFish = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);

    //    this.rotation = 0;
    };

    /**
     * Determines fish animation for the player-controlled fish.
     */
    this.updatePlayingFish = function () {
        //this.y = height - 270 + 130 * Math.cos(frames / 50);
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when fish touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // If our player hits the top of the canvas, we crash him
        if (this.y <= 2) {
            currentState = states.Score;
        }

        // When fish lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
      //      this.rotation = Math.min(Math.PI / 2, this.rotation + 0.1);
        } else {
     //       this.rotation = -0.0;
        }
    };

    /**
     * Draws Fish to canvas renderingContext
     * @param  {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

        // translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
  //      renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        // draws the fish with center in origo
        fishSprite[n].draw(renderingContext, -fishSprite[n].width / 2, -fishSprite[n].height / 2);

        renderingContext.restore();
    };
}

/**
 * Called on mouse or touch press. Update and change state depending on current game state.
 * @param  {MouseEvent/TouchEvent} evt - the onpress event
 */
function onpress(evt) {
   // var key = evt.keyCode; for using key input rather than mouse
   // if(key == 32){
   //
   // }
    switch (currentState) {

        case states.Splash: // Start the game and update the fish velocity.
            currentState = states.Game;
            fish.jump();
            break;

        case states.Game: // The game is in progress. Update fish velocity.
            fish.jump();
            break;

        case states.Score: // Change from score to splash state if event within okButton bounding box
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                //console.log('click');
                corals.reset();
                mines.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
    }
}

/**
 * Sets the canvas dimensions based on the window dimensions and registers the event handler.
 */
function windowSetup() {
    // Retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;

    // Set the width and height if we are on a display with a width > 500px (e.g., a desktop or tablet environment).
    var inputEvent = "touchstart";
    if (width >= 500) {
        width = 380;
        height = 430;
        inputEvent = "mousedown";
        //inputEvent = "keydown"; for using key input rather than mouse
    }

    // Create a listener on the input event.
    document.addEventListener(inputEvent, onpress);
}

/**
 * Creates the canvas.
 */
function canvasSetup() {
    canvas = document.createElement("canvas");
    canvas.style.border = "15px solid #382b1d";

    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    // Initiate graphics and ok button
    var img = new Image();
    img.src = "images/FinalSharkSprite.png";

    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;

        okButton = {
            x: (width - okButtonSprite.width) / 2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };

        gameLoop();
    };
}

/**
 * Initiates the game.
 */
function main(val) {
    document.getElementById("selection").style.display = "none";
    if(val >= 100){
        fishQuantity = +val - 20;
    }
    else{
        fishQuantity = +val;
    }
    mineQuantity = +val + 71;
    windowSetup();
    canvasSetup();

    currentState = states.Splash; // Game begins at the splash screen.

   // document.body.appendChild(canvas); // Append the canvas we've created to the body element in our HTML document.
      document.getElementById("game").appendChild(canvas);
    fish = new Fish();
    corals = new CoralCollection();
    mines = new MineCollection();

    loadGraphics();
}

/**
 * The game loop. Update and render all sprites before the window repaints.
 */
function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
    //console.log('swim');
}

/**
 * Updates all moving sprites: foreground, fish, and corals
 */
function update() {
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("highScore").innerHTML = "High Score: " + highScore;
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 2) % 14; // Move left two px each frame. Wrap every 14px.
    }

    if (currentState === states.Game) {
        corals.update();
        mines.update();
    }

    fish.update();
    //console.log(fish.y);
}

/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    corals.draw(renderingContext);
    mines.draw(renderingContext);
    fish.draw(renderingContext);

    if (currentState === states.Score) {
        okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}



