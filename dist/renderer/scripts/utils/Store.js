"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Store = /** @class */ (function () {
    function Store(initialState) {
        var _this = this;
        this._state = {};
        Object.keys(initialState).forEach(function (key) {
            _this._state[key] = { value: initialState[key], actions: [] };
        });
        this.state = initialState;
    }
    Store.prototype.setState = function (state, value) {
        if (Object.keys(this._state).indexOf(state) == -1) {
            this._state[state] = { value: value, actions: [] };
            this.state[state] = value;
        }
        else {
            this._state[state].value = value;
            this.state[state] = value;
            if (this._state[state].actions) {
                this._state[state].actions.forEach(function (action) {
                    action();
                });
            }
        }
        return this;
    };
    Store.prototype.subscribe = function (state, actions) {
        if (Object.keys(this._state).indexOf(state) != -1) {
            this._state[state].actions = actions;
        }
        return this;
    };
    Store.prototype.getState = function (state) {
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
    };
    return Store;
}());
exports.Store = Store;
