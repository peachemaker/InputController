(function () {
    class InputController {
        constructor(actionsToBind = {}) {
            this.actions = {}
            this.pressedKey = new Set()
            this.bindActions(actionsToBind)
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
    }
    window.InputController = InputController
})();
