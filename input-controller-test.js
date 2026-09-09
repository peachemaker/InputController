const controller = new InputController({
    left: {
        keys: [37, 65, 37],
    },
    right: {
        keys: [39, 68]
    },
    up: {
        keys: [87, 38]
    },
    down: {
        keys: [83, 40]
    }
})
controller.attach(window)
controller.attach(window)
controller.enable = true
// console.log(controller.isActionActive('left'))
// console.log(controller.disableAction('left'))
// console.log(controller.isActionActive('left'))
// console.log(controller.enableAction('left'))
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
window.addEventListener(controller.ACTION_ACTIVATED, (event) => {
    console.log("событие", event.type)
    console.log("действие", event.detail.action)
}
)

window.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
    console.log("событие", event.type)
    console.log("действие", event.detail.action)
}
)

window.addEventListener("blur", (event) => {
    console.log("blur")
}
)

window.addEventListener("focus", (event) => {
    console.log("focus")
}
)
// const game = document.createElement("div")
// controller.attach(game)
// console.log(controller.target === game)
// console.log(controller.actions)
