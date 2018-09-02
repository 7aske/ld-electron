import { Employee } from './Employee';
export interface State {
	employeeArray: Array<Employee>;
	employeeList: Array<Employee>;
	currentEmployee: Employee | null;
	isAsideOut: boolean;
	isModalUp: boolean;
	asideWidth: number;
	contentWidth: number;
	isResizingList: boolean;
	isResizingContent: boolean;
	newEmployee: Employee | null;
	currentIndex: number;
	[key: string]: any;
}
interface _StateProp {
	value: Employee | Array<Employee> | boolean | number | null;
	actions: Array<Function>;
}
export interface _State {
	employeeArray: _StateProp;
	employeeList: _StateProp;
	currentEmployee: _StateProp;
	isAsideOut: _StateProp;
	isModalUp: _StateProp;
	asideWidth: _StateProp;
	contentWidth: _StateProp;
	isResizingList: _StateProp;
	isResizingContent: _StateProp;
	newEmployee: _StateProp;
	currentIndex: _StateProp;
	[key: string]: _StateProp;
}
export class Store {
	private _state: _State;
	public state: State;
	constructor(initialState: State) {
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
	public setState(state: string, value: Employee | Array<Employee> | boolean | number | null): Store {
		if (Object.keys(this._state).indexOf(state) == -1) {
			this._state[state] = { value: value, actions: [] };
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
	public subscribe(state: string, actions: Array<Function>): Store {
		if (Object.keys(this._state).indexOf(state) != -1) {
			this._state[state].actions = actions;
		}
		return this;
	}
	public getState<Employee>(state: string): any {
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
