const controller = new InputController({
    left: {
        keys: [37, 65, 37],
    },
    right: {
        keys: [39, 68]
    }
})
const player = document.getElementById("player");
const leftEnableButton = document.getElementById("enable-left")
const leftDisableButton = document.getElementById("disable-left")
const attachButton = document.getElementById("attach")
const detachButton = document.getElementById("detach")
const statusLeft = document.getElementById("statusLeft")
const statusRight = document.getElementById("statusRight")
const arrowLeft = document.getElementById("arrowLeft")
const arrowRight = document.getElementById("arrowRight")
const pressedA = document.getElementById("pressedA")
const pressedD = document.getElementById("pressedD")


controller.attach(window)

controller.bindActions({
    jump: {
        keys: [32]
    }
})
let playerX = 280
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
    arrowLeft.textContent = controller.isKeyPressed(37)
    arrowRight.textContent = controller.isKeyPressed(39)
    pressedA.textContent = controller.isKeyPressed(65)
    pressedD.textContent = controller.isKeyPressed(68)
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
attachButton.addEventListener("click", () => controller.attach(window))
detachButton.addEventListener("click", () => controller.detach())

// console.log(controller.isActionActive('left'))
// console.log(controller.disableAction('left'))
// console.log(controller.isActionActive('left'))
// console.log(controller.isActionActive('left'))
// controller.pressedKey.add(65)
// console.log(controller.isActionActive('left'))
// console.log(controller)
// console.log(controller.actions)

setInterval(() => {
    console.log({
        left: controller.isActionActive("left"),
        right: controller.isActionActive("right"),
    })
}, 1000)
// window.addEventListener(controller.ACTION_ACTIVATED, (event) => {
//     console.log("событие", event.type)
//     console.log("действие", event.detail.action)
// }
// )

// window.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
//     console.log("событие", event.type)
//     console.log("действие", event.detail.action)
// }
// )

// window.addEventListener("blur", (event) => {
//     console.log("blur")
// }
// )

// window.addEventListener("focus", (event) => {
//     console.log("focus")
// }
// )


// // const game = document.createElement("div")
// // controller.attach(game)
// // console.log(controller.target === game)
// console.log(controller.actions)
