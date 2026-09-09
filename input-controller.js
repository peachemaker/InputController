(function () {
    class InputController {
        constructor(actionsToBind = {}) {
            this.actions = {}
            this.pressedKey = new Set()
            this.bindActions(actionsToBind)

            this.keyDownHandler = this.keyDownHandler.bind(this)
            this.keyUpHandler = this.keyUpHandler.bind(this)
            window.addEventListener("keydown", this.keyDownHandler)
            window.addEventListener("keyup", this.keyUpHandler)
        }

        bindActions(actionsToBind) {
            for (const actionName in actionsToBind) {
                const action = actionsToBind[actionName]
                const keys = [...new Set(action.keys)];

                this.actions[actionName] = {
                    keys: keys,
                    enabled: action.enabled ?? true
                };
            }

        }

        enableAction(actionName) {
            if (this.actions[actionName]) {
                this.actions[actionName].enabled = true;
            }
        }

        disableAction(actionName) {
            if (this.actions[actionName]) {
                this.actions[actionName].enabled = false;
            }
        }

        isActionActive(actionName) {
            const action = this.actions[actionName];
            if (!action || !action.enabled) {
                return false;
            }
            return action.keys.some(key => this.pressedKey.has(key));
        }

        keyDownHandler(event){
            this.pressedKey.add(event.keyCode)
        }

        keyUpHandler(event){
            this.pressedKey.delete(event.keyCode)
            console.log("keyup", event.keyCode)
        }
    }
    window.InputController = InputController
})();
