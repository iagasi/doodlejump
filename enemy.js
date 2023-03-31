
class Sprite {
    constructor(ctx, imgSrc) {
        this.ctx = ctx
        this.imgSource = imgSrc
        this.img = new Image()
        this.img.src = this.imgSource

    }

    draw(sx = 0, sy = 0, sWidth = 50, sHeight = 50, dx = 0, dy = 0, dWidth = 0, dHeight = 0) {


        this.ctx.drawImage(this.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        //   this.ctx.strokeRect(dx, dy, dWidth, dHeight)


    }
}

class FirstBigEnemy {
    constructor() {

        this.sprite = new Sprite(ctx, "./img/jump.png")
        this.counter = 0

        this.height = 115
        this.width = 100
        this.computedWidth = this.width / 2
        this.computedHeight = this.height / 2
        this.sx = 50
        this.sy = 260
        this.killed = false

        this.position = {
            x: 0,
            y: -100
        }


        this.sound = new Sound()


    }
    makeSound() {
        if (this.position.x + this.width >= (CANVAS.width / 2) && !this.killed) {
            this.sound.monster()

        }
    }
    update() {


        this.sprite.draw(this.sx, this.sy, this.width, this.height, this.position.x, this.position.y, this.computedWidth, this.computedHeight)
        this.animatation()
        this.makeSound()

    }
    animatation() {
        this.counter += 0.02
        this.position.x += Math.sin(this.counter) * 4
        this.position.y += Math.sin(this.counter * 4)


    }
}

class FlyingAnimalEnemy extends Sprite {
    constructor() {
        super(ctx, "./img/jump.png")
        this.counter = 0
        this.ctx = ctx
        this.height = 60
        this.width = 120
        this.computedWidth = this.width
        this.computedHeight = this.height
        this.sx = 200
        this.sy = 150

        this.position = {
            x: 200,
            y: -220
        }

    }

    update() {
        this.animatation()
        super.draw(this.sx, this.sy, this.width, this.height, this.position.x, this.position.y, this.computedWidth, this.computedHeight)


    }
    animatation() {
        this.counter += 0.1
        this.position.x += Math.sin(this.counter)
        this.ctx.save()
        this.ctx.translate(50, 100);
        this.ctx.restore()


    }
}




class EnemiesHandler {
    constructor(gun, player, soundEssects) {

        this.enemies = []
        this.gun = gun
        this.player = player
        this.sound = soundEssects
    }
    add() {

        const enemies = [FirstBigEnemy, FlyingAnimalEnemy]
        //  enemies.forEach(enemy=>enemy.sound=new Sound())
        const random = Math.floor(Math.random() * enemies.length)
        // const random = 0
        this.enemies.push(new enemies[random]())

    }
    update() {
        this.enemies && this.enemies.forEach((enemy, index) => {
            enemy.update()
            if (enemy.position.y > CANVAS.height) {
                enemy.stopSound && enemy.stopSound()
                this.enemies.splice(index, 1)
            }
            /////KILL ENEMY
            this.gun.bullets.forEach(bullet => {
                if (detectWithEnemyCollision(bullet, enemy)) {
                    console.log("kill");
                    this.killEnemy(index)
                }
            })


        })
    }

    move(value) {
        this.enemies.forEach(e => e.position.y += value)


    }

    killEnemy(index) {

        this.sound.explossion()
        //this.enemies[index].stopSound && 
        this.enemies[index].stopSound && this.enemies[index].stopSound()
        //  this.enemies.splice(index, 1)
        this.enemies[index].killed = true
        this.enemies[index].computedWidth = 0
        this.enemies[index].computedHeight = 0

    }
}

class Jump extends Sprite {
    constructor(player) {
        super(ctx, "./img/jump.png")
        this.ctx = ctx
        this.height = 60
        this.width = 120
        this.computedWidth = this.width
        this.computedHeight = this.height
        this.sx = 200
        this.sy = 150
        this.position = {
            x: 200,
            y: 500
        }
        this.player = player
    }

    jump() {

        if (detecttWithEnemyTopCollision(this.player, this)) {
            console.log("oo")
            const jHeight = this.player.jumpHeight
            this.player.jumpHeight = 500
            // this.player.isFalling = false
            setTimeout(() => {
                this.player.jumpHeight = jHeight
                this.player.isFalling = true

            }, 3000)
        }
    }
    update() {
        this.jump()
        super.draw(this.sx, this.sy, this.width, this.height, this.position.x, this.position.y, this.computedWidth, this.computedHeight)

    }
}

