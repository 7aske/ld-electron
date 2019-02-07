"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Store = /** @class */ (function () {
    function Store(initialState) {
        var _this = this;
        this._state = {};
        this.state = {};
        Object.keys(initialState).forEach(function (key) {
            _this._state[key] = { value: initialState[key], actions: [] };
        });
        this.state = initialState;
    }
    Store.prototype.setState = function (state, value) {
        if (Object.keys(this._state).indexOf(state) == -1) {
            throw new Error("State must be registered first");
        }
        else {
            this.set(state, value);
            if (this._state[state].actions) {
                this._state[state].actions.forEach(function (action) {
                    action();
                });
            }
        }
        return this.state[state];
    };
    Store.prototype.registerState = function (state, value) {
        if (Object.keys(this.state).indexOf(state) == -1) {
            throw new Error("State already exists");
        }
        else {
            this.set(state, value);
        }
    };
    Store.prototype.getState = function (state) {
        if (Object.keys(this.state).indexOf(state) == -1) {
            throw new Error("State is not registered");
        }
        else {
            return this.state[state];
        }
    };
    Store.prototype.subscribe = function (state, actions) {
        if (Object.keys(this._state).indexOf(state) == -1) {
            throw new Error("State is not registered");
        }
        else {
            this._state[state].actions = actions;
        }
    };
    Store.prototype.getStateObject = function () {
        return this._state;
    };
    Store.prototype.set = function (state, value) {
        if (Object.keys(this.state).indexOf(state) == -1) {
            this.state[state] = value;
            this._state[state] = { value: value, actions: [] };
        }
        else {
            this._state[state].value = value;
            this.state[state] = value;
        }
    };
    return Store;
}());
exports.Store = Store;
