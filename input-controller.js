(function () {
    class InputController {
        constructor(actionsToBind = {}, target = window) {
            this.actions = {}
            this.target = target
            this.enabled = true
            this.focused = true
            this.bindActions(actionsToBind)
            this.focusHandler = this.focusHandler.bind(this)
            this.blurHandler = this.blurHandler.bind(this)
            this.plugins = {
                keyboard: new KeyboardPlug(target, () => {
                    if (this.enabled) {
                        this.checkState()
                    }
                })
            }
            this.ACTION_ACTIVATED = "input-controller:action-activated"
            this.ACTION_DEACTIVATED = "input-controller:action-deactivated"
        }

        // добавление действий
        bindActions(actionsToBind) {
            for (const actionName in actionsToBind) {
                const action = actionsToBind[actionName]
                const keys = [...new Set(action.keyboard.keys)];
                for (const key of keys) {
                    for (const existActionName in this.actions) {
                        const existAction = this.actions[existActionName]
                        existAction.keyboard.keys = existAction.keyboard.keys.filter(oldkey => oldkey !== key)
                    }
                }
                this.actions[actionName] = {
                    keyboard: { keys: keys },
                    enabled: action.enabled ?? true,
                    active: false
                };
            }
            console.log(this.actions)
        }

        // включить объявленную активность
        enableAction(actionName) {
            if (this.actions[actionName]) {
                this.actions[actionName].enabled = true;
            }
        }

        // отключить объявленную активность
        disableAction(actionName) {
            if (this.actions[actionName]) {
                this.actions[actionName].enabled = false;
                this.actions[actionName].active = false
            }
        }

        // проверяет активирована ли переданная активность
        isActionActive(actionName) { 
            const action = this.actions[actionName];
            if (!action || !action.enabled || !this.enabled) {
                return false;
            }
            for (const plugin in this.plugins) {
                if (this.plugins[plugin].supportAction(action)) {
                    return this.plugins[plugin].isActionActive(action)
                }
            }
            return false
        }

        // устанавливает значение true когда окно в фокусе
        focusHandler() {
            this.focused = true
        }

        // устанавливает значение false когда окно не в фокусе, очищает нажатые клавиши
        blurHandler() {
            this.focused = false
            this.plugins.keyboard.clear()
            for (const actionName in this.actions) {
                this.actions[actionName].active = false
            }
        }

        // проверяет нажата ли переданная кнопка
        isKeyPressed(keyCode) {
            return this.plugins.keyboard.isKeyPressed(keyCode)
        }

        // проверяет изменилось ли состояние действия
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
                        this.target.dispatchEvent(event)
                    }
                    else {
                        const event = new CustomEvent(this.ACTION_DEACTIVATED, {
                            detail: {
                                action: actionName
                            }
                        })
                        this.target.dispatchEvent(event)
                    }
                }
            }
        }

        // Нацеливает контроллер на переданный DOM-элемент
        attach(target, dontEnable = false) {
            this.target = target
            for (const plugin in this.plugins) {
                this.plugins[plugin].attach(target)
            }
            window.addEventListener("focus", this.focusHandler)
            window.addEventListener("blur", this.blurHandler)
            if (!dontEnable) {
                this.enabled = true
            }
        }

        // Отцепляет контроллер от активного DOM-элемента и деактивирует контроллер
        detach() {
            for (const plugin in this.plugins) {
                this.plugins[plugin].detach()
            }
            window.removeEventListener("focus", this.focusHandler)
            window.removeEventListener("blur", this.blurHandler)
            this.plugins.keyboard.clear()
            for (const actionName in this.actions) {
                this.actions[actionName].active = false
            }
        }
    }

    // плагин для клавиатуры
    class KeyboardPlug {
        constructor(target, changeOnInput) {
            this.target = target
            this.pressedKey = new Set()
            this.keyDownHandler = this.keyDownHandler.bind(this)
            this.keyUpHandler = this.keyUpHandler.bind(this)
            this.changeOnInput = changeOnInput
        }

        attach(target) {
            this.target = target
            this.target.addEventListener("keydown", this.keyDownHandler)
            this.target.addEventListener("keyup", this.keyUpHandler)
        }

        detach() {
            this.target.removeEventListener("keydown", this.keyDownHandler)
            this.target.removeEventListener("keyup", this.keyUpHandler)
        }

        keyDownHandler(event) {
            this.pressedKey.add(event.keyCode)
            this.changeOnInput()
            console.log("нажата:" + event.keyCode)
        }

        keyUpHandler(event) {
            this.pressedKey.delete(event.keyCode)
            this.changeOnInput()
            console.log("отпущена:" + event.keyCode)
        }

        isKeyPressed(keyCode) {
            return this.pressedKey.has(keyCode)
        }

        isActionActive(action) {
            const keys = action.keyboard.keys;
            return keys.some(key => this.isKeyPressed(key));
        }

        supportAction(action) {
            return action.keyboard !== undefined
        }

        clear() {
            this.pressedKey.clear()
        }
    }
    window.KeyboardPlug = KeyboardPlug
    window.InputController = InputController
})();
