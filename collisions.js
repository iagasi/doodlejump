class Collision extends Sprite {
    constructor({ position, dimenstion = { width: 100, height: 20 } }) {
        super(ctx, "./img/jump.png")
        this.initialWidth = 110
        this.initialHeight = 40
        this.sx = 10
        this.sy = 400

        this.position = position
        this.width = dimenstion.width
        this.height = dimenstion.height




    }

    draw() {
        super.draw(this.sx, this.sy, this.initialWidth, this.initialHeight, this.position.x, this.position.y, this.width, this.height)

    }

    update() {
        this.draw()
    }
}



class HandleCollisions {
    constructor({ player }) {
        this.collisions = []
        this.colInstance = Collision
        this.collisionsAmount = 15
        ///
        this.someStaticCollisionY = null
        this.randomCollision = null
        ///
        this.collisionsMovingSpeed = 11
        ///
        this.moveTo = null
        this.alowDetection = false

        this.moveSpeed = 10
        this.player = player
        this.generateCollisions()
        this.whenMovePlatgorms = this.player.whenMovePlatgorms

    }

    generateCollisions() {
   

       const initialCols = generateInitialColisions()

      const cols = genrateRandomCollisions(this.collisionsAmount*2, 10, this.player.jumpHeight, this.colInstance)
        // const cols = genrateRandomMovingCollisions(this.collisionsAmount*2, 20, this.player.jumpHeight, MovingCollision)
        this.collisions.push(...initialCols, ...cols,)


    }
    update() {
        this.moveByvalue()
        this.movePlatforms()

        this.collisions.forEach((colider, index) => {

            if (colider.position.y > CANVAS.height) {
                text.score++
                this.collisions = this.collisions.filter((collision, i) => colider !== collision)

            }
            if (colider.draw) { colider.draw() }

        })



    }
    movePlatforms() {

        if (player.position.y < this.whenMovePlatgorms) {

            player.position.y = this.whenMovePlatgorms + 10
            this.coliderdStatic = player.colidedPosition.y
            player.isFalling = true
            this.moveTo = (this.whenMovePlatgorms + player.jumpHeight - player.colidedPosition.y);
            /////
            //const midst = Math.floor(this.collisions.length / 2)
            const lastCollision = this.collisions.length - 1
            this.someStaticCollisionY = Object.assign({}, this.collisions[lastCollision]).position.y
            this.randomCollision = this.collisions[lastCollision]
            ///////


        }

    }
    moveByvalue() {
        if (this.someStaticCollisionY && this.someStaticCollisionY + this.moveTo > this.randomCollision.position.y) {
            // console.log(this.someStaticCollisionY + this.moveTo);
            // console.log("this.moveTo" + this.moveTo);
            // console.log("randomCOllision " + this.randomCollision.position.y);
            player.collisions.forEach(colider => { colider.position.y += this.collisionsMovingSpeed })
            player.enemies.move(this.collisionsMovingSpeed)
            this.player.isFalling = true
        }

    }
    handleColisions() {
        if (this.collisions.length < 12) {
            let cols2
            console.log(Math.floor(Math.random() * 10));
            //if (Math.floor(Math.random() * 10) >= 5) {
              //  cols2 = genrateRandomMovingCollisions(this.collisionsAmount, 10, this.player.jumpHeight, MovingCollision)
      //      }
    //        else {
            cols2 = genrateRandomCollisions(this.collisionsAmount, -1, this.player.jumpHeight, Collision)

      //       }
            this.collisions.push(...cols2,)

            this.player.enemies.add(new FirstBigEnemy())


        }


    }

}

class MovingCollision extends Collision {
    constructor({ position, }) {
        super(ctx, { position, dimenstion: { width: 100, height: 20 } })
        this.sx = 260
        this.sy = 400

        this.position = position
        this.speed = Math.ceil(Math.random() * 2)

        this.goRight = true
    }
    animatation() {
        if (this.position.x + this.width <= CANVAS.width && this.goRight) {
            this.position.x += this.speed

        }
        else if (this.position.x < 0) {
            this.goRight = true
            //  this.speed = Math.ceil(Math.random() * 2)

        }
        else {
            this.goRight = false
            this.position.x -= this.speed


        }

    }
    draw() {
        super.draw(this.sx, this.sy, this.initialWidth, this.initialHeight, this.position.x, this.position.y, this.width, this.height)

        this.animatation()

    }

}
