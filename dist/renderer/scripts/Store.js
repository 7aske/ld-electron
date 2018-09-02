"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor(initialState) {
        this._state = {
            employeeArray: {
                value: initialState.employeeArray,
                actions: []
            },
            employeeList: {
                value: initialState.employeeList,
                actions: []
            },
            currentEmployee: {
                value: initialState.currentEmployee,
                actions: []
            },
            isAsideOut: {
                value: initialState.isAsideOut,
                actions: []
            },
            isModalUp: {
                value: initialState.isModalUp,
                actions: []
            },
            asideWidth: {
                value: initialState.asideWidth,
                actions: []
            },
            contentWidth: {
                value: initialState.contentWidth,
                actions: []
            },
            isResizingList: {
                value: initialState.isResizingList,
                actions: []
            },
            isResizingContent: {
                value: initialState.isResizingContent,
                actions: []
            },
            newEmployee: {
                value: initialState.newEmployee,
                actions: []
            },
            currentIndex: {
                value: initialState.currentIndex,
                actions: []
            }
        };
        Object.keys(initialState).forEach(key => {
            this._state[key] = { value: initialState[key], actions: [] };
        });
        this.state = initialState;
    }
    setState(state, value) {
        if (Object.keys(this._state).indexOf(state) == -1) {
            this._state[state] = { value: value, actions: [] };
            this.state[state] = value;
        }
        else {
            this._state[state].value = value;
            this.state[state] = value;
            if (this._state[state].actions) {
                this._state[state].actions.forEach(action => {
                    action();
                });
            }
        }
        return this;
    }
    subscribe(state, actions) {
        if (Object.keys(this._state).indexOf(state) != -1) {
            this._state[state].actions = actions;
        }
        return this;
    }
    getState(state) {
        if (state) {
            if (Object.keys(this.state).indexOf(state) != -1) {
                return this.state[state];
            }
            else {
                return null;
            }
        }
        else {
            return this.state;
        }
    }
}
exports.Store = Store;
