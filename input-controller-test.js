const controller = new InputController({
    left: {
        keys: [37, 65, 37],
        enabled: false
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
// console.log(controller.isActionActive('left'))
// console.log(controller.disableAction('left'))
// console.log(controller.isActionActive('left'))
console.log(controller.enableAction('left'))
// console.log(controller.isActionActive('left'))
// controller.pressedKey.add(65)
// console.log(controller.isActionActive('left'))
// console.log(controller)
// console.log(controller.actions)

setInterval(() => {
    console.log(
        controller.isKeyPressed(65),
        controller.isKeyPressed(68),
    )
}, 1000)
