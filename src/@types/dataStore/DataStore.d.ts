import { Calc } from "../../renderer/scripts/models/Calc";
import { Employee } from "../../renderer/scripts/models/Employee";
import { ContentCols } from "../ContentCols";

export type DataStoreTypes = Employee | Employee[] | boolean | number | ContentCols | null | Calc | Calc[];
export type DataStoreKeys =
	"employeeArray" |
	"employeeList" |
	"currentEmployee" |
	"isAsideOut" |
	"isModalUp" |
	"asideWidth" |
	"contentWidth" |
	"isResizingList" |
	"isResizingContent" |
	"newEmployee" |
	"currentIndex";

export interface DataStore {
	readonly state: State;
	readonly _state: _State;

	setState(state: DataStoreKeys, value: DataStoreTypes): DataStoreTypes;

	getState(state: DataStoreKeys): DataStoreTypes;

	registerState(state: DataStoreKeys, value: DataStoreTypes): void;

	subscribe(state: DataStoreKeys, actions: Function[]): void;

	getStateObject?(): _State;
}

export interface _State {
	[key: string]: _StateProp;
}

export interface State {
	[key: string]: DataStoreTypes;
}

export interface _StateProp {
	value: DataStoreTypes;
	actions: Function[];
}
