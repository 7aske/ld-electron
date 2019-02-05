import { _State, DataStoreKeys, State } from "../../../@types";
import { DataStore, DataStoreTypes } from "../../../@types";

export class Store implements DataStore {
	public readonly _state: _State = {};
	public readonly state: State = {};

	constructor(initialState: State) {
		Object.keys(initialState).forEach(key => {
			this._state[key] = {value: initialState[key], actions: []};
		});
		this.state = initialState;
	}

	public setState(state: DataStoreKeys, value: DataStoreTypes) {
		if (Object.keys(this._state).indexOf(state) == -1) {
			this._state[state] = {value, actions: []};
			this.state[state] = value;
		} else {
			this._state[state].value = value;
			this.state[state] = value;
			if (this._state[state].actions) {
				this._state[state].actions.forEach(action => {
					action();
				});
			}
		}
	}

	public getState(state: DataStoreKeys): any {
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

	public subscribe(state: DataStoreKeys, actions: Function[]) {
		if (Object.keys(this._state).indexOf(state) != -1) {
			this._state[state].actions = actions;
		}
	}

	public getStateObject() {
		return this.state;
	}
}
