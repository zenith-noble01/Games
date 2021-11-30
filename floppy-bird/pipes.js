const HOLE_HEIGHT = 120;
const PIPE_SPEED = .75;
const PIPE_WIDTH = 50;
const PIPE_HEIGHT = 120;
let timeSinceLastPipe;
let PIPE_INTERVAL = 1500;
let pipes = [];
let passedPipeCount = 0

export function mountPipes (){
    document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH);
    document.documentElement.style.setProperty("--hole-height", PIPE_HEIGHT);
    pipes.forEach(pipe => pipe.remove())
    timeSinceLastPipe = PIPE_INTERVAL
}


export function pipesRect(){
    return pipes.flatMap(pipe => pipe.rectangle())
}

export function passedPipe(){
    return passedPipeCount
}

export function updatePipes(delta){
    timeSinceLastPipe += delta

    if (timeSinceLastPipe > PIPE_INTERVAL){
        timeSinceLastPipe -= PIPE_INTERVAL
        createPipeElem()
    }

    pipes.forEach(pipe => {
        if (pipe.left + PIPE_WIDTH < 0){
            passedPipeCount++
            return pipe.remove()
        }
        pipe.left = pipe.left - delta * PIPE_SPEED
    })
}

function createPipeElem(){
    const pipeElement = document.createElement("div")
    pipeElement.classList.add("pipe")
    const topElement = createPipeContainer("top")
    const bottomElement = createPipeContainer("bottom")
    pipeElement.append(topElement)
    pipeElement.append(bottomElement)
    pipeElement.style.setProperty("--hole-top", randomNumberBetweenEach(
        HOLE_HEIGHT * 1.5,
        window.innerHeight - HOLE_HEIGHT * 0.5
    ))

    const pipe = {
        get left(){
            return parseFloat(getComputedStyle(pipeElement).getPropertyValue("--pipe-left"));
        },
        set left(value){
            pipeElement.style.setProperty("--pipe-left", value)
        },

        remove(){
            pipes = pipes.filter(p => p !== pipe)
            pipeElement.remove()
        },
        rectangle(){
            return[
                topElement.getBoundingClientRect(),
                bottomElement.getBoundingClientRect()
            ]
        }
    }

    pipe.left = window.innerWidth
    document.body.append(pipeElement)
    pipes.push(pipe)
}

function createPipeContainer (position){
    const segment = document.createElement("div")
    segment.classList.add("segment", position)
    return segment
}

function randomNumberBetweenEach (min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}