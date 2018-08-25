const { ipcRenderer } = require('electron');
const state = {
	employeeArray: [],
	currentEmployee: null,
	isAsideOut: false
};
const main = document.querySelector('main');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const employeeList = document.querySelector('#employeeList');
const searchInp = document.querySelector('#searchInp');
searchInp.addEventListener('input', event => {
	searchEmployeeArray(event.target.value);
});
const aside = document.querySelector('aside');
const asideTrigger = document.querySelector('#asideTrigger');
asideTrigger.addEventListener('click', asideToggle);
const saveBtn = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', () => {
	employeeSave(state.currentEmployee);
});
const fromDateInternal = document.querySelector('#fromDateInternal');
const tillDateInternal = document.querySelector('#tillDateInternal');
const addInternal = document.querySelector('#addInternal');
addInternal.addEventListener('click', () => {
	addPeriod('internal');
});
const fromDateExternal = document.querySelector('#fromDateExternal');
const tillDateExternal = document.querySelector('#tillDateExternal');
const addExternal = document.querySelector('#addExternal');
addExternal.addEventListener('click', () => {
	addPeriod('external');
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
			handleChange(event.target.id, event.target.value);
	});
});

const currentW = () => {
	if (state.isAsideOut) return window.innerWidth - 400;
	else return window.innerWidth;
};
function asideToggle() {
	if (!state.isAsideOut) {
		state.isAsideOut = !state.isAsideOut;
		asideTrigger.style.backgroundColor = 'rgb(17,122,139)';
		aside.style.transform = 'translateX(400px)';
		main.style.width = `${currentW()}px`;
		header.style.width = `${currentW()}px`;
		footer.style.width = `${currentW()}px`;
	} else {
		state.isAsideOut = !state.isAsideOut;
		asideTrigger.style.backgroundColor = '#18a2b8';
		aside.style.transform = 'translateX(-400px)';
		main.style.width = `${currentW()}px`;
		header.style.width = `${currentW()}px`;
		footer.style.width = `${currentW()}px`;
	}
}
function handleChange(prop, value) {
	if (state.currentEmployee) {
		const option = document.querySelector(
			`[value="${state.currentEmployee.properties.id}"]`
		);
		if (value == state.currentEmployee.properties[prop]) {
			delete state.currentEmployee.changes[prop];
		} else {
			state.currentEmployee.changes[prop] = value;
		}
		colorEmployeeList();
	}
}
function addPeriod(type) {
	if (type == 'external') {
		if (fromDateExternal.value != '' && tillDateExternal.value != '') {
			if (state.currentEmployee) {
				state.currentEmployee.addExternalYoS(
					fromDateExternal.value,
					tillDateExternal.value
				);
			} else {
				alert('Izaberite radnika');
			}
		} else {
			alert('Invalid date');
		}
	} else if (type == 'internal') {
		if (fromDateInternal.value != '' && tillDateInternal.value != '') {
			if (state.currentEmployee) {
				state.currentEmployee.addInternalYoS(
					fromDateInternal.value,
					tillDateInternal.value
				);
			} else {
				alert('Izaberite radnika');
			}
		} else {
			alert('Invalid date');
		}
	}
	colorEmployeeList();
}
function colorEmployeeList() {
	state.employeeArray.forEach(e => {
		const option = document.querySelector(`[value="${e.properties.id}"]`);
		if (Object.keys(e.changes).length > 0) {
			if (option) option.style.color = 'red';
		} else {
			if (option) option.style.color = 'black';
		}
	});
}
function populateEmployeeList(array) {
	let result = '';
	employeeList.innerHTML = '';
	if (array) {
		array.forEach(e => {
			result += optionTemplate(e);
		});
	} else {
		state.employeeArray.forEach(e => {
			result += optionTemplate(e);
		});
	}

	employeeList.innerHTML = result;
	colorEmployeeList();
}
function changeCurrentEmployee(id) {
	const employee = state.employeeArray.find(e => {
		return e.properties.id == id;
	});
	if (employee) {
		state.currentEmployee = employee;
		if (Object.keys(state.currentEmployee.changes).length > 0) {
			state.currentEmployee.populate().populateChanges();
		} else {
			state.currentEmployee.populate();
		}
	}
}
function searchEmployeeArray(query) {
	if (query != '') {
		const result = state.employeeArray.filter(e => {
			return (
				parseInt(e.properties.id) == parseInt(query) ||
				e.properties.jmbg.startsWith(query) ||
				e.properties.firstName.startsWith(query) ||
				e.properties.lastName.startsWith(query)
			);
		});
		populateEmployeeList(result);
		const option = document.querySelector(
			`[value="${state.currentEmployee.properties.id}"]`
		);
		if (option) option.selected = true;
	} else {
		populateEmployeeList();
		const option = document.querySelector(
			`[value="${state.currentEmployee.properties.id}"]`
		);
		if (option) option.selected = true;
	}
}
function addNewEmployee() {
	const newEmployee = new Employee();
	state.employeeArray.push(newEmployee);
	state.currentEmployee = newEmployee;
	state.currentEmployee.populate();
	populateEmployeeList();
}
function employeeSave() {
	let commit = [];
	state.employeeArray.forEach(e => {
		if (Object.keys(e.changes).length > 0) {
			e.commitChanges();
			commit.push(e.properties);
		}
	});
	ipcRenderer.send('employee:save', commit);
}
ipcRenderer.on('employee:search', (event, data) => {
	state.employeeArray = [];
	if (data instanceof Array) {
		data.forEach(e => {
			state.employeeArray.push(new Employee(e));
		});
	}
	state.currentEmployee = state.employeeArray[0];
	state.currentEmployee.populate();
	populateEmployeeList(state.employeeArray);
	const option = document.querySelector(
		`[value="${state.currentEmployee.properties.id}"]`
	);
	option.selected = true;
});
ipcRenderer.on('window:alert', (event, data) => {
	alert(data);
});
window.onload = () => {
	asideToggle();
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
// const employee = e
// 			? e
// 			: {
// 					id: id.value,
// 					jmbg: jmbg.value,
// 					firstName: firstName.value,
// 					lastName: lastName.value,
// 					middleName: middleName.value,
// 					typeReceiver: typeReceiver.value,
// 					typeEmployment: typeEmployment.value,
// 					typeEmployee: typeEmployee.value,
// 					employmentUnit: employmentUnit.value,
// 					employmentSection: employmentSection.value,
// 					employmentPosition: employmentPosition.value,
// 					rating: rating.value,
// 					group: group.value,
// 					realQualification: realQualification.value,
// 					verifiedQualification: verifiedQualification.value,
// 					points: points.value,
// 					average1: average1.value,
// 					average2: average2.value,
// 					average3: average3.value,
// 					allowanceMeal: allowanceMeal.value,
// 					allowanceInsurance: allowanceInsurance.value,
// 					transportAllowanceCategory1:
// 						transportAllowanceCategory1.value,
// 					transportAllowanceCategory2:
// 						transportAllowanceCategory2.value,
// 					transportAllowanceCategory3:
// 						transportAllowanceCategory3.value,
// 					hours: hours.value,
// 					amount: amount.value,
// 					coefficient1: coefficient1.value,
// 					percentage: percentage.value,
// 					coefficient2: coefficient2.value,
// 					reducedYoS: reducedYoS.value,
// 					muncipalityEmployment: muncipalityEmployment.value,
// 					muncipalityResidency: muncipalityResidency.value,
// 					muncipalityPayout1: muncipalityPayout1.value,
// 					muncipalityPayout2: muncipalityPayout2.value,
// 					accountPayout1: accountPayout1.value,
// 					accountPayout2: accountPayout2.value,
// 					employmentBooklet_SerialNumber:
// 						employmentBooklet_SerialNumber.value,
// 					employmentBooklet_RegistryNumber:
// 						employmentBooklet_RegistryNumber.value,
// 					employmentBooklet_DateOfIssue:
// 						employmentBooklet_DateOfIssue.value,
// 					employmentBooklet_Muncipality:
// 						employmentBooklet_Muncipality.value,
// 					employmentBooklet_EmploymentCode:
// 						employmentBooklet_EmploymentCode.value,
// 					externalYoS_periods: [],
// 					externalYoS_total: 0,
// 					internalYoS_periods: [],
// 					internalYoS_total: 0,
// 					totalYoS: 0,
// 					address: address.value,
// 					zip: zip.value,
// 					muncipality: muncipality.value,
// 					sex: sex.value,
// 					dateOfBirth: dateOfBirth.value,
// 					ID_serialNumber: ID_serialNumber.value,
// 					ID_registryNumber: ID_registryNumber.value,
// 					ID_dateOfIssue: ID_dateOfIssue.value,
// 					ID_muncipalityOfIssue: ID_muncipalityOfIssue.value,
// 					HI_serialNumber: HI_serialNumber.value,
// 					HI_registryNumber: HI_registryNumber.value,
// 					HI_dateOfIssue: HI_dateOfIssue.value,
// 					HI_registryNumber: HI_registryNumber.value,
// 					familyMembers: familyMembers.value,
// 					numberOfKids: numberOfKids.value,
// 					email: email.value,
// 					comment: comment.value
// 			  };
