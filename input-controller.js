(function () {
    class InputController {
        constructor(actionsToBind = {}) {
            this.actions = {}
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
    }
    window.InputController = InputController
})();
