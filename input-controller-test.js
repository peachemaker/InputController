const controller = new InputController({
    left: {
        keys: [37, 65],
        buttons: [0]
    },
    right: {
        keys: [39, 68],
        buttons: [2]
    },
})
controller.attach(window)
const player = document.getElementById("player");
const leftEnableButton = document.getElementById("enable-left")
const leftDisableButton = document.getElementById("disable-left")
const attachButton = document.getElementById("attach")
const detachButton = document.getElementById("detach")
const statusLeft = document.getElementById("statusLeft")
const statusRight = document.getElementById("statusRight")
const statusJump = document.getElementById("statusJump")
const arrowLeft = document.getElementById("arrowLeft")
const arrowRight = document.getElementById("arrowRight")
const pressedA = document.getElementById("pressedA")
const pressedD = document.getElementById("pressedD")
const addJumpButton = document.getElementById("addJump")
const turnOffContButton = document.getElementById("turnoffcont")
const pressedMouseButtonLeft = document.getElementById("pressedMouseLeft")
const pressedMouseButtonRight = document.getElementById("pressedMouseRight")
const pressedMouseButtonCenter = document.getElementById("pressedMouseCenter")
const pressedSpaceButton = document.getElementById("pressedSpace")
let playerX = 280

addJumpButton.addEventListener("click", () => {
    controller.bindActions({
        jump: {
            keys: [32],
            buttons: [1]
        }
    })
})

setInterval(() => {
    if (controller.isActionActive("left")) {
        playerX -= 5
    }
    if (controller.isActionActive("right")) {
        playerX += 5
    }
    player.style.left = `${playerX}px`
    statusLeft.textContent = controller.isActionActive("left")
    statusRight.textContent = controller.isActionActive("right")
    statusJump.textContent = controller.isActionActive("jump")
    arrowLeft.textContent = controller.isKeyPressed(37)
    arrowRight.textContent = controller.isKeyPressed(39)
    pressedA.textContent = controller.isKeyPressed(65)
    pressedD.textContent = controller.isKeyPressed(68)
    pressedMouseButtonLeft.textContent = controller.isKeyPressed(0)
    pressedMouseButtonRight.textContent = controller.isKeyPressed(2)
    pressedMouseButtonCenter.textContent = controller.isKeyPressed(1)
    pressedSpaceButton.textContent = controller.isKeyPressed(32)
}, 16)

controller.target.addEventListener(controller.ACTION_ACTIVATED, (event) => {
    if (controller.isActionActive("jump") === true) {
        player.style.background = "red"
    }
    console.log("activated", event.detail.action)
})

controller.target.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
    if (controller.isActionActive("jump") === false) {
        player.style.background = "green"
    }
    console.log("deactivated", event.detail.action)
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

window.addEventListener("blur", () => {
    console.log("blur")
}
)

window.addEventListener("focus", () => {
    console.log("focus")
}
)