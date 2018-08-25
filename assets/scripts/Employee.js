class Employee {
	constructor(newEmployee) {
		if (newEmployee) {
			this.properties = {
				id: newEmployee.id,
				jmbg: newEmployee.jmbg,
				firstName: newEmployee.firstName,
				lastName: newEmployee.lastName,
				middleName: newEmployee.middleName,
				typeReceiver: newEmployee.typeReceiver,
				typeEmployment: newEmployee.typeEmployment,
				typeEmployee: newEmployee.typeEmployee,
				employmentUnit: newEmployee.employmentUnit,
				employmentSection: newEmployee.employmentSection,
				employmentPosition: newEmployee.employmentPosition,
				rating: newEmployee.rating,
				group: newEmployee.group,
				realQualification: newEmployee.realQualification,
				verifiedQualification: newEmployee.verifiedQualification,
				points: newEmployee.points,
				average1: newEmployee.average1,
				average2: newEmployee.average2,
				average3: newEmployee.average3,
				allowanceMeal: newEmployee.allowanceMeal,
				allowanceInsurance: newEmployee.allowanceInsurance,
				transportAllowanceCategory1:
					newEmployee.transportAllowanceCategory1,
				transportAllowanceCategory2:
					newEmployee.transportAllowanceCategory2,
				transportAllowanceCategory3:
					newEmployee.transportAllowanceCategory3,
				hours: newEmployee.hours,
				amount: newEmployee.amount,
				coefficient1: newEmployee.coefficient1,
				percentage: newEmployee.percentage,
				coefficient2: newEmployee.coefficient2,
				reducedYoS: newEmployee.reducedYoS,
				muncipalityEmployment: newEmployee.muncipalityEmployment,
				muncipalityResidency: newEmployee.muncipalityResidency,
				muncipalityPayout1: newEmployee.muncipalityPayout1,
				muncipalityPayout2: newEmployee.muncipalityPayout2,
				accountPayout1: newEmployee.accountPayout1,
				accountPayout2: newEmployee.accountPayout2,
				employmentBooklet_SerialNumber:
					newEmployee.employmentBooklet_SerialNumber,
				employmentBooklet_RegistryNumber:
					newEmployee.employmentBooklet_RegistryNumber,
				employmentBooklet_DateOfIssue:
					newEmployee.employmentBooklet_DateOfIssue,
				employmentBooklet_Muncipality:
					newEmployee.employmentBooklet_Muncipality,
				employmentBooklet_EmploymentCode:
					newEmployee.employmentBooklet_EmploymentCode,
				externalYoS_periods: newEmployee.externalYoS_periods || [],
				externalYoS_total: newEmployee.externalYoS_total || 0,
				internalYoS_periods: newEmployee.internalYoS_periods || [],
				internalYoS_total: newEmployee.internalYoS_total || 0,
				totalYoS: newEmployee.totalYoS || 0,
				address: newEmployee.address,
				zip: newEmployee.zip,
				muncipality: newEmployee.muncipality,
				sex: newEmployee.sex,
				dateOfBirth: newEmployee.dateOfBirth,
				ID_serialNumber: newEmployee.ID_serialNumber,
				ID_registryNumber: newEmployee.ID_registryNumber,
				ID_dateOfIssue: newEmployee.ID_dateOfIssue,
				ID_muncipalityOfIssue: newEmployee.ID_muncipalityOfIssue,
				HI_serialNumber: newEmployee.HI_serialNumber,
				HI_registryNumber: newEmployee.HI_registryNumber,
				HI_dateOfIssue: newEmployee.HI_dateOfIssue,
				HI_muncipalityOfIssue: newEmployee.HI_muncipalityOfIssue,
				familyMembers: newEmployee.familyMembers,
				numberOfKids: newEmployee.numberOfKids,
				email: newEmployee.email,
				comment: newEmployee.comment
			};
		} else {
			this.properties = {
				id: '',
				jmbg: '',
				firstName: '',
				lastName: '',
				middleName: '',
				typeReceiver: '',
				typeEmployment: '',
				typeEmployee: '',
				employmentUnit: '',
				employmentSection: '',
				employmentPosition: '',
				rating: '',
				group: '',
				realQualification: '',
				verifiedQualification: '',
				points: '',
				average1: '',
				average2: '',
				average3: '',
				allowanceMeal: '',
				allowanceInsurance: '',
				transportAllowanceCategory1: '',
				transportAllowanceCategory2: '',
				transportAllowanceCategory3: '',
				hours: '',
				amount: '',
				coefficient1: '',
				percentage: '',
				coefficient2: '',
				reducedYoS: '',
				muncipalityEmployment: '',
				muncipalityResidency: '',
				muncipalityPayout1: '',
				muncipalityPayout2: '',
				accountPayout1: '',
				accountPayout2: '',
				employmentBooklet_SerialNumber: '',
				employmentBooklet_RegistryNumber: '',
				employmentBooklet_DateOfIssue: '',
				employmentBooklet_Muncipality: '',
				employmentBooklet_EmploymentCode: '',
				externalYoS_periods: [],
				externalYoS_total: 0,
				internalYoS_periods: [],
				internalYoS_total: 0,
				totalYoS: 0,
				address: '',
				zip: '',
				muncipality: '',
				sex: '',
				dateOfBirth: '',
				ID_serialNumber: '',
				ID_registryNumber: '',
				ID_dateOfIssue: '',
				ID_muncipalityOfIssue: '',
				HI_serialNumber: '',
				HI_registryNumber: '',
				HI_dateOfIssue: '',
				HI_muncipalityOfIssue: '',
				familyMembers: '',
				numberOfKids: '',
				email: '',
				comment: ''
			};
		}
		this.changes = {};
	}
	commitChanges() {
		for (let key in this.changes) {
			this.properties[key] = this.changes[key];
		}
		this.changes = {};
		return this;
	}
	populate() {
		for (let key in this.properties) {
			const element = document.querySelector(`#${key}`);
			if (element) element.value = this.properties[key];
		}
		this.populateDate();
		return this;
	}
	populateChanges() {
		for (let key in this.changes) {
			const element = document.querySelector(`#${key}`);
			if (element) element.value = this.changes[key];
		}
		return this;
	}
	populateDate() {
		this.properties.totalYoS = 0;
		containerInternal.innerHTML = '';
		containerExternal.innerHTML = '';
		if (this.changes.internalYoS_periods) {
			this.changes.internalYoS_total = 0;
			this.changes.internalYoS_periods.forEach(p => {
				console.log(p);

				this.changes.internalYoS_total += p.till - p.from;
				containerInternal.innerHTML += dateListTemplate(p.from, p.till);
			});
		} else {
			this.properties.internalYoS_total = 0;
			this.properties.internalYoS_periods.forEach(p => {
				this.properties.internalYoS_total += p.till - p.from;
				containerInternal.innerHTML += dateListTemplate(p.from, p.till);
			});
		}
		if (this.changes.externalYoS_periods) {
			this.changes.externalYoS_total = 0;
			this.changes.externalYoS_periods.forEach(p => {
				console.log(p);

				this.changes.externalYoS_total += p.till - p.from;
				containerExternal.innerHTML += dateListTemplate(p.from, p.till);
			});
		} else {
			this.properties.externalYoS_total = 0;
			this.properties.externalYoS_periods.forEach(p => {
				this.properties.externalYoS_total += p.till - p.from;
				containerExternal.innerHTML += dateListTemplate(p.from, p.till);
			});
		}
		if (this.changes.internalYoS_total || this.changes.externalYoS_total) {
			this.changes.totalYoS = this.changes.externalYoS_total
				? this.changes.externalYoS_total
				: this.properties.externalYoS_total +
				  this.changes.internalYoS_total
					? this.changes.internalYoS_total
					: this.properties.internalYoS_total;
		} else {
			this.properties.totalYoS =
				this.properties.externalYoS_total +
				this.properties.internalYoS_total;
		}

		const internal = new Date(
			this.changes.internalYoS_total
				? this.changes.internalYoS_total
				: this.properties.internalYoS_total
		);
		internalYoS_total.value = dateTemplate(internal);
		const external = new Date(
			this.changes.externalYoS_total
				? this.changes.externalYoS_total
				: this.properties.externalYoS_total
		);
		externalYoS_total.value = dateTemplate(external);
		const total = new Date(
			this.changes.totalYoS
				? this.changes.totalYoS
				: this.properties.totalYoS
		);
		totalYoS.value = dateTemplate(total);
	}
	addInternalYoS(from, till) {
		this.changes.internalYoS_periods = new Array(
			...this.properties.internalYoS_periods
		);
		this.changes.internalYoS_periods.push({
			from: new Date(from).valueOf(),
			till: new Date(till).valueOf()
		});
		this.populateDate();
		return this;
	}
	addExternalYoS(from, till) {
		this.changes.externalYoS_periods = new Array(
			...this.properties.externalYoS_periods
		);
		this.changes.externalYoS_periods.push({
			from: new Date(from).valueOf(),
			till: new Date(till).valueOf()
		});
		this.populateDate();
		return this;
	}
}
// 	id,
// 	jmbg,
// 	firstName,
// 	lastName,
// 	middleName,
// 	typeReceiver,
// 	typeEmployment,
// 	typeEmployee,
// 	employmentUnit,
// 	employmentSection,
// 	employmentPosition,
// 	rating,
// 	group,
// 	realQualification,
// 	verifiedQualification,
// 	points,
// 	average1,
// 	average2,
// 	average3,
// 	allowanceMeal,
// 	allowanceInsurance,
// 	transportAllowanceCategory1,
// 	transportAllowanceCategory2,
// 	transportAllowanceCategory3,
// 	hours,
// 	amount,
// 	coefficient1,
// 	percentage,
// 	coefficient2,
// 	reducedYoS,
// 	muncipalityEmployment,
// 	muncipalityResidency,
// 	muncipalityPayout1,
// 	muncipalityPayout2,
// 	accountPayout1,
// 	accountPayout2,
// 	employmentBooklet_SerialNumber,
// 	employmentBooklet_RegistryNumber,
// 	employmentBooklet_DateOfIssue,
// 	employmentBooklet_Muncipality,
// 	employmentBooklet_EmploymentCode,
// 	externalYoS_periods,
// 	externalYoS_total,
// 	internalYoS_periods,
// 	internalYoS_total,
// 	totalYoS,
// 	address,
// 	zip,
// 	muncipality,
// 	sex,
// 	dateOfBirth,
// 	ID_serialNumber,
// 	ID_registryNumber,
// 	ID_dateOfIssue,
// 	ID_muncipalityOfIssue,
// 	HI_serialNumber,
// 	HI_registryNumber,
// 	HI_dateOfIssue,
// 	HI_muncipalityOfIssue,
// 	familyMembers,
// 	numberOfKids,
// 	email,
// 	comment