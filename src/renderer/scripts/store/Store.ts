import { _State, _StateProp, ContentCols } from "../../../@types";
import { State } from "../../../@types";
import { Calc } from "../models/Calc";
import { Employee } from "../models/Employee";

export class Store {
	private _state: _State = {};
	private state: any;

	constructor(initialState: any) {
		Object.keys(initialState).forEach(key => {
			this._state[key] = {value: initialState[key], actions: []};
		});
		this.state = initialState;
	}

	public setState(state: string, value: Employee | Employee[] | boolean | number | ContentCols | null | Calc | Calc[]): Store {
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
		return this;
	}

	public subscribe(state: string, actions: Function[]): Store {
		if (Object.keys(this._state).indexOf(state) != -1) {
			this._state[state].actions = actions;
		}
		return this;
	}

	public getState(state: string): any {
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
