import { updateBird, setUpBird, getBirtRecPosistion } from "./bird.js"
import { mountPipes, passedPipe, pipesRect, updatePipes } from "./pipes.js";
document.addEventListener("keypress", handleStart, { once: true});
const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")

let lastTime
function updateLoop(time){
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(updateLoop)
        return
    }
    const delta = time - lastTime
    updateBird(delta)
    updatePipes(delta)
    if ( checkLoose()) return handleLoose()
    lastTime = time
    window.requestAnimationFrame(updateLoop)
}

function checkLoose(){
    const birdPosition = getBirtRecPosistion()
    const inPipes = pipesRect().some(rectangle => collide(birdPosition, rectangle))
    const outsideWindow = birdPosition.top < 0 || birdPosition.bottom > window.innerHeight;
    return outsideWindow || inPipes
}


function collide(rectangle1, rectangle2){
    return (
        rectangle1.left < rectangle2.right &&
        rectangle1.top < rectangle2.bottom &&
        rectangle1.right > rectangle2.left &&
        rectangle1.bottom > rectangle2.top
    )
}

function handleStart() {
    title.classList.add("hide")
    setUpBird()
    mountPipes()
    lastTime = null
    window.requestAnimationFrame(updateLoop)
}
function handleLoose() {
    setTimeout(() => {
    title.classList.remove("hide")
    subtitle.classList.remove("hide")
    subtitle.textContent = `${passedPipe()} pipes`;
    document.addEventListener("keypress", handleStart, { once: true});
    }, 200);
}
 