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

	public setState(name: DataStoreKeys, state: DataStoreTypes): DataStoreTypes {
		if (Object.keys(this._state).indexOf(name) == -1) {
			throw new Error("State must be registered first");
		} else {
			this.set(name, state);
			if (this._state[name].actions) {
				this._state[name].actions.forEach(action => {
					action();
				});
			}
		}
		return this.state[name];
	}

	public registerState(name: DataStoreKeys, initialState: DataStoreTypes) {
		if (Object.keys(this.state).indexOf(name) != -1) {
			throw new Error("State already exists");
		} else {
			this.set(name, initialState);
		}
	}

	public getState(name: DataStoreKeys): any {
		if (Object.keys(this.state).indexOf(name) == -1) {
			throw new Error("State is not registered - '" + name + "'");
		} else {
			return this.state[name];
		}
	}

	public subscribe(name: DataStoreKeys, actions: Function[]) {
		if (Object.keys(this._state).indexOf(name) == -1) {
			throw new Error("State is not registered");
		} else {
			this._state[name].actions = actions;
		}
	}

	public getStateObject() {
		return this._state;
	}

	private set(name: DataStoreKeys, state: DataStoreTypes) {
		if (Object.keys(this.state).indexOf(name) == -1) {
			this.state[name] = state;
			this._state[name] = {value: state, actions: []};
		} else {
			this._state[name].value = state;
			this.state[name] = state;
		}
	}
}
