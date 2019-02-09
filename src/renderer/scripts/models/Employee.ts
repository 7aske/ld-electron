import shortid from "shortid";
import { EmployeeChanges, EmployeeProperties } from "../../../@types";
import { dateListTemplate, dateTemplate } from "../utils/templates";

const employeeKeys = ["healthInsuranceDateOfIssue",
	"healthInsuranceMunicipalityOfIssue",
	"healthInsuranceRegistryNumber",
	"healthInsuranceSerialNumber",
	"idDateOfIssue",
	"idMunicipalityOfIssue",
	"idRegistryNumber",
	"idSerialNumber",
	"_id",
	"accountPayout1",
	"accountPayout2",
	"address",
	"allowanceInsurance",
	"allowanceMeal",
	"amount",
	"average1",
	"average2",
	"average3",
	"coefficient1",
	"coefficient2",
	"comment",
	"dateOfBirth",
	"email",
	"employmentBooklet_DateOfIssue",
	"employmentBooklet_EmploymentCode",
	"employmentBooklet_Municipality",
	"employmentBooklet_RegistryNumber",
	"employmentBooklet_SerialNumber",
	"employmentPosition",
	"employmentSection",
	"employmentUnit",
	"externalYoS_periods",
	"externalYoS_total",
	"familyMembers",
	"firstName",
	"group",
	"hours",
	"id",
	"internalYoS_periods",
	"internalYoS_total",
	"lastName",
	"middleName",
	"municipality",
	"municipalityEmployment",
	"municipalityPayout1",
	"municipalityPayout2",
	"municipalityResidency",
	"numberOfKids",
	"passport",
	"percentage",
	"points",
	"rating",
	"realQualification",
	"reducedYoS",
	"sex",
	"totalYoS",
	"transportAllowanceCategory1",
	"transportAllowanceCategory2",
	"transportAllowanceCategory3",
	"typeEmployee",
	"typeEmployment",
	"typeReceiver",
	"umcn",
	"verifiedQualification",
	"zip"];

export class Employee {
	public properties: EmployeeProperties;
	public changes: EmployeeChanges;

	constructor(newEmployee: EmployeeProperties) {
		this.properties = {_id: shortid.generate()};
		if (newEmployee) {
			for (const key in newEmployee) {
				this.properties[key] = newEmployee[key];
			}
		} else {
			for (const key of employeeKeys) {
				if (key == "_id") continue;
				else if (key == "externalYoS_total") this.properties.externalYoS_total = 0;
				else if (key == "internalYoS_total") this.properties.internalYoS_total = 0;
				else if (key == "totalYoS") this.properties.totalYoS = 0;
				else this.properties[key] = "";
			}
		}
		this.changes = {};
	}

	public static formatSexFromUMCN(umcn: string): string {
		const num = parseInt(`${umcn[9]}${umcn[10]}${umcn[11]}`, 10);
		if (num < 500) return "Muskarac";
		else return "Zena";
	}

	public static formatDoBfromUMCN(umcn: string): string {
		if (umcn[4] == "0") {
			return `${umcn[0]}${umcn[1]}-${umcn[2]}${umcn[3]}-2${umcn[4]}${umcn[5]}${umcn[6]}`;
		} else {
			return `${umcn[0]}${umcn[1]}-${umcn[2]}${umcn[3]}-1${umcn[4]}${umcn[5]}${umcn[6]}`;
		}
	}

	public commitChanges() {
		this.properties.sex = Employee.formatSexFromUMCN(this.properties.umcn);
		this.properties.dateOfBirth = Employee.formatDoBfromUMCN(this.properties.umcn);
		for (const key in this.changes) {
			this.properties[key] = this.changes[key];
		}
		this.changes = {};
		// this.populate();
		return this;
	}

	public populate() {
		for (const key in this.properties) {
			const element = document.querySelector(`#${key}`) as HTMLInputElement;
			if (element) {
				element.classList.remove("bg-warning");
				if (key == "internalYoS_total" || key == "externalYoS_total" || key == "totalYoS")
					continue;
				if (element.nodeName == "DIV") {
					element.innerHTML = this.properties[key].toString();
				} else {
					element.value = this.properties[key].toString();
				}
			}
		}
		for (const key in this.changes) {
			const element: HTMLInputElement = document.querySelector(`#${key}`);
			if (element) {
				element.classList.add("bg-warning");
				if (key == "internalYoS_total" || key == "externalYoS_total" || key == "totalYoS")
					continue;
				element.value = this.changes[key];
			}
		}
		this.populateDate();
		return this;
	}

	public populateDate() {
		const containerInternal = document.querySelector("#containerInternal") as HTMLElement;
		const containerExternal = document.querySelector("#containerExternal") as HTMLElement;
		const internalYoS_total = document.querySelector("#internalYoS_total") as HTMLElement;
		const externalYoS_total = document.querySelector("#externalYoS_total") as HTMLElement;
		const totalYoS: HTMLElement = document.querySelector("#totalYoS");
		if (typeof this.changes.internalYoS_periods != "undefined") {
			if (this.changes.internalYoS_periods != "") {
				containerInternal.innerHTML = "";
				this.changes.internalYoS_periods.split(" ").forEach(p => {
					const from = parseInt(p.split("-")[0], 10);
					const till = parseInt(p.split("-")[1], 10);
					containerInternal.innerHTML += dateListTemplate(from, till);
				});
			}
		} else {
			if (this.properties.internalYoS_periods != "") {
				containerInternal.innerHTML = "";
				this.properties.internalYoS_periods.split(" ").forEach(p => {
					const from = parseInt(p.split("-")[0], 10);
					const till = parseInt(p.split("-")[1], 10);
					containerInternal.innerHTML += dateListTemplate(from, till);
				});
			}
		}
		if (typeof this.changes.externalYoS_periods != "undefined") {
			if (this.changes.externalYoS_periods != "") {
				containerExternal.innerHTML = "";
				this.changes.externalYoS_periods.split(" ").forEach(p => {
					const from = parseInt(p.split("-")[0], 10);
					const till = parseInt(p.split("-")[1], 10);
					containerExternal.innerHTML += dateListTemplate(from, till);
				});
			}
		} else {
			if (this.properties.externalYoS_periods != "") {
				containerExternal.innerHTML = "";
				this.properties.externalYoS_periods.split(" ").forEach(p => {
					const from = parseInt(p.split("-")[0], 10);
					const till = parseInt(p.split("-")[1], 10);
					containerExternal.innerHTML += dateListTemplate(from, till);
				});
			}
		}
		const internal = new Date(this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
		internalYoS_total.innerHTML = dateTemplate(internal);
		const external = new Date(this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total);
		externalYoS_total.innerHTML = dateTemplate(external);
		const total = new Date(this.changes.totalYoS ? this.changes.totalYoS : this.properties.totalYoS);
		totalYoS.innerHTML = dateTemplate(total);
		return this;
	}

	public addInternalYoS(from: number, till: number) {
		if (typeof this.changes.internalYoS_periods == "undefined") {
			this.changes.internalYoS_periods = this.properties.internalYoS_periods;
		}
		this.changes.internalYoS_periods += ` ${from}-${till}`;

		if (typeof this.changes.internalYoS_total == "undefined") {
			this.changes.internalYoS_total = this.properties.internalYoS_total;
		}
		this.changes.internalYoS_total += till - from;
		if (typeof this.changes.totalYoS == "undefined") {
			this.changes.totalYoS = this.properties.totalYoS;
		}
		this.changes.totalYoS += till - from;
		return this;
	}

	public addExternalYoS(from: number, till: number) {
		if (typeof this.changes.externalYoS_periods == "undefined") {
			this.changes.externalYoS_periods = this.properties.externalYoS_periods;
		}
		this.changes.externalYoS_periods += ` ${from}-${till}`;
		if (typeof this.changes.externalYoS_total == "undefined") {
			this.changes.externalYoS_total = this.properties.externalYoS_total;
		}
		this.changes.externalYoS_total += till - from;
		if (typeof this.changes.totalYoS == "undefined") {
			this.changes.totalYoS = this.properties.totalYoS;
		}
		this.changes.totalYoS += till - from;
		return this;
	}
}
