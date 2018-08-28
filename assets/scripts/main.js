const { ipcRenderer } = require('electron');
const Employee = require('../scripts/Employee.js');
const Menu = require('../scripts/Menu');
const Modal = require('../scripts/Modal');
const Store = require('../scripts/Store');
const { employeeSummaryTemplate, optionTemplate } = require('../scripts/templates');
const main = document.querySelector('main');
const initialState = {
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
let menu = null;
const store = new Store(initialState);
store.subscribe('isAsideOut', [asideToggle, positionResizeBars]);
store.subscribe('currentEmployee', [populateFields, colorEmployeeList]);
store.subscribe('employeeArray', populateEmployeeList);
store.subscribe('employeeList', [populateEmployeeList, colorEmployeeList]);
store.subscribe('asideWidth', [handleResizeList, positionResizeBars]);
store.subscribe('contentWidth', [handleResizeContent, positionResizeBars]);
const resize0 = document.querySelector('#resize0');
resize0.addEventListener('mousedown', () => store.setState('isResizingList', !store.getState('isResizingList')));
const resize1 = document.querySelector('#resize1');
resize1.addEventListener('mousedown', () => store.setState('isResizingContent', !store.getState('isResizingContent')));
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const modal = new Modal();
const employeeList = document.querySelector('#employeeList');
const searchInp = document.querySelector('#searchInp');
searchInp.addEventListener('input', event => {
	searchEmployeeArray(event.target.value);
});
const aside = document.querySelector('aside');
const asideTrigger = document.querySelector('#asideTrigger');
asideTrigger.addEventListener('click', () => {
	store.setState('isAsideOut', !store.getState('isAsideOut'));
});
const saveBtn = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', () => {
	employeeSave();
});
const backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', handleBack);
const rejectBtn = document.querySelector('#rejectBtn');
rejectBtn.addEventListener('click', employeeReject);
const deleteBtn = document.querySelector('#deleteBtn');
deleteBtn.addEventListener('click', employeeDelete);
const fromDateInternal = document.querySelector('#fromDateInternal');
const tillDateInternal = document.querySelector('#tillDateInternal');
const addInternalYoSPeriod = document.querySelector('#addInternalYoSPeriod');
addInternalYoSPeriod.addEventListener('click', event => {
	addYoSPeriod(event.target.id, fromDateInternal.value, tillDateInternal.value);
});
const fromDateExternal = document.querySelector('#fromDateExternal');
const tillDateExternal = document.querySelector('#tillDateExternal');
const addExternalYoSPeriod = document.querySelector('#addExternalYoSPeriod');
addExternalYoSPeriod.addEventListener('click', event => {
	addYoSPeriod(event.target.id, fromDateExternal.value, tillDateExternal.value);
});
const addNewBtn = document.querySelector('#addNewBtn');
addNewBtn.addEventListener('click', addNewEmployee);
const inputs = [
	...document.querySelectorAll('header input'),
	...document.querySelectorAll('main input'),
	document.querySelector('main textarea')
];
inputs.forEach(i => {
	i.addEventListener('keyup', event => {
		if (
			event.target.id.indexOf('fromDateInternal') == -1 &&
			event.target.id.indexOf('tillDateInternal') == -1 &&
			event.target.id.indexOf('fromDateExternal') == -1 &&
			event.target.id.indexOf('tillDateExternal') == -1
		)
			handleInput(event.target.id, event.target.value, event.target);
	});
});
function getWidth() {
	return store.getState('isAsideOut') ? window.innerWidth - store.getState('asideWidth') : window.innerWidth;
}
function handleBack(event) {
	event.preventDefault();
	let commit = [];
	let check = false;
	const array = store.getState('employeeArray');
	array.forEach(e => {
		if (Object.keys(e.changes).length > 0) {
			check = true;
		}
	});
	if (check) {
		modal.open('Obevestenje', 'Imate nesacuvane promene.');
	} else {
		window.location = 'mainMenu.html';
	}
}
function asideToggle() {
	aside.style.width = `${store.getState('asideWidth')}px`;
	if (store.getState('isAsideOut')) {
		aside.style.left = `0px`;
		asideTrigger.classList.add('active');
	} else {
		aside.style.left = `-${store.getState('asideWidth')}px`;
		asideTrigger.classList.remove('active');
	}
	main.style.width = `${getWidth()}px`;
	ipcRenderer.send('window:settings-update', {
		isAsideOut: store.getState('isAsideOut'),
		contentWidth: store.getState('contentWidth'),
		asideWidth: store.getState('asideWidth')
	});
}
function changeListIndex(num) {
	let index = store.getState('currentIndex');
	const employees = store.getState('employeeArray');
	index += num;
	if (index > employees.length || index < 0) index -= num;
	store.setState('currentIndex', index);
	const employee = employees[index];
	if (employee) store.setState('currentEmployee', employee);
}
function changeInputIndex() {
	const tabs = document.querySelectorAll('[name="tabs"]');
	let index = inputs.indexOf(document.activeElement);
	if (index == 15) {
		tabs.forEach(t => t.checked == false);
		tabs[0].checked = true;
		index = 18;
	}
	if (index == 38) {
		tabs.forEach(t => t.checked == false);
		tabs[1].checked = true;
		index = 38;
	}
	if (index == 50) {
		tabs.forEach(t => t.checked == false);
		tabs[2].checked = true;
		index = 50;
	}
	if (index < inputs.length - 1) {
		inputs[index + 1].focus();
	}
}

function positionResizeBars() {
	if (store.getState('isAsideOut')) {
		resize0.style.display = 'block';
		resize1.style.left = `${store.getState('asideWidth') + main.firstElementChild.offsetWidth + 5}px`;
		resize0.style.left = `${store.getState('asideWidth')}px`;
	} else {
		resize0.style.display = 'none';
		resize1.style.left = `${main.firstElementChild.offsetWidth + 5}px`;
	}
}
function handleResizeList() {
	main.style.width = `${getWidth()}px`;
	aside.style.width = `${store.getState('asideWidth')}px`;
}
function handleResizeContent() {
	const width = main.offsetWidth;
	const c0 = main.children[0];
	const c1 = main.children[1];
	const mousePos = store.getState('contentWidth');
	const x = mousePos < width / 2 ? Math.round(width / mousePos) : Math.round(width / (width - mousePos));
	const col = mousePos < width / 2 ? Math.round(12 / x) : Math.round(12 / x);
	if (col < 13 && col > -1) {
		let col0 = col;
		let col1 = 12 - col;
		if (mousePos > width / 2) {
			col0 = 12 - col;
			col1 = col;
		}
		if (col == 12 || col == 0) {
			col0 = col1 = 12;
		}
		c0.classList.replace(c0.classList.value.match(/col.+/gi)[0], `col-lg-${col0}`);
		c1.classList.replace(c1.classList.value.match(/col.+/gi)[0], `col-lg-${col1}`);
	}
	//resize1.style.left = `${store.getState('asideWidth') + main.firstElementChild.offsetWidth + 5}px`;
}
function handleInput(prop, value, target) {
	if (prop == 'umcn') {
		store.getState('employeeArray').forEach(e => {
			if (e.properties.umcn == value && store.getState('currentEmployee').properties.umcn != value) {
				modal.open('Greska', `Vec postoji radnik sa tim JMBG. ${employeeSummaryTemplate(e)}`);
				value = value.substring(0, target.value.length - 1);
			}
		});
	}

	const employee = store.getState('currentEmployee');
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
function addYoSPeriod(type, from, till) {
	if (till != '' && type != '') {
		const employee = store.getState('currentEmployee');
		if (type == 'addExternalYoSPeriod') {
			if (employee) {
				employee.addExternalYoS(from, till);
				store.setState('currentEmployee', employee);
			} else {
				alert('Izaberite radnika');
			}
		} else if (type == 'addInternalYoSPeriod') {
			if (employee) {
				employee.addInternalYoS(from, till);
				store.setState('currentEmployee', employee);
			} else {
				alert('Izaberite radnika');
			}
		}
	} else {
		modal.open('Greska', 'Neispravan datum');
	}
}
function populateFields() {
	const employee = store.getState('currentEmployee');
	if (employee) employee.populate();
}
function colorEmployeeList() {
	const currentEmployee = store.getState('currentEmployee');
	const buttons = document.querySelectorAll('#employeeList li');
	store.getState('employeeArray').forEach(e => {
		const btn = document.querySelector(`[data-id="${e.properties._id}"]`);
		// const badge = document.querySelector(
		// 	`[data-id="${e.properties._id}"] .badge`
		// );
		const badge = btn.firstElementChild;
		if (Object.keys(e.changes).length > 0) {
			if (btn) btn.classList.add('list-group-item-warning');
			if (badge) badge.innerHTML = Object.keys(e.changes).length;
		} else {
			if (btn) btn.classList.remove('list-group-item-warning');
			if (badge) badge.innerHTML = '';
		}
	});
	buttons.forEach(b => {
		if (b.attributes['data-id'].value == currentEmployee.properties._id) b.classList.add('list-group-item-dark');
		else b.classList.remove('list-group-item-dark');
	});
}
function populateEmployeeList() {
	let result = '';
	employeeList.innerHTML = '';
	store.getState('employeeList').forEach(e => {
		result += optionTemplate(e);
	});
	employeeList.innerHTML = result;
}
function searchEmployeeArray(query) {
	const array = query
		? store.getState('employeeArray').filter(e => {
				return (
					parseInt(e.properties.id) == parseInt(query) ||
					e.properties.umcn.startsWith(query) ||
					e.properties.firstName.startsWith(query) ||
					e.properties.lastName.startsWith(query)
				);
		  })
		: store.getState('employeeArray');
	store.setState('employeeList', array);
}
function changeCurrentEmployee(btn, _id) {
	const employee = store.getState('employeeArray').find(e => {
		return e.properties._id == _id;
	});
	if (employee) store.setState('currentEmployee', employee);
}
function addNewEmployee() {
	if (!store.getState('newEmployee')) {
		const newEmployee = new Employee();
		const newEmployeeArray = store.getState('employeeArray');
		newEmployeeArray.push(newEmployee);
		store.setState('newEmployee', newEmployee);
		store.setState('employeeArray', newEmployeeArray);
		store.setState('currentEmployee', newEmployee);
	}
}
function employeeReject() {
	const employee = store.getState('currentEmployee');
	const keys = Object.keys(employee.changes);
	if (keys.length > 0) {
		modal.open('Obavestenje', 'Da li zelite da odbacite sve promene?', () => {
			if (keys.length > 0) {
				keys.forEach(k => {
					delete employee.changes[k];
				});
				store.setState('currentEmployee', employee);
			}
		});
	}
}
function employeeDelete() {
	modal.open('Upozorenje', 'Da li ste sigurni da zelite da obrisete ovaj unos?', () => {
		const employees = store.getState('employeeArray');
		const employee = store.getState('currentEmployee');
		const newEmployee = store.getState('newEmployee');
		employees.splice(employees.indexOf(employee), 1);
		store.setState('employeeArray', employees);
		if (employees.length > 0) {
			store.setState('currentEmployee', employees[0]);
		}
		if (newEmployee) {
			if (newEmployee.properties._id == employee.properties._id) store.setState('newEmployee', null);
		} else {
			let save = [];
			employees.forEach(e => {
				save.push(e.properties);
			});
			ipcRenderer.send('employee:delete', save);
		}
	});
}
function employeeSave(employees) {
	let commit = [];
	let check = false;
	const array = employees ? employees : store.getState('employeeArray');
	array.forEach(e => {
		if (Object.keys(e.changes).length > 0) {
			check = true;
		}
	});
	if (check) {
		let text = '';
		array.forEach(e => {
			if (Object.keys(e.changes).length > 0) {
				text += employeeSummaryTemplate(e);
				commit.push(e);
			}
		});
		modal.open('Da li zelite da sacuvate sve promene?', text, () => {
			let save = [];
			commit.forEach(e => {
				e.commitChanges();
				save.push(e.properties);
			});
			store.setState('newEmployee', null);
			ipcRenderer.send('employee:save', save);
		});
	} else {
		modal.open('Obavestenje', 'Nema izmena');
	}
}
ipcRenderer.on('employee:search', (event, data) => {
	const array = [];
	if (data instanceof Array) {
		data.forEach(e => {
			array.push(new Employee(e));
		});
	}
	store.setState('currentEmployee', array[0]);
	store.setState('employeeArray', array);
	searchEmployeeArray();
});
ipcRenderer.on('window:alert', (event, message) => {
	alert(message);
});
ipcRenderer.on('window:settings-set', (event, data) => {
	for (let key in data) {
		store.setState(key, data[key]);
	}
	setTimeout(() => {
		positionResizeBars();
	}, 100);
});
window.onload = () => {
	// store.setState('isAsideOut', true);
	// store.setState('contentWidth', store.getState('contentWidth'));
	ipcRenderer.send('employee:get', null);
	ipcRenderer.send('window:settings-get');
};
window.addEventListener('resize', event => {
	main.style.width = `${getWidth()}px`;
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
		ipcRenderer.send('window:settings-update', {
			isAsideOut: store.getState('isAsideOut'),
			contentWidth: store.getState('contentWidth'),
			asideWidth: store.getState('asideWidth')
		});
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
