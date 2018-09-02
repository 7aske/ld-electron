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
import { Store, State } from '../scripts/Store';
import axios from 'axios';
import { employeeSummaryTemplate, optionTemplate } from '../scripts/templates';
interface Config {
	isAsideOut: boolean;
	contentWidth: number;
	asideWidth: number;
	[key: string]: Employee | Array<Employee> | boolean | number | null;
}
const initialState: State = {
	employeeArray: [],
	employeeList: [],
	currentEmployee: null,
	isAsideOut: false,
	isModalUp: false,
	asideWidth: 400,
	contentWidth: 500,
	isResizingList: false,
	isResizingContent: false,
	newEmployee: null,
	currentIndex: 0
};
const store = new Store(initialState);

const main: HTMLElement = document.querySelector('main');

let menu: any = null;

const url: string | null = ENV == 'electron' ? null : 'http://localhost:3000';
store.subscribe('isAsideOut', [asideToggle, positionResizeBars]);
store.subscribe('currentEmployee', [populateFields, colorEmployeeList]);
store.subscribe('employeeArray', [populateEmployeeList]);
store.subscribe('employeeList', [populateEmployeeList, colorEmployeeList]);
store.subscribe('asideWidth', [positionResizeBars]);
store.subscribe('contentWidth', [handleResizeContent, positionResizeBars]);
const resize0: HTMLElement = document.querySelector('#resize0');
resize0.addEventListener('mousedown', () => store.setState('isResizingList', !store.getState('isResizingList')));
const resize1: HTMLElement = document.querySelector('#resize1');
resize1.addEventListener('mousedown', () => store.setState('isResizingContent', !store.getState('isResizingContent')));
const modal = new Modal();
const employeeList: HTMLElement = document.querySelector('#employeeList');
const searchInp: HTMLInputElement = document.querySelector('#searchInp');
searchInp.addEventListener('input', function() {
	searchEmployeeArray(this.value);
});
const aside: HTMLElement = document.querySelector('aside');
const asideTrigger: HTMLButtonElement = document.querySelector('#asideTrigger');
asideTrigger.addEventListener('click', () => {
	store.setState('isAsideOut', !store.getState('isAsideOut'));
});
const saveBtn: HTMLButtonElement = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', () => {
	employeeSave(null);
});
const backBtn: HTMLButtonElement = document.querySelector('#backBtn');
backBtn.addEventListener('click', handleBack);
const rejectBtn: HTMLButtonElement = document.querySelector('#rejectBtn');
rejectBtn.addEventListener('click', employeeReject);
const deleteBtn: HTMLButtonElement = document.querySelector('#deleteBtn');
deleteBtn.addEventListener('click', employeeDelete);
const fromDateInternal: HTMLInputElement = document.querySelector('#fromDateInternal');
const tillDateInternal: HTMLInputElement = document.querySelector('#tillDateInternal');
const addInternalYoSPeriod: HTMLButtonElement = document.querySelector('#addInternalYoSPeriod');
addInternalYoSPeriod.addEventListener('click', function() {
	addYoSPeriod(this.id, fromDateInternal.value, tillDateInternal.value);
});
const fromDateExternal: HTMLInputElement = document.querySelector('#fromDateExternal');
const tillDateExternal: HTMLInputElement = document.querySelector('#tillDateExternal');
const addExternalYoSPeriod: HTMLButtonElement = document.querySelector('#addExternalYoSPeriod');
addExternalYoSPeriod.addEventListener('click', function() {
	addYoSPeriod(this.id, fromDateExternal.value, tillDateExternal.value);
});
const addNewBtn: HTMLButtonElement = document.querySelector('#addNewBtn');
addNewBtn.addEventListener('click', addNewEmployee);
const headerInputs: Array<HTMLInputElement> = Array.prototype.slice.call(document.querySelectorAll<HTMLInputElement>('header input'));
const mainInputs: Array<HTMLInputElement> = Array.prototype.slice.call(document.querySelectorAll<HTMLInputElement>('main input'));
const inputs: Array<HTMLInputElement> = [...headerInputs, ...mainInputs, document.querySelector('main textarea')];
inputs.forEach(i => {
	i.addEventListener('keyup', function() {
		if (
			this.id.indexOf('fromDateInternal') == -1 &&
			this.id.indexOf('tillDateInternal') == -1 &&
			this.id.indexOf('fromDateExternal') == -1 &&
			this.id.indexOf('tillDateExternal') == -1
		)
			handleInput(this.id, this.value, this);
	});
});
function getWidth(): number {
	return store.getState('isAsideOut') ? window.innerWidth - store.getState('asideWidth') : window.innerWidth;
}
function handleBack(event: Event): void {
	event.preventDefault();
	let commit: Array<Employee> = [];
	let check: boolean = false;
	const array: Array<Employee> = store.getState('employeeArray');
	array.forEach(e => {
		if (Object.keys(e.changes).length > 0) {
			check = true;
		}
	});
	if (check) {
		modal.open('Obevestenje', 'Imate nesacuvane promene.');
	} else {
		window.location.pathname = 'mainMenu.html';
	}
}
function asideToggle(): void {
	aside.style.width = `${store.getState('asideWidth')}px`;
	if (store.getState('isAsideOut')) {
		aside.style.left = `0px`;
		asideTrigger.classList.add('active');
	} else {
		aside.style.left = `-${store.getState('asideWidth')}px`;
		asideTrigger.classList.remove('active');
	}
	main.style.width = `${getWidth()}px`;
	const config: Config = {
		isAsideOut: store.getState('isAsideOut'),
		contentWidth: store.getState('contentWidth'),
		asideWidth: store.getState('asideWidth')
	};
	settingsUpdateHandler(config);
}
function changeListIndex(num: number): void {
	let index: number = store.getState('currentIndex');
	const employees: Array<Employee> = store.getState('employeeArray');
	index += num;
	if (index > employees.length || index < 0) index -= num;
	store.setState('currentIndex', index);
	const employee: Employee = employees[index];
	if (employee) store.setState('currentEmployee', employee);
}
function changeInputIndex(): void {
	const tabs: Array<HTMLInputElement> = Array.prototype.slice.call(document.querySelectorAll<HTMLElement>('[name="tabs"]'));
	const input: HTMLInputElement = <HTMLInputElement>document.activeElement;
	let index: number = inputs.indexOf(input);
	if (index == 16) {
		tabs.forEach(t => t.checked == false);
		tabs[0].checked = true;
		index = 19;
	}
	if (index == 39) {
		tabs.forEach(t => t.checked == false);
		tabs[1].checked = true;
		index = 39;
	}
	if (index == 51) {
		tabs.forEach(t => t.checked == false);
		tabs[2].checked = true;
		index = 51;
	}
	if (index < inputs.length - 1) {
		inputs[index + 1].focus();
	}
}

function positionResizeBars(): void {
	main.style.width = `${getWidth()}px`;
	aside.style.width = `${store.getState('asideWidth')}px`;
	if (store.getState('isAsideOut')) {
		resize0.style.display = 'block';
		resize1.style.left = `${store.getState('asideWidth') + main.firstElementChild.clientWidth + 5}px`;
		resize0.style.left = `${store.getState('asideWidth')}px`;
	} else {
		resize0.style.display = 'none';
		resize1.style.left = `${main.firstElementChild.clientWidth + 5}px`;
	}
}

function handleResizeContent(): void {
	const width: number = main.offsetWidth;
	const c0: HTMLElement = <HTMLElement>main.children[0];
	const c1: HTMLElement = <HTMLElement>main.children[1];
	const mousePos: number = store.getState('contentWidth');
	const x: number = mousePos < width / 2 ? Math.round(width / mousePos) : Math.round(width / (width - mousePos));
	const col: number = mousePos < width / 2 ? Math.round(12 / x) : Math.round(12 / x);
	if (col < 13 && col > -1) {
		let col0: number = col;
		let col1: number = 12 - col;
		if (mousePos > width / 2) {
			col0 = 12 - col;
			col1 = col;
		}
		if (col == 12 || col == 0) {
			col0 = col1 = 12;
		}

		c0.classList.replace(c0.className.match(/col.+/gi)[0], `col-lg-${col0}`);
		c1.classList.replace(c1.className.match(/col.+/gi)[0], `col-lg-${col1}`);
	}
	//resize1.style.left = `${store.getState('asideWidth') + main.firstElementChild.offsetWidth + 5}px`;
}
function handleInput(prop: string, value: string, target: HTMLInputElement) {
	if (prop == 'umcn') {
		const employees: Array<Employee> = store.getState('employeeArray');
		employees.forEach(e => {
			if (e.properties.umcn == value && store.getState('currentEmployee').properties.umcn != value) {
				modal.open('Greska', `Vec postoji radnik sa tim JMBG. ${employeeSummaryTemplate(e)}`);
				value = value.substring(0, target.value.length - 1);
			}
		});
	}
	const employee: Employee = store.getState('currentEmployee');
	if (employee) {
		if (value == employee.properties[prop]) {
			delete employee.changes[prop];
			store.setState('currentEmployee', employee);
		} else {
			employee.changes[prop] = value;
			store.setState('currentEmployee', employee);
		}
	}
}
function addYoSPeriod(type: string, from: string, till: string): void {
	if (till != '' && type != '') {
		const employee: Employee = store.getState('currentEmployee');
		if (type == 'addExternalYoSPeriod') {
			if (employee) {
				employee.addExternalYoS(parseInt(from), parseInt(till));
				store.setState('currentEmployee', employee);
			} else {
				alert('Izaberite radnika');
			}
		} else if (type == 'addInternalYoSPeriod') {
			if (employee) {
				employee.addInternalYoS(parseInt(from), parseInt(till));
				store.setState('currentEmployee', employee);
			} else {
				alert('Izaberite radnika');
			}
		}
	} else {
		modal.open('Greska', 'Neispravan datum');
	}
}
function populateFields(): void {
	const employee: Employee = store.getState('currentEmployee');
	if (employee) employee.populate();
}
function colorEmployeeList(): void {
	const currentEmployee: Employee = store.getState('currentEmployee');
	const listItems: Array<HTMLElement> = Array.prototype.slice.call(document.querySelectorAll('#employeeList li'));
	const employees: Array<Employee> = store.getState('employeeList');
	employees.forEach(e => {
		const item: HTMLElement = document.querySelector(`[data-id="${e.properties._id}"]`);
		const badge: HTMLElement = <HTMLElement>item.firstElementChild;
		if (Object.keys(e.changes).length > 0) {
			if (item) item.classList.add('list-group-item-warning');
			if (badge) badge.innerHTML = Object.keys(e.changes).length.toString();
		} else {
			if (item) item.classList.remove('list-group-item-warning');
			if (badge) badge.innerHTML = '';
		}
	});
	listItems.forEach(item => {
		const index: number = Object.keys(item.attributes).indexOf('data-id');
		if (item.attributes[index])
			if (item.attributes[index].value == currentEmployee.properties._id) item.classList.add('list-group-item-dark');
			else item.classList.remove('list-group-item-dark');
	});
}
function populateEmployeeList(): void {
	let result: string = '';
	employeeList.innerHTML = '';
	const employees: Array<Employee> = store.getState('employeeList');
	employees.forEach(e => {
		result += optionTemplate(e);
	});
	employeeList.innerHTML = result;
}
function searchEmployeeArray(query: string | null): void {
	const employees: Array<Employee> = store.getState('employeeArray');
	const array: Array<Employee> = query
		? employees.filter(e => {
				return (
					parseInt(e.properties.id) == parseInt(query) ||
					e.properties.umcn.startsWith(query) ||
					e.properties.firstName.startsWith(query) ||
					e.properties.lastName.startsWith(query)
				);
		  })
		: employees;
	store.setState('employeeList', array);
}
function changeCurrentEmployee(btn: HTMLButtonElement, _id: string): void {
	const employees: Array<Employee> = store.getState('employeeArray');
	const employee: Employee = employees.find(e => {
		return e.properties._id == _id;
	});
	if (employee) store.setState('currentEmployee', employee);
}
function addNewEmployee(): void {
	if (!store.getState('newEmployee')) {
		const newEmployee: Employee = new Employee(null);
		const newEmployeeArray: Array<Employee> = store.getState('employeeArray');
		newEmployeeArray.push(newEmployee);
		store.setState('newEmployee', newEmployee);
		store.setState('employeeArray', newEmployeeArray);
		store.setState('currentEmployee', newEmployee);
	}
}
function employeeReject(): void {
	const employee: Employee = store.getState('currentEmployee');
	const keys: Array<string> = Object.keys(employee.changes);
	if (keys.length > 0) {
		modal.open('Obavestenje', 'Da li zelite da odbacite sve promene?', () => {
			if (keys.length > 0) {
				keys.forEach(k => {
					const index: number = Object.keys(employee.changes).indexOf(k);
					delete employee.changes[index];
				});
				store.setState('currentEmployee', employee);
			}
		});
	}
}
function employeeDelete(): void {
	modal.open('Upozorenje', 'Da li ste sigurni da zelite da obrisete ovaj unos?', () => {
		const employees: Array<Employee> = store.getState('employeeArray');
		const employee: Employee = store.getState('currentEmployee');
		const newEmployee: Employee = store.getState('newEmployee');
		const id: string = employee.properties._id;
		employees.splice(employees.indexOf(employee), 1);
		store.setState('employeeArray', employees);
		if (employees.length > 0) {
			store.setState('currentEmployee', employees[0]);
		}
		if (newEmployee) {
			if (newEmployee.properties._id == employee.properties._id) store.setState('newEmployee', null);
		} else {
			let save: Array<EmployeeProperties> = [];
			employees.forEach(e => {
				save.push(e.properties);
			});
			employeeDeleteHandler(save, id);
		}
	});
}
function employeeSave(array: Array<Employee>): void {
	let commit: Array<Employee> = [];
	let check: boolean = false;
	const employees: Array<Employee> = array ? array : store.getState('employeeArray');
	employees.forEach(e => {
		if (Object.keys(e.changes).length > 0) {
			check = true;
		}
	});
	if (check) {
		let text: string = '';
		employees.forEach(e => {
			if (Object.keys(e.changes).length > 0) {
				text += employeeSummaryTemplate(e);
				commit.push(e);
			}
		});
		modal.open('Da li zelite da sacuvate sve promene?', text, () => {
			let save: Array<EmployeeProperties> = [];
			commit.forEach(e => {
				e.commitChanges();
				save.push(e.properties);
			});
			store.setState('newEmployee', null);
			employeeSaveHandler(save);
		});
	} else {
		modal.open('Obavestenje', 'Nema izmena');
	}
}
function setEmployees(data: EmployeeProperties): void {
	const array: Array<Employee> = [];
	if (data instanceof Array) {
		data.forEach(e => {
			array.push(new Employee(e));
		});
		store.setState('currentEmployee', array[0]);
		store.setState('employeeArray', array);
		store.setState('employeeList', array);
	}
}
function setSettings(data: Config) {
	for (let key in data) {
		store.setState(key, data[key]);
	}
	setTimeout(() => {
		positionResizeBars();
	}, 100);
}
window.onload = () => {
	// setEmployees(ipcRenderer.sendSync('employee:get', null));
	employeeGetHandler();
	settingsGetHandler();
};
window.addEventListener('resize', event => {
	positionResizeBars();
});
document.addEventListener('keydown', event => {
	switch (event.key) {
		case 'Escape':
			if (store.getState('isModalUp')) modal.buttons.close.click();
			break;
		case 'Enter':
			if (store.getState('isModalUp')) modal.buttons.confirm.click();
			else {
				changeInputIndex();
			}
			break;
		case 'PageUp':
			changeListIndex(-1);
			break;
		case 'PageDown':
			changeListIndex(1);
			break;
		default:
		//console.log(event.key);
	}
});
document.addEventListener('mousemove', event => {
	if (store.getState('isResizingList')) {
		store.setState('asideWidth', event.screenX);
	}
	if (store.getState('isResizingContent')) {
		if (store.getState('isAsideOut')) {
			store.setState('contentWidth', event.screenX - store.getState('asideWidth'));
		} else {
			store.setState('contentWidth', event.screenX);
		}
	}
});
document.addEventListener('mouseup', event => {
	if (store.getState('isResizingList') || store.getState('isResizingContent')) {
		const config: Config = {
			isAsideOut: store.getState('isAsideOut'),
			contentWidth: store.getState('contentWidth'),
			asideWidth: store.getState('asideWidth')
		};
		settingsUpdateHandler(config);
	}
	store.setState('isResizingList', false);
	store.setState('isResizingContent', false);
	if (event.button == 0) {
		if (menu) {
			menu.close();
			menu = null;
		}
	}
});
document.addEventListener('contextmenu', event => {
	menu = new Menu(event);
});

function settingsGetHandler() {
	if (ENV == 'electron') {
		setSettings(ipcRenderer.sendSync('window:settings-get'));
	} else {
		axios
			.get(`${url}/config`)
			.then(response => {
				console.log(response.data);
				setSettings(response.data);
			})
			.catch(err => console.log(err));
	}
}
function settingsUpdateHandler(config: Config) {
	if (ENV == 'electron') {
		ipcRenderer.sendSync('window:settings-update', config);
	} else {
		axios
			.post(`${url}/config/update`, { config: config })
			.then(response => {
				console.log(response.data);
				return response.data;
			})
			.catch(err => console.log(err));
	}
}

function employeeGetHandler() {
	console.log(ENV == 'electron');
	if (ENV == 'electron') {
		setEmployees(ipcRenderer.sendSync('employee:get', null));
	} else {
		axios
			.get(`${url}/employees`)
			.then(response => {
				console.log(response.data);
				setEmployees(response.data);
			})
			.catch(err => console.log(err));
	}
}
function employeeDeleteHandler(save: Array<EmployeeProperties>, id: string) {
	if (ENV == 'electron') {
		setEmployees(ipcRenderer.sendSync('employee:delete', save));
	} else {
		axios
			.post(`${url}/employees/delete`, { id: id })
			.then(response => {
				console.log(response.data);
				setEmployees(response.data);
			})
			.catch(err => console.log(err));
	}
}
function employeeSaveHandler(save: Array<EmployeeProperties>) {
	if (ENV == 'electron') {
		setEmployees(ipcRenderer.sendSync('employee:save', save));
	} else {
		axios
			.post(`${url}/employees/save`, { save: save })
			.then(response => {
				console.log(response.data);
				setEmployees(response.data);
			})
			.catch(err => console.log(err));
	}
}
