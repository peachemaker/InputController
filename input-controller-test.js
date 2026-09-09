const controller = new InputController({
    left: {
        keys: [37, 65, 37],
        enabled: false
    },
    right: {
        keys: [39, 68]
    }
})

console.log(controller)
console.log(controller.actions)