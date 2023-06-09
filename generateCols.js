

function genrateRandomCollisionsz(maxItems, firstYPosition = 0, somevalue, Collision) {

    const cols = []
    if (!cols.length) {
        cols.push(
            new Collision({ position: { x: Math.floor(Math.random() * 300), y: Math.floor(Math.random() * 10) }, width: 100, height: 10 })
        )

    }


    while (cols.length < maxItems) {

        const LastXPosition = cols[cols.length - 1].position.x
        const LastYPosition = cols[cols.length - 1].position.y

        const randomX = Math.floor(Math.random() * LastXPosition) * 10

        if (randomX > Math.floor(Math.random() * 20) && randomX - LastXPosition <= 150) {

            // while(true){

            const randomY = Math.floor(Math.random() * 5000) * 10
            if (randomY > LastYPosition + 20 && randomY - LastYPosition <= 90) {
                cols.push(
                    new Collision({ position: { x: randomX, y: randomY }, width: 100, height: 10 })
                )

            }


        }
    }
    if (firstYPosition < 0) {
        cols.forEach(item => item.position.y = -item.position.y)
    }
    return cols
}

function genrateRandomCollisions(maxItems, firstYPosition = 0, playerJumpHeight, Collision) {

    const cols = []
    const Width = 100
    const Height = 10
    if (!cols.length) {
        cols.push(
            new Collision({ position: { x: Math.floor(Math.random() * (CANVAS.width - Width)), y: 30 } })
        )
    }
    while (cols.length < maxItems) {

        const lastY = cols[cols.length - 1].position.y
        const lastX = cols[cols.length - 1].position.x

        let randomX = 0
        let someRandom=Math.floor(Math.random() * 10)
        if (someRandom > 5) {
            randomX = Math.floor(Math.random() * lastX)

        }
        else { randomX = Math.floor(Math.random() * (CANVAS.width - Width)) }
        const randomY = Math.floor(Math.random() * (playerJumpHeight / 3) + (lastY + 50))
        if(someRandom>7){
            cols.push(
                new MovingCollision({
                    position: {
                        x: randomX, y: randomY,
                    },
                    options: { moveRange: 1, speed: 1 }
            
                })
            )  
        }
        else{
          cols.push(
            new Collision({ position: { x: randomX, y: randomY } })
        )   
        }
       
    }


    if (firstYPosition < 0) {
        cols.forEach(item => item.position.y = -item.position.y)
    }

    return cols
}
function generateInitialColisions() {
    const cols = []
    cols.push(new MovingCollision({
        position: {
            x: 200, y: CANVAS.height - 80,
        },
        options: { moveRange: 1, speed: 1 }

    }),

        new Collision({
            position: {
                x: 180, y: CANVAS.height - 80,
            },

        }),
        new Collision({
            position: {
                x: 330, y: CANVAS.height - 80,
            },

        })



    )
    return cols
}
function genrateRandomMovingCollisions(maxItems, firstYPosition = 0, playerJumpHeight, Collision) {

    const cols = []
    const Width = 100
    const Height = 10
    if (!cols.length) {
        cols.push(
            new Collision({ position: { x: Math.floor(Math.random() * (CANVAS.width - Width)), y: Math.floor(Math.random() * Height * 3) } })
        )
    }
    while (cols.length < maxItems) {

        const lastY = cols[cols.length - 1].position.y


        let randomX = Math.floor(Math.random() * (CANVAS.width - Width))

        const randomY = Math.floor(Math.random() * (playerJumpHeight / 3) + (lastY + 40))
        cols.push(
            new Collision({ position: { x: randomX, y: randomY } })
        )
    }


    if (firstYPosition < 0) {
        cols.forEach(item => item.position.y = -item.position.y)
    }

    return cols
}

