// function genrateRandomCollisions(maxItems, firstYPosition=0, somevalue, Collision) {

//     const cols = []
//     if (!cols.length) {

//         cols.push(
//             new Collision({ position: { x: Math.floor(Math.random() * 10), y: firstYPosition}, width: 100, height: 10 })
//         )


//     }


//     while (cols.length < maxItems) {

//         const LastXPosition = cols[cols.length - 1].position.x
//         const LastYPosition = cols[cols.length - 1].position.y

//         const randomX = Math.floor(Math.random() * 5000) * 10

//         if ( randomX>Math.floor(Math.random() * 20)&&randomX - LastXPosition <=150) {

//             // while(true){
      
//             const randomY = Math.floor(Math.random() * 5000) * 10
//              if (randomY>LastYPosition+20&&randomY - LastYPosition <= 90) {
//             cols.push(
//                 new Collision({ position: { x: randomX, y: randomY }, width: 100, height: 10 })
//             )

//               }
            

//         }
//     }

//     console.log(cols);
//     return cols
// }


function genrateRandomCollisions(maxItems, firstYPosition=0, somevalue, Collision) {

    const cols = []
    if (!cols.length) {

        cols.push(
            new Collision({ position: { x: Math.floor(Math.random() * 300), y:  Math.floor(Math.random() * 10)}, width: 100, height: 10 })
        )


    }


    while (cols.length < maxItems) {

        const LastXPosition = cols[cols.length - 1].position.x
        const LastYPosition = cols[cols.length - 1].position.y

        const randomX = Math.floor(Math.random() * LastXPosition)*10

        if ( randomX>Math.floor(Math.random() * 20)&&randomX - LastXPosition <=150) {

            // while(true){
      
            const randomY = Math.floor(Math.random() * 5000) * 10
             if (randomY>LastYPosition+20&&randomY - LastYPosition <= 90) {
            cols.push(
                new Collision({ position: { x: randomX, y: randomY }, width: 100, height: 10 })
            )

              }
            

        }
    }
if(firstYPosition<0){
    cols.forEach(item=>item.position.y=-item.position.y)
}
    return cols
}