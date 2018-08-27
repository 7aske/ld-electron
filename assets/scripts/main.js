const { ipcRenderer } = require('electron');
const initialState = {
	employeeArray: [],
	employeeList: [],
	currentEmployee: null,
	isAsideOut: false,
	isModalUp: false,
	newEmployee: null,
	currentIndex: 0
};
const store = new Store(initialState);
store.subscribe('isAsideOut', asideToggle);
store.subscribe('currentEmployee', [populateFields, colorEmployeeList]);
store.subscribe('employeeArray', populateEmployeeList);
store.subscribe('employeeList', [populateEmployeeList, colorEmployeeList]);
const main = document.querySelector('main');
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
function currentW() {
	return store.getState('isAsideOut') ? window.innerWidth - 400 : window.innerWidth;
}
function asideToggle() {
	if (store.getState('isAsideOut')) {
		asideTrigger.style.backgroundColor = 'rgb(17,122,139)';
		aside.style.transform = 'translateX(400px)';
		main.style.width = `${currentW()}px`;
		header.style.width = `${currentW()}px`;
		footer.style.width = `${currentW()}px`;
	} else {
		asideTrigger.style.backgroundColor = '#18a2b8';
		aside.style.transform = 'translateX(-400px)';
		main.style.width = `${currentW()}px`;
		header.style.width = `${currentW()}px`;
		footer.style.width = `${currentW()}px`;
	}
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
	console.log(index);
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
		}
		let save = [];
		employees.forEach(e => {
			save.push(e.properties);
		});
		ipcRenderer.send('employee:delete', save);
	});
}
function employeeSave() {
	let commit = [];
	let check = false;
	const array = store.getState('employeeArray');
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
window.onload = () => {
	store.setState('isAsideOut', true);
	ipcRenderer.send('employee:get', null);
};
window.addEventListener('resize', event => {
	main.style.width = `${currentW()}px`;
	header.style.width = `${currentW()}px`;
	footer.style.width = `${currentW()}px`;
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
