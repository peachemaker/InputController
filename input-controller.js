(function () {
    class InputController {
        constructor(actionsToBind = {}, target = window) {
            this.actions = {}
            this.pressedKey = new Set()
            this.target = target
            this.enable = true
            this.focused = true
            this.bindActions(actionsToBind)
            this.keyDownHandler = this.keyDownHandler.bind(this)
            this.keyUpHandler = this.keyUpHandler.bind(this)
            this.focusHandler = this.focusHandler.bind(this)
            this.blurHandler = this.blurHandler.bind(this)
            this.ACTION_ACTIVATED = "input-controller:action-activated"
            this.ACTION_DEACTIVATED = "input-controller:action-deactivated"
        }

        bindActions(actionsToBind) {
            for (const actionName in actionsToBind) {
                const action = actionsToBind[actionName]
                const keys = [...new Set(action.keys)];
                for (const key of keys){
                    for (const existActionName in this.actions){
                        const existAction = this.actions[existActionName]
                        console.log(existActionName, existAction.keys)
                        existAction.keys = existAction.keys.filter(oldkey => oldkey !== key)
                    }
                    
                }
                this.actions[actionName] = {
                    keys: keys,
                    enabled: action.enabled ?? true,
                    active: false
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

        keyDownHandler(event) {
            if (!this.enable || !this.focused) {
                return
            }
            this.pressedKey.add(event.keyCode)
            this.checkState()
        }

        keyUpHandler(event) {
            this.pressedKey.delete(event.keyCode)
            if (!this.enable) {
                return
            }
            this.checkState()
        }

        focusHandler() {
            this.focused = true
        }

        blurHandler() {
            this.focused = false
            this.pressedKey.clear()
            for (const actionName in this.actions) {
                this.actions[actionName].active = false
            }
        }

        isKeyPressed(keyCode) {
            return this.pressedKey.has(keyCode)
        }

        checkState() {
            for (const actionName in this.actions) {
                const action = this.actions[actionName]
                const currState = this.isActionActive(actionName)
                if (currState != action.active) {
                    action.active = currState
                    if (currState) {
                        const event = new CustomEvent(this.ACTION_ACTIVATED, {
                            detail: {
                                action: actionName
                            }
                        })
                        window.dispatchEvent(event)
                    }
                    else {
                        const event = new CustomEvent(this.ACTION_DEACTIVATED, {
                            detail: {
                                action: actionName
                            }
                        })
                        window.dispatchEvent(event)
                    }
                }
            }
        }

        attach(target, dontEnable = false) {
            this.target = target
            this.target.addEventListener("keydown", this.keyDownHandler)
            this.target.addEventListener("keyup", this.keyUpHandler)
            window.addEventListener("focus", this.focusHandler)
            window.addEventListener("blur", this.blurHandler)
            if (!dontEnable) {
                this.enable = true
            }
        }

        detach() {
            this.target.removeEventListener("keydown", this.keyDownHandler)
            this.target.removeEventListener("keyup", this.keyUpHandler)
            window.removeEventListener("focus", this.focusHandler)
            window.removeEventListener("blur", this.blurHandler)
            this.pressedKey.clear()
            for (const actionName in this.actions) {
                this.actions[actionName].active = false
            }
        }
    }
    window.InputController = InputController
})();
