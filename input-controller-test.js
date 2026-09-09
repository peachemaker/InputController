const controller = new InputController({
    left: {
        keys: [37, 65, 37],
        enabled: false
    },
    right: {
        keys: [39, 68]
    }
})
console.log(controller.isActionActive('left'))
console.log(controller.disableAction('left'))
console.log(controller.isActionActive('left'))
console.log(controller.enableAction('left'))
console.log(controller.isActionActive('left'))
controller.pressedKey.add(65)
console.log(controller.isActionActive('left'))
console.log(controller)
console.log(controller.actions)