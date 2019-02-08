import { Store } from "../renderer/scripts/store/Store";
export { Config } from "./Config";
export { EmployeeChanges } from "./models/EmployeeChanges";
export { EmployeeProperties } from "./models/EmployeeProperties";
export { YoSPeriod } from "./models/YoSPeriod";
export { ContentCols } from "./ContentCols";
export { MenuOption } from "./MenuOption";
export { CalcProp } from "./models/CalcProp";
export { CalcProps } from "./models/CalcProps";
export { DataStore, State, _State, _StateProp, DataStoreTypes, DataStoreKeys  } from "./dataStore/DataStore";
declare global {
	interface Window {
		process: any;
	}
}
declare global {
	interface Document {
		store?: Store;
	}
}
