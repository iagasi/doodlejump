const CANVAS = document.querySelector("#canvas")
CANVAS.width = 500
CANVAS.height = 800
const ctx = CANVAS.getContext("2d")

const gravity = 1
const jump = 40


const moveXValue = 5


const collisionsArray = []
const pressedKeys = {
    a: false,
    d: false,
    w: false,
    space: false

}

class Collision {
    constructor({ position, dimenstion = { width: 100, height: 10 } }) {
        this.position = position
        this.width = dimenstion.width
        this.height = dimenstion.height
    }

    draw() {
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    }

    update() {
        this.draw()
    }
}
class HandleCollisions {
    constructor({ player }) {
        this.collisions = []
        this.colInstance = Collision

        this.player = player
        this.generateCollisions()
        return this.colisions
    }

    generateCollisions() {

        const cols = genrateRandomCollisions(20, 10, this.player.jumpHeight, this.colInstance)
        const cols2 = genrateRandomCollisions(20, -1, this.player.jumpHeight, this.colInstance)

        console.log([...cols, ...cols2]);
        this.collisions.push(...cols, ...cols2)

    }
    update() {
        this.collisions.forEach(colider => colider.draw())



    }

    move(value) {
        //  const cols = genrateRandomCollisions(3, this.player.jumpHeight, this.player.jumpHeight, this.colInstance)
        // this.collisions.push(...cols)

        this.collisions.forEach(colider => colider.position.y += value)
    }


}
class Player {
    constructor({ position }) {
        this.position = position

        this.velocity = 2

        this.width = 20
        this.height = 20


        this.currPosition = null
        this.jumpHeight = 100
        this.gun = new Gun()

        this.isFalling = true
        this.colidedPosition = 0

        this.colisionHandler = new HandleCollisions({ player: this })
        this.collisions = this.colisionHandler.collisions


    }


    draw() {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)


    }

    update(collision) {
        // if(player.position.y<500){
        //     player.position.y=600
        //    }

        this.detectColision()
        this.bounce()
        this.draw()
        this.gun.update(this.position)


        this.crossWall()
        this.colisionHandler.update()
        this.move()

    }
    colDetected(player, colider) {

        return (
            player.position.y + player.height <= colider.position.y + colider.height
            &&
            player.position.y + player.height >= colider.position.y
            &&
            player.position.x + player.width >= colider.position.x
            &&
            player.position.x <= colider.position.x + colider.width
        )
    }
    detectColision() {


        for (let i = 0; i < this.collisions.length; i++) {
            const collision = this.collisions[i];

            if (this.colDetected(this, collision) && this.isFalling) {

                this.isFalling = false
                this.colidedPosition = collision.position.y
                if (this.position.y < 700) {
                    this.colisionHandler.move(this.jumpHeight)
                    this.position.y += this.jumpHeight


                }

                break

            }


        }

    }
    crossWall() {
        if (this.position.x + this.width <= 0) {
            this.position.x = CANVAS.width
        }
        if (this.position.x >CANVAS.width) {
            this.position.x = CANVAS.width-CANVAS.width
        }
    }
    bounce() {


        if (this.isFalling) {
            this.position.y += this.velocity;
        }
        else {

            this.position.y -= this.velocity

            if (this.colidedPosition - this.jumpHeight > this.position.y) {
                this.isFalling = true
            }
        }

    }

    move() {
        if (pressedKeys.a) { this.position.x -= moveXValue }
        if (pressedKeys.d) { this.position.x += moveXValue }
        if (true) {
            if (pressedKeys.w && this.colDetected) { this.position.y -= jump }
        }
    }
}



class Gun {
    constructor() {
        this.position
        this.bullets = []

        this.gunDirection = "right"
    }
    update(position) {
        if (pressedKeys.space) {
            this.position = { ...position }
            this.bullets = this.bullets.filter(e => e.position.y < 800)
            this.bullets.push(new Bulet(this.position, this.gunDirection))

        }
        this.bullets.length && this.bullets.forEach(e => e.update())





    }

}

class Bulet {
    constructor(position, gunDirection) {
        this.height = 10
        this.width = 10
        this.jumpHeight = 100
        this.position = { ...position }
        this.velocity = 4

        this.xx = 0
        this.initialPosition
        this.isJumping = false

        this.gunDirection = gunDirection

        this.sin = 0
    }

    update() {

        //   console.log(Math.sin(this.xx));
        if (this.gunDirection === "left") { this.xx-- }
        if (this.gunDirection === "right") { this.xx++ }

        if (this.xx % 3 == 0) {
            this.sin = Math.sin(this.xx) * 3

        }

        ctx.fillRect(this.position.x + this.xx + this.sin, this.position.y - 20, this.width, this.height)


        if (!this.initialPosition) { this.initialPosition = this.position.y }
        if (!this.isJumping) this.position.y -= this.velocity
        else { this.position.y += this.velocity }

        if (this.position.y < this.initialPosition - this.jumpHeight) {
            this.isJumping = true

        }
    }







}



const player = new Player({
    position: {
        x: 210,
        y: CANVAS.height - 100
    }
})

const gun = new Gun()

// const cols = genrateRandomCollisions(20, player.jumpHeight, player.jumpHeight, Collision)


function animate() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height)
    player.update()

    pressedKeys.space = false

    // 

    requestAnimationFrame(animate)
}




window.addEventListener("keydown", (e) => {

    switch (e.key.toLocaleLowerCase()) {
        case "w": pressedKeys.w = true
            break
        case "a": pressedKeys.a = true
            break
        case "d": pressedKeys.d = true
            break
        case " ": pressedKeys.space = true;
    }

})
window.addEventListener("keyup", (e) => {
    switch (e.key.toLocaleLowerCase()) {
        case "w": pressedKeys.w = false
            break
        case "a": pressedKeys.a = false
            break
        case "d": pressedKeys.d = false
            break
        case " ": pressedKeys.space = false
    }

})

animate()