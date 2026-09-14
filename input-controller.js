(function () {
    class InputController {
        constructor(actionsToBind = {}, target = window) {
            this.actions = {}
            this.target = target
            this._enabled = true
            this.focused = true
            this.bindActions(actionsToBind)
            this.focusHandler = this.focusHandler.bind(this)
            this.blurHandler = this.blurHandler.bind(this)
            this.plugins = {
                keyboard: new KeyboardPlug(target, () => {
                    if (this.enabled) {
                        this.checkState()
                    }
                }),
                mouse: new MousePlug(target, () => {
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
                this.actions[actionName] = {
                    keys: [...new Set(action.keys)],
                    buttons: [...new Set(action.buttons)],
                    enabled: action.enabled ?? true,
                    active: false
                };
                for (const plugin in this.plugins) {
                    if (this.plugins[plugin].supportAction(this.actions[actionName])) {
                        this.plugins[plugin].bindAction(actionName, this.actions[actionName], this.actions)
                    }
                }
            }
        }

        // включить объявленную активность
        enableAction(actionName) {
            const action = this.actions[actionName]
            if (!action) {
                return
            }
            action.enabled = true;
            this.updateActionState(actionName)
        }

        // отключить объявленную активность
        disableAction(actionName) {
            const action = this.actions[actionName]
            if (!action) {
                return
            }
            action.enabled = false;
            this.updateActionState(actionName)
        }

        // проверяет активирована ли переданная активность
        isActionActive(actionName) {
            const action = this.actions[actionName];
            if (!action || !action.enabled || !this.enabled) {
                return false;
            }
            for (const plugin in this.plugins) {
                if (this.plugins[plugin].supportAction(action) && this.plugins[plugin].isActionActive(action)) {
                    return true
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
            for (const plugin in this.plugins) {
                this.plugins[plugin].clear()
            }
            for (const actionName in this.actions) {
                this.actions[actionName].active = false
            }
        }

        // проверяет нажата ли переданная кнопка
        isKeyPressed(input) {
            for (const plugin in this.plugins) {
                if (this.plugins[plugin].isKeyPressed(input)) {
                    return true
                }
            }
            return false
        }

        // проверяет изменилось ли состояние действия
        checkState() {
            for (const actionName in this.actions) {
                this.updateActionState(actionName)
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
                this.plugins[plugin].clear()
            }
            window.removeEventListener("focus", this.focusHandler)
            window.removeEventListener("blur", this.blurHandler)
            for (const actionName in this.actions) {
                this.actions[actionName].active = false
            }
        }

        get enabled() {
            return this._enabled
        }

        set enabled(value) {
            if (this._enabled === value) {
                return
            }
            this._enabled = value
            this.checkState()
        }

        updateActionState(actionName) {
            const action = this.actions[actionName]
            if (!action) {
                return
            }
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
    // плагин для клавиатуры
    class KeyboardPlug {
        constructor(target, changeOnInput) {
            this.target = target
            this.pressedKey = new Set()
            this.keyDownHandler = this.keyDownHandler.bind(this)
            this.keyUpHandler = this.keyUpHandler.bind(this)
            this.changeOnInput = changeOnInput
        }

        bindAction(actionName, action, actions) {
            for (const key of action.keys) {
                for (const existActionName in actions) {
                    if (existActionName === actionName) {
                        continue
                    }
                    const existAction = actions[existActionName]
                    existAction.keys = existAction.keys.filter(oldkey => oldkey !== key)
                }
            }
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
        }

        keyUpHandler(event) {
            this.pressedKey.delete(event.keyCode)
            this.changeOnInput()
        }

        isKeyPressed(keyCode) {
            return this.pressedKey.has(keyCode)
        }

        isActionActive(action) {
            const keys = action.keys;
            return keys.some(key => this.isKeyPressed(key));
        }

        supportAction(action) {
            return action.keys.length > 0
        }

        clear() {
            this.pressedKey.clear()
        }
    }

    // плагин для мыши
    class MousePlug {
        constructor(target, changeOnInput) {
            this.target = target
            this.pressedButton = new Set()
            this.buttonDownHandler = this.buttonDownHandler.bind(this)
            this.buttonUpHandler = this.buttonUpHandler.bind(this)
            this.changeOnInput = changeOnInput
        }

        bindAction(actionName, action, actions) {
            for (const button of action.buttons) {
                for (const existActionName in actions) {
                    if (existActionName === actionName) {
                        continue
                    }
                    const existAction = actions[existActionName]
                    existAction.buttons = existAction.buttons.filter(oldbutton => oldbutton !== button)
                }
            }
        }

        attach(target) {
            this.target = target
            this.target.addEventListener("mousedown", this.buttonDownHandler)
            this.target.addEventListener("mouseup", this.buttonUpHandler)
        }

        detach() {
            this.target.removeEventListener("mousedown", this.buttonDownHandler)
            this.target.removeEventListener("mouseup", this.buttonUpHandler)
        }

        buttonDownHandler(event) {
            this.pressedButton.add(event.button)
            this.changeOnInput()
        }

        buttonUpHandler(event) {
            this.pressedButton.delete(event.button)
            this.changeOnInput()
        }

        isKeyPressed(button) {
            return this.pressedButton.has(button)
        }

        isActionActive(action) {
            const buttons = action.buttons;
            return buttons.some(button => this.isKeyPressed(button));
        }

        supportAction(action) {
            return action.buttons.length > 0
        }

        clear() {
            this.pressedButton.clear()
        }
    }
    window.MousePlug = MousePlug
    window.KeyboardPlug = KeyboardPlug
    window.InputController = InputController
})();
