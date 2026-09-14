const controller = new InputController({
    left: {
        keys: [37, 65]
    },
    right: {
        keys: [39, 68]
    },
    up: {
        buttons: [0]
    },
    down: {
        buttons: [2]
    }
})
const player = document.getElementById("player");
const leftEnableButton = document.getElementById("enable-left")
const leftDisableButton = document.getElementById("disable-left")
const attachButton = document.getElementById("attach")
const detachButton = document.getElementById("detach")
const statusLeft = document.getElementById("statusLeft")
const statusRight = document.getElementById("statusRight")
const statusDown = document.getElementById("statusDown")
const statusUp = document.getElementById("statusUp")
const arrowLeft = document.getElementById("arrowLeft")
const arrowRight = document.getElementById("arrowRight")
const pressedA = document.getElementById("pressedA")
const pressedD = document.getElementById("pressedD")
const addJumpButton = document.getElementById("addJump")
const turnOffContButton = document.getElementById("turnoffcont")
const pressedMouseButtonLeft = document.getElementById("pressedMouseLeft")
const pressedMouseButtonRight = document.getElementById("pressedMouseRight")

addJumpButton.addEventListener("click", () => {
    controller.bindActions({
        jump: {
            keys: [32]
        }
    })
})
controller.attach(window)
let playerX = 280
let playerY = 30
setInterval(() => {
    if (controller.isActionActive("left")) {
        playerX -= 5
    }
    if (controller.isActionActive("right")) {
        playerX += 5
    }
    if (controller.isActionActive("down")) {
        playerY += 5
    }
    if (controller.isActionActive("up")) {
        playerY -= 5
    }
    player.style.left = `${playerX}px`
    player.style.top = `${playerY}px`
    statusLeft.textContent = controller.isActionActive("left")
    statusRight.textContent = controller.isActionActive("right")
    statusDown.textContent = controller.isActionActive("down")
    statusUp.textContent = controller.isActionActive("up")
    arrowLeft.textContent = controller.isKeyPressed(37)
    arrowRight.textContent = controller.isKeyPressed(39)
    pressedA.textContent = controller.isKeyPressed(65)
    pressedD.textContent = controller.isKeyPressed(68)
    pressedMouseButtonLeft.textContent = controller.isKeyPressed(0)
    pressedMouseButtonRight.textContent = controller.isKeyPressed(2)
}, 16)
controller.target.addEventListener(controller.ACTION_ACTIVATED, (event) => {
    if (event.detail.action === "jump") {
        player.style.background = "red"
    }
})
controller.target.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
    if (event.detail.action === "jump") {
        player.style.background = "green"
    }
})

leftEnableButton.addEventListener("click", () => controller.enableAction("left"))
leftDisableButton.addEventListener("click", () => controller.disableAction("left"))
attachButton.addEventListener("click", () => {
    controller.attach(window)
    turnOffContButton.textContent = "Выключить клавиатуру"
})
detachButton.addEventListener("click", () => controller.detach())
turnOffContButton.addEventListener("click", () => {
    if (controller.enabled === false) {
        turnOffContButton.textContent = "Выключить клавиатуру"
    }
    else {
        turnOffContButton.textContent = "Включить клавиатуру"
    }
    controller.enabled = !controller.enabled
})

window.addEventListener("blur", (event) => {
    console.log("blur")
}
)
window.addEventListener("focus", (event) => {
    console.log("focus")
}
)