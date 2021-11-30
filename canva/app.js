const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreElement = document.querySelector("#scoreElement")
const bigScore = document.querySelector("#bigScore")
const modalContainer  = document.querySelector("#modalContainer ")


canvas.width = innerWidth
canvas.height = innerHeight

// creating a player
class Player {
    constructor (x, y, radius, color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor (x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// creating an enemy
class Enemy {
    constructor (x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
const x = canvas.width / 2
const y = canvas.height / 2 

let player = new Player(x, y, 10, "white")
let projectiles = []
let enemies = []

// to restart the game with the click function
function initialise(){
    player = new Player(x, y, 10, "white")
    projectiles = []
    enemies = []
    score = 0
    scoreElement.innerHTML = score
    bigScore.innerHTML = score
}
function spawnEnemies(){
    setInterval(()=>{ 
        const radius = Math.random() * (30 - 7) + 7
        let x 
        let y
        if( Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }else{
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(
            canvas.height / 2 - y ,
            canvas.width / 2 - x
        )
    
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
        console.log(enemies);
    }, 1000)
}

let animationId
let score = 0

function animate(){
    animationId = requestAnimationFrame(animate)
    c.fillStyle = "rgba(0, 0, 0, 0.1)"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((projectile, index) =>{
    projectile.update()

    // remove from screen
    if (
        projectile.x + projectile.radius <0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0||
        projectile.y - projectile.radius > canvas.height
        ){
        setTimeout(()=>{
            // enemies.splice(index, 1)
            projectiles.splice(index, 1)
        },0)
    }
    })
    enemies.forEach((enemy, index) =>{
        enemy.update()
        const distance = Math.hypot(player.x - enemy.x,
            player.y - enemy.y)
            if(distance - enemy.radius - player.radius < 1){
                cancelAnimationFrame(animationId)
                modalContainer.style.display = "flex"
                bigScore.innerHTML = score
            }
        projectiles.forEach((projectile , ProjectileIndex) =>{
            const distance = Math.hypot(projectile.x - enemy.x,
                projectile.y - enemy.y)
                // when projectiles touch 
                if(distance - enemy.radius - projectile.radius < 1){   
                    if(enemy.radius - 10 > 5){
                        //increaseing the score 
                        score += 100
                        scoreElement.innerHTML = score
                        enemy.radius -= 10
                        setTimeout(()=>{
                            projectiles.splice(ProjectileIndex, 1)
                        },0)
                    }else{

                        score += 250
                        scoreElement.innerHTML = score
                        setTimeout(()=>{
                            enemies.splice(index, 1)
                            projectiles.splice(ProjectileIndex, 1)
                        },0)
                    }
                }
        })
    })
    
}

addEventListener("click", (e)=>{
    // getting the angle for the click to generate new projectiles
    const angle = Math.atan2(
        e.clientY - y,
        e.clientX - x
    )

    const velocity = {
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7
    }
    projectiles.push(new Projectile(
        x, y, 5, "white", velocity
    ))
})

startGameBtn.addEventListener("click", ()=>{
    initialise()
    animate()
    spawnEnemies()
    // removing the modal class container
    modalContainer.style.display = "none"
})