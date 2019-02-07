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
    Store.prototype.setState = function (name, state) {
        if (Object.keys(this._state).indexOf(name) == -1) {
            throw new Error("State must be registered first");
        }
        else {
            this.set(name, state);
            if (this._state[name].actions) {
                this._state[name].actions.forEach(function (action) {
                    action();
                });
            }
        }
        return this.state[name];
    };
    Store.prototype.registerState = function (name, initialState) {
        if (Object.keys(this.state).indexOf(name) != -1) {
            throw new Error("State already exists");
        }
        else {
            this.set(name, initialState);
        }
    };
    Store.prototype.getState = function (name) {
        if (Object.keys(this.state).indexOf(name) == -1) {
            throw new Error("State is not registered - '" + name + "'");
        }
        else {
            return this.state[name];
        }
    };
    Store.prototype.subscribe = function (name, actions) {
        if (Object.keys(this._state).indexOf(name) == -1) {
            throw new Error("State is not registered");
        }
        else {
            this._state[name].actions = actions;
        }
    };
    Store.prototype.getStateObject = function () {
        return this._state;
    };
    Store.prototype.set = function (name, state) {
        if (Object.keys(this.state).indexOf(name) == -1) {
            this.state[name] = state;
            this._state[name] = { value: state, actions: [] };
        }
        else {
            this._state[name].value = state;
            this.state[name] = state;
        }
    };
    return Store;
}());
exports.Store = Store;
