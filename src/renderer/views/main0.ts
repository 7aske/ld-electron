import { ipcRenderer } from 'electron';

declare global {
	interface Window {
		process: any;
	}
}
window.process = process || {};
const ENV: string | undefined = window.process.type == 'renderer' ? 'electron' : 'web';
import { Employee, EmployeeProperties } from '../scripts/Employee';
import { Menu } from '../scripts/Menu';
import { Modal } from '../scripts/Modal';
import { Store, State, ContentCols } from '../scripts/Store';
import { Resizer } from '../scripts/Resizer';
interface Config {
	isAsideOut: boolean;
	contentWidth: ContentCols;
	asideWidth: number;
	[key: string]: Employee | Employee[] | boolean | number | ContentCols | null;
}
const initialState: State = {
	employeeArray: [],
	employeeList: [],
	currentEmployee: null,
	isAsideOut: false,
	isModalUp: false,
	asideWidth: 400,
	contentWidth: { left: 6, right: 6 },
	isResizingList: false,
	isResizingContent: false,
	newEmployee: null,
	currentIndex: 0
};
let store: Store = new Store(initialState);
let resizer: Resizer = new Resizer(store);
