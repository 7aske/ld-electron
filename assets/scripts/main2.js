const { ipcRenderer } = require('electron');
console.log(checkUMCN('2405995730054'));

const state = {
	employeeArray: [],
	employeeList: [],
	currentEmployee: null,
	isAsideOut: false
};
const store = new Store(state);
store.subscribe('isAsideOut', asideToggle);
store.subscribe('currentEmployee', [populateFields, colorEmployeeList]);
store.subscribe('employeeArray', populateEmployeeList);
store.subscribe('employeeList', [populateEmployeeList, colorEmployeeList]);
const main = document.querySelector('main');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
class Modal {
	constructor() {
		this.backdrop = document.querySelector('#backdrop');
		this.title = document.querySelector('#modal .card-title');
		this.body = document.querySelector('#modal .card-body');
		this.buttons = {
			confirm: document.querySelector('#modalConfirm'),
			close: document.querySelector('#modalClose')
		};
		this.buttons.close.addEventListener('click', () => {
			this.close();
		});
		this.buttons.confirm.addEventListener('click', () => {
			this.close();
		});
	}
	open(title, body, cb) {
		this.backdrop.style.display = 'block';
		if (cb) {
			this.buttons.confirm.addEventListener('click', cb);
			this.buttons.confirm.style.display = 'inline-block';
		}
		this.title.innerHTML = title;
		this.body.innerHTML = body;
	}
	close() {
		this.backdrop.style.display = 'none';
		this.buttons.confirm.style.display = 'none';
		this.title.innerHTML = '';
		this.body.innerHTML = '';
	}
}
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
rejectBtn.addEventListener('click', event => {
	const employee = store.getState('currentEmployee');
	const keys = Object.keys(employee.changes);
	if (keys.length > 0) {
		keys.forEach(k => {
			delete employee.changes[k];
		});
		store.setState('currentEmployee', employee);
	}
});
const deleteBtn = document.querySelector('#deleteBtn');
deleteBtn.addEventListener('click', employeeDelete);
const fromDateInternal = document.querySelector('#fromDateInternal');
const tillDateInternal = document.querySelector('#tillDateInternal');
const addInternalYoSPeriod = document.querySelector('#addInternalYoSPeriod');
addInternalYoSPeriod.addEventListener('click', event => {
	addYoSPeriod(
		event.target.id,
		fromDateInternal.value,
		tillDateInternal.value
	);
});
const fromDateExternal = document.querySelector('#fromDateExternal');
const tillDateExternal = document.querySelector('#tillDateExternal');
const addExternalYoSPeriod = document.querySelector('#addExternalYoSPeriod');
addExternalYoSPeriod.addEventListener('click', event => {
	addYoSPeriod(
		event.target.id,
		fromDateExternal.value,
		tillDateExternal.value
	);
});
const addNewBtn = document.querySelector('#addNewBtn');
addNewBtn.addEventListener('click', addNewEmployee);
const inputs = [
	...document.querySelectorAll('header input'),
	...document.querySelectorAll('main input')
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
	return store.getState('isAsideOut')
		? window.innerWidth - 400
		: window.innerWidth;
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

function handleInput(prop, value, target) {
	if (prop == 'jmbg') {
		store.getState('employeeArray').forEach(e => {
			if (
				e.properties.jmbg == value &&
				store.getState('currentEmployee').properties.jmbg != value
			)
				modal.open(
					'Greska',
					`Vec postoji radnik sa tim JMBG. ${employeeSummaryTemplate(
						e
					)}`
				);
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
		const btn = document.querySelector(`[value="${e.properties._id}"]`);
		const badge = document.querySelector(
			`[value="${e.properties._id}"] .badge`
		);

		if (Object.keys(e.changes).length > 0) {
			if (btn) btn.classList.add('list-group-item-warning');
			if (badge) badge.innerHTML = Object.keys(e.changes).length;
		} else {
			if (btn) btn.classList.remove('list-group-item-warning');
			if (badge) badge.innerHTML = '';
		}
	});
	buttons.forEach(b => {
		if (b.attributes['data-id'].value == currentEmployee.properties._id)
			b.classList.add('list-group-item-dark');
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
					e.properties.jmbg.startsWith(query) ||
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
	const newEmployee = new Employee();
	const newEmployeeArray = store.getState('employeeArray');
	newEmployeeArray.push(newEmployee);
	store.setState('employeeArray', newEmployeeArray);
	store.setState('currentEmployee', newEmployee);
}
function employeeDelete() {
	modal.open(
		'Upozorenje',
		'Da li ste sigurni da zelite da obrisete ovaj unos?',
		() => {
			const employees = store.getState('employeeArray');
			const employee = store.getState('currentEmployee');
			employees.splice(employees.indexOf(employee), 1);
			store.setState('employeeArray', employees);
			if (employees.length > 0) {
				store.setState('currentEmployee', employees[0]);
			}
			let save = [];
			employees.forEach(e => {
				save.push(e.properties);
			});
			ipcRenderer.send('employee:delete', save);
		}
	);
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
// document.addEventListener('keydown', () => {
// 	console.log(
// 		state.currentEmployee.properties,
// 		state.changedEmployee.properties
// 	);
// });
