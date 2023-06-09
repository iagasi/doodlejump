const CANVAS = document.querySelector("#canvas");
CANVAS.width = 500;
CANVAS.height = 800;
const ctx = CANVAS.getContext("2d");
const OVER = document.querySelector(".gameOver");
const NEWGAME = document.querySelector(".new-game");
const LOADING = document.querySelector(".loading");
NEWGAME.addEventListener("click", () => {
  location.reload();
});
const gravity = 1;
const jump = 40;

const moveXValue = 5;

//const collisionsArray = []
const pressedKeys = {
  a: false,
  d: false,
  w: false,
  space: false,
  s: false,
};

function detectWithEnemyCollision(object, target) {
  if (
    object.position.y + object.height >=
      target.position.y + target.computedHeight &&
    object.position.y <= target.position.y + target.computedHeight &&
    object.position.x + object.width >= target.position.x &&
    target.position.x + target.computedWidth > object.position.x
  ) {
    return true;
  }
}
function detecttWithEnemyTopCollision(object, target) {
  if (
    object.position.y + object.height + 10 >= target.position.y &&
    object.position.y + object.height <= target.position.y &&
    object.position.x + object.width >= target.position.x &&
    object.position.x < target.position.x + target.computedWidth
  ) {
    return true;
  }
}

class Sound {
  constructor() {
    this.jumpSound = new Audio("./sounds/jump.wav");
    this.explossionSound = new Audio("./sounds/explossion.wav");
    this.monsterSoud = new Audio("./sounds/monster.wav");
  }

  jump() {
    this.jumpSound.play();
    setTimeout(() => {
      this.jumpSound.pause();
      this.jumpSound.currentTime = 0;
    }, 100);
  }
  explossion() {
    this.explossionSound.play();
  }
  monster() {
    this.monsterSoud.play();
  }
}

class PlayerFacePositionHandler {
  constructor() {
    this.sx = 270;
    this.sy = 10;

    this.sxL = 270;
    this.syL = 10;

    this.sxR = 400;
    this.syR = 10;

    this.imgSourceL = "./img/jump.png";
    this.imgSourceR = "./img/n.png";
  }
  update() {
    if (pressedKeys.a) {
      this.sx = this.sxL;
      this.sy = this.syL;
    }
    if (pressedKeys.d) {
      this.sx = this.sxR;
      this.sy = this.syR;
    }
  }
}
class Player extends Sprite {
  constructor({ position, soundEffects }) {
    super(ctx, "./img/n.png");
    this.position = position;
    this.counter = 0;

    this.velocity = 2;
    this.VELOCITY = this.velocity;
    this.fallingVelocity = this.velocity / 1.3;
    this.saveFallingvelocity = this.fallingVelocity;
    this.acceleration = 0.01;
    this.speed = 3;

    this.initialWidth = 120;
    this.initialHeight = 110;
    this.width = this.initialWidth / 1.8;
    this.height = this.initialHeight / 1.8;
    ////
    this.shootImgX = 200;
    this.jumpLeftImgX = 327;

    this.playerFacing = new PlayerFacePositionHandler();

    ////
    this.sx = this.playerFacing.sx;
    this.sy = this.playerFacing.sy;

    this.whenMovePlatgorms = 400;
    this.currPosition = null;
    this.jumpHeight = 300;

    this.alive = true;

    this.isFalling = true;
    this.colidedPosition = 0;

    this.sound = soundEffects;

    this.gun = new Gun();
    this.enemies = new EnemiesHandler(this.gun, this, soundEffects);
    this.enemies.add(new FirstBigEnemy());

    this.colisionHandler = new HandleCollisions({ player: this });
    this.collisions = this.colisionHandler.collisions;
  }

  draw() {
    this.enemies.update(1);
    super.draw(
      this.sx,
      this.sy,
      this.initialWidth,
      this.initialHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  playerImagesHandler() {
    if (pressedKeys.space) {
      this.sx = this.shootImgX;
    } else if (this.counter % 10 === 0) {
      if (this.playerFacing == "left") {
        this.sx = this.jumpLeftImgX;
      }
    }
  }
  update() {
    //Player faces
    this.playerFacing.update();
    this.sx = this.playerFacing.sx;
    this.sy = this.playerFacing.sy;
    super.imgSource = this.playerFacing.imgSource;
    //Player faces....
    this.playerImagesHandler();
    this.colisionHandler.update();
    this.move();
    this.position.y += this.velocity * this.speed;
    this.draw();
    if (this.alive) {
      this.bounce();
    }

    this.detectColision();
    this.detectEnemyCollision();
    this.gun.update(this.position);
    this.crossWall();
  }
  colDetected(player, colider) {
    return (
      player.position.y + player.height - 10 <= colider.position.y &&
      player.position.y + player.height >= colider.position.y &&
      player.position.x + player.width >= colider.position.x &&
      player.position.x <= colider.position.x + colider.width
    );
  }
  detectColision() {
    for (let i = 0; i < this.collisions.length; i++) {
      const collision = this.collisions[i];

      if (this.colDetected(this, collision) && this.isFalling) {
        console.log(1);
        this.secondCollisinCandidate = this.collisions[i - 1];
        this.colidedPosition = collision.position;
        this.colidedStatic = { ...collision.position };
        this.colisionHandler.handleColisions();
        this.collisions = this.colisionHandler.collisions;
        this.sound.jump();
        this.isFalling = false;
        //  break
      }
    }
  }
  detectEnemyCollision() {
    const arrEnemies = this.enemies.enemies;
    for (let i = 0; i < arrEnemies.length; i++) {
      const enm = arrEnemies[i];
      if (
        detecttWithEnemyTopCollision(this, enm) &&
        this.isFalling &&
        !enm.killed
      ) {
        this.isFalling = false;
        this.colidedPosition = enm.position;

        this.enemies.killEnemy(i);

        return;
      }

      if (detectWithEnemyCollision(this, enm) && !enm.killed) {
        this.gameOver();
      }
    }
  }
  crossWall() {
    if (this.position.x + this.width <= 0) {
      this.position.x = CANVAS.width;
    }
    if (this.position.x > CANVAS.width) {
      this.position.x = CANVAS.width - CANVAS.width;
    }
  }
  bounce() {
    if (
      this.colidedStatic &&
      player.position.y < this.colidedStatic.y - this.jumpHeight
    ) {
      this.isFalling = true;
    }
    if (this.isFalling) {
      this.velocity = Math.abs(this.fallingVelocity);
      this.fallingVelocity += 0.03;
    } else {
      this.fallingVelocity = this.saveFallingvelocity;
      this.velocity = -Math.abs(this.VELOCITY);
      this.velocity += this.acceleration;
    }
    if (this.position.y + 50 > CANVAS.height) {
      this.position.y = CANVAS.height;
      this.velocity = 0;
      this.alive = false;
      if (OVER) {
        OVER.style.display = "flex";
      }
    }
  }
  gameOver() {
    this.velocity = 0;
    this.alive = false;
    this.position.y = this.position.y + 50;
    console.log(OVER);
    if (OVER) {
      OVER.style.display = "flex";
    }
  }
  gameOn() {
    this.velocity = 10;
    this.alive = true;
  }
  move() {
    if (pressedKeys.a) {
      this.position.x -= moveXValue;
    }
    if (pressedKeys.d) {
      this.position.x += moveXValue;
    }
    if (true) {
      if (pressedKeys.w && this.colDetected) {
        this.position.y -= 3;
      }
      if (pressedKeys.s && this.colDetected) {
        this.position.y += 3;
      }
    }
  }
}

class Text {
  constructor({ position }) {
    this.x = position.x | 0;
    this.y = position.y | 0;
    this.score = 0;
  }

  update() {
    //
    ctx.save();
    ctx.font = "24px Arial";

    ctx.fillText(`SCORE:${this.score}`, this.x, this.y);
    ctx.restore();
  }
}
const text = new Text({ position: { x: CANVAS.width / 2, y: 20 } });
const soundEffects = new Sound();
const enm = new FirstBigEnemy();

const player = new Player({
  position: {
    x: 210,
    y: CANVAS.height - 300,
  },
  soundEffects,
});

function animate() {
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

  player.update();
  text.update();
  // jumpPlayer.update()
  pressedKeys.space = false;
  requestAnimationFrame(animate);
}

window.addEventListener("keydown", (e) => {
  switch (e.key.toLocaleLowerCase()) {
    case "w":
    //   pressedKeys.w = true;
      break;
    case "a":
      pressedKeys.a = true;
      break;
    case "d":
      pressedKeys.d = true;
      break;
    case "s":
    //   pressedKeys.s = true;
      break;
    case " ":
      pressedKeys.space = true;
  }
  //
});
window.addEventListener("keyup", (e) => {
  switch (e.key.toLocaleLowerCase()) {
    case "w":
      pressedKeys.w = false;
      break;
    case "a":
      pressedKeys.a = false;
      break;
    case "d":
      pressedKeys.d = false;
      break;
    case "s":
      pressedKeys.s = false;
      break;
    case " ":
      pressedKeys.space = false;
  }
});
window.addEventListener("load", (event) => {
    LOADING.style.display="none"
   animate()
  });

//

//const m = new FirstBigEnemy({ position: { x: 10, y: 10 }, options: {} })
