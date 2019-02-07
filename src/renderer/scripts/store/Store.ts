import { _State, DataStoreKeys, State } from "../../../@types";
import { DataStore, DataStoreTypes } from "../../../@types";
import Data = Electron.Data;

export class Store implements DataStore {
	public readonly _state: _State = {};
	public readonly state: State = {};

	constructor(initialState: State) {
		Object.keys(initialState).forEach(key => {
			this._state[key] = {value: initialState[key], actions: []};
		});
		this.state = initialState;
	}

	public setState(state: DataStoreKeys, value: DataStoreTypes): DataStoreTypes {
		if (Object.keys(this._state).indexOf(state) == -1) {
			throw new Error("State must be registered first");
		} else {
			this.set(state, value);
			if (this._state[state].actions) {
				this._state[state].actions.forEach(action => {
					action();
				});
			}
		}
		return this.state[state];
	}

	public registerState(state: DataStoreKeys, value: DataStoreTypes) {
		if (Object.keys(this.state).indexOf(state) == -1) {
			throw new Error("State already exists");
		} else {
			this.set(state, value);
		}
	}

	public getState(state: DataStoreKeys): any {
		if (Object.keys(this.state).indexOf(state) == -1) {
			throw new Error("State is not registered");
		} else {
			return this.state[state];
		}
	}

	public subscribe(state: DataStoreKeys, actions: Function[]) {
		if (Object.keys(this._state).indexOf(state) == -1) {
			throw new Error("State is not registered");
		} else {
			this._state[state].actions = actions;
		}
	}

	public getStateObject() {
		return this._state;
	}

	private set(state: DataStoreKeys, value: DataStoreTypes) {
		if (Object.keys(this.state).indexOf(state) == -1) {
			this.state[state] = value;
			this._state[state] = {value, actions: []};
		} else {
			this._state[state].value = value;
			this.state[state] = value;
		}
	}
}
