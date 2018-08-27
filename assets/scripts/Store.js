class Store {
	constructor(initialState = {}) {
		this._state = {};
		Object.keys(initialState).forEach(key => {
			this._state[key] = { value: initialState[key], actions: null };
		});
		this.state = initialState;
	}
	setState(state, value) {
		if (Object.keys(this._state).indexOf(state) == -1) {
			this._state[state] = { value: value, actions: [] };
			this.state[state] = value;
		} else {
			this._state[state].value = value;
			this.state[state] = value;
			if (this._state[state].actions) {
				if (this._state[state].actions instanceof Array) {
					this._state[state].actions.forEach(action => {
						action();
					});
				} else {
					this._state[state].actions();
				}
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
			} else {
				return null;
			}
		} else {
			return this.state;
		}
	}
}
