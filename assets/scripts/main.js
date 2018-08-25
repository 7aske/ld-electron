const { ipcRenderer } = require('electron');
let employeeArray = [];
let currentEmployee = null;
const main = document.querySelector('main');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const employeeList = document.querySelector('#employeeList');
const searchInp = document.querySelector('#searchInp');
searchInp.addEventListener('input', event => {
	const query = event.target.value;
	if (query != '') {
		const result = employeeArray.filter(e => {
			return (
				parseInt(e.properties.id) == parseInt(query) ||
				e.properties.jmbg.startsWith(query) ||
				e.properties.firstName.startsWith(query) ||
				e.properties.lastName.startsWith(query)
			);
		});
		populateEmployeeList(result);
	} else {
		populateEmployeeList(employeeArray);
	}
});
const aside = document.querySelector('aside');
let isAsideOut = false;
const asideTrigger = document.querySelector('#asideTrigger');
asideTrigger.addEventListener('click', asideToggle);
const currentW = () => {
	if (isAsideOut) return window.innerWidth - 400;
	else return window.innerWidth;
};
function asideToggle() {
	if (!isAsideOut) {
		isAsideOut = !isAsideOut;
		aside.style.transform = 'translateX(400px)';
		main.style.width = `${currentW()}px`;
		header.style.width = `${currentW()}px`;
		footer.style.width = `${currentW()}px`;
	} else {
		isAsideOut = !isAsideOut;
		aside.style.transform = 'translateX(-400px)';
		main.style.width = `${currentW()}px`;
		header.style.width = `${currentW()}px`;
		footer.style.width = `${currentW()}px`;
	}
}
const saveBtn = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', () => {
	employeeSave(currentEmployee);
});

const fromDateInternal = document.querySelector('#fromDateInternal');
const tillDateInternal = document.querySelector('#tillDateInternal');
const addInternal = document.querySelector('#addInternal');
addInternal.addEventListener('click', () => {
	if (fromDateInternal.value != '' && tillDateInternal.value != '') {
		if (currentEmployee) {
			currentEmployee.addInternalYoS(
				fromDateInternal.value,
				tillDateInternal.value
			);
		} else {
			alert('Izaberite radnika');
		}
	} else {
		alert('Invalid date');
	}
});

const fromDateExternal = document.querySelector('#fromDateExternal');
const tillDateExternal = document.querySelector('#tillDateExternal');
const addExternal = document.querySelector('#addExternal');
addExternal.addEventListener('click', () => {
	if (fromDateExternal.value != '' && tillDateExternal.value != '') {
		if (currentEmployee) {
			currentEmployee.addExternalYoS(
				fromDateExternal.value,
				tillDateExternal.value
			);
		} else {
			alert('Izaberite radnika');
		}
	} else {
		alert('Invalid date');
	}
});

function populateEmployeeList(newEmployeeArray) {
	let result = '';
	employeeList.innerHTML = '';
	newEmployeeArray.forEach(e => {
		result += `<option onclick="displayEmployee(event)" value="${
			e.properties.id
		}">${e.properties.id} - ${e.properties.jmbg} - ${
			e.properties.lastName
		} ${e.properties.firstName}</option>`;
	});
	employeeList.innerHTML = result;
}
function displayEmployee(event) {
	const id = event.target.value;
	const employee = employeeArray.find(e => {
		return e.properties.id == id;
	});
	if (employee) {
		currentEmployee = employee;
		currentEmployee.populate();
	}
}
function employeeSave(e) {
	if (e) {
		for (let key in e.properties) {
			const element = document.querySelector(`#${key}`);
			if (element && key.indexOf('YoS') == -1) {
				console.log(element.value);
				e.properties[key] = element.value;
			}
		}
		ipcRenderer.send('employee:save', e.properties);
	} else {
		const employee = e
			? e
			: {
					id: id.value,
					jmbg: jmbg.value,
					firstName: firstName.value,
					lastName: lastName.value,
					middleName: middleName.value,
					typeReceiver: typeReceiver.value,
					typeEmployment: typeEmployment.value,
					typeEmployee: typeEmployee.value,
					employmentUnit: employmentUnit.value,
					employmentSection: employmentSection.value,
					employmentPosition: employmentPosition.value,
					rating: rating.value,
					group: group.value,
					realQualification: realQualification.value,
					verifiedQualification: verifiedQualification.value,
					points: points.value,
					average1: average1.value,
					average2: average2.value,
					average3: average3.value,
					allowanceMeal: allowanceMeal.value,
					allowanceInsurance: allowanceInsurance.value,
					transportAllowanceCategory1:
						transportAllowanceCategory1.value,
					transportAllowanceCategory2:
						transportAllowanceCategory2.value,
					transportAllowanceCategory3:
						transportAllowanceCategory3.value,
					hours: hours.value,
					amount: amount.value,
					coefficient1: coefficient1.value,
					percentage: percentage.value,
					coefficient2: coefficient2.value,
					reducedYoS: reducedYoS.value,
					muncipalityEmployment: muncipalityEmployment.value,
					muncipalityResidency: muncipalityResidency.value,
					muncipalityPayout1: muncipalityPayout1.value,
					muncipalityPayout2: muncipalityPayout2.value,
					accountPayout1: accountPayout1.value,
					accountPayout2: accountPayout2.value,
					employmentBooklet_SerialNumber:
						employmentBooklet_SerialNumber.value,
					employmentBooklet_RegistryNumber:
						employmentBooklet_RegistryNumber.value,
					employmentBooklet_DateOfIssue:
						employmentBooklet_DateOfIssue.value,
					employmentBooklet_Muncipality:
						employmentBooklet_Muncipality.value,
					employmentBooklet_EmploymentCode:
						employmentBooklet_EmploymentCode.value,
					externalYoS_periods: [],
					externalYoS_total: 0,
					internalYoS_periods: [],
					internalYoS_total: 0,
					totalYoS: 0,
					address: address.value,
					zip: zip.value,
					muncipality: muncipality.value,
					sex: sex.value,
					dateOfBirth: dateOfBirth.value,
					ID_serialNumber: ID_serialNumber.value,
					ID_registryNumber: ID_registryNumber.value,
					ID_dateOfIssue: ID_dateOfIssue.value,
					ID_muncipalityOfIssue: ID_muncipalityOfIssue.value,
					HI_serialNumber: HI_serialNumber.value,
					HI_registryNumber: HI_registryNumber.value,
					HI_dateOfIssue: HI_dateOfIssue.value,
					HI_registryNumber: HI_registryNumber.value,
					familyMembers: familyMembers.value,
					numberOfKids: numberOfKids.value,
					email: email.value,
					comment: comment.value
			  };
		ipcRenderer.send('employee:save', new Employee(employee).properties);
	}
}
ipcRenderer.on('employee:search', (event, data) => {
	employeeArray = [];
	if (data instanceof Array) {
		data.forEach(e => {
			employeeArray.push(new Employee(e));
		});
	}
	currentEmployee = employeeArray[0];
	employeeArray[0].populate();
	populateEmployeeList(employeeArray);
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
