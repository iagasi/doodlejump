class Gun {
    constructor() {
        this.playerPosition
        this.bullets = []

        this.gunDirection = "right"
    }
    update(playerPosition) {
        if (pressedKeys.space) {
            this.playerPosition = { ...playerPosition }
            this.bullets = this.bullets.filter(e => e.position.y < CANVAS.height)
            //  this.bullets = this.bullets.filter(e => e.position.y < -1000)
            this.bullets.push(new Bulet(this.playerPosition, this.gunDirection))

        }
        this.bullets.length && this.bullets.forEach(bullet => {
            bullet.update()



        }

        )





    }

}

class Bulet {
    constructor(position, gunDirection) {
        this.height = 10
        this.width = 10
        this.jumpHeight = 100
        this.position = { ...position }
        this.velocity = 10

        this.xx = 0
        this.initialPosition
        this.isJumping = false

        this.gunDirection = gunDirection

        this.sin = 0
    }

    update() {


        if (this.gunDirection === "left") { this.xx-- }
        if (this.gunDirection === "right") { this.xx++ }

        if (this.xx % 3 == 0) {
            this.sin = Math.sin(this.xx) * 3

        }

        ctx.fillRect(this.position.x + this.xx + this.sin, this.position.y - 20, this.width, this.height)


        if (!this.initialPosition) { this.initialPosition = this.position.y }
        if (!this.isJumping) this.position.y -= this.velocity
        else { this.position.y += this.velocity }


    }







}