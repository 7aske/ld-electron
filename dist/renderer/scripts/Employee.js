"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shortid = require("shortid");
const templates_1 = require("./templates");
class Employee {
    constructor(newEmployee) {
        if (newEmployee) {
            this.properties = {
                _id: newEmployee._id || shortid.generate(),
                id: newEmployee.id,
                umcn: newEmployee.umcn,
                passport: newEmployee.passport,
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
                transportAllowanceCategory1: newEmployee.transportAllowanceCategory1,
                transportAllowanceCategory2: newEmployee.transportAllowanceCategory2,
                transportAllowanceCategory3: newEmployee.transportAllowanceCategory3,
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
                employmentBooklet_SerialNumber: newEmployee.employmentBooklet_SerialNumber,
                employmentBooklet_RegistryNumber: newEmployee.employmentBooklet_RegistryNumber,
                employmentBooklet_DateOfIssue: newEmployee.employmentBooklet_DateOfIssue,
                employmentBooklet_Muncipality: newEmployee.employmentBooklet_Muncipality,
                employmentBooklet_EmploymentCode: newEmployee.employmentBooklet_EmploymentCode,
                externalYoS_periods: newEmployee.externalYoS_periods || [],
                externalYoS_total: newEmployee.externalYoS_total || 0,
                internalYoS_periods: newEmployee.internalYoS_periods || [],
                internalYoS_total: newEmployee.internalYoS_total || 0,
                totalYoS: newEmployee.totalYoS || 0,
                address: newEmployee.address,
                zip: newEmployee.zip,
                muncipality: newEmployee.muncipality,
                sex: this.formatSexFromUMCN(newEmployee.umcn),
                dateOfBirth: this.formatDoBfromUMCN(newEmployee.umcn),
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
        }
        else {
            this.properties = {
                _id: shortid.generate(),
                id: '',
                umcn: '',
                passport: '',
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
        this.properties.dateOfBirth;
        this.changes = {};
    }
    formatSexFromUMCN(umcn) {
        const number = parseInt(`${umcn[9]}${umcn[10]}${umcn[11]}`);
        if (number < 500)
            return 'Muskarac';
        else
            return 'Zena';
    }
    formatDoBfromUMCN(umcn) {
        if (umcn[4] == '0') {
            return `${umcn[0]}${umcn[1]}-${umcn[2]}${umcn[3]}-2${umcn[4]}${umcn[5]}${umcn[6]}`;
        }
        else {
            return `${umcn[0]}${umcn[1]}-${umcn[2]}${umcn[3]}-1${umcn[4]}${umcn[5]}${umcn[6]}`;
        }
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
            let input;
            let div;
            if (document.querySelector(`#${key}`)) {
                if (document.querySelector(`#${key}`).nodeName == 'DIV')
                    div = document.querySelector(`#${key}`);
                else
                    input = document.querySelector(`#${key}`);
                if (div) {
                    div.innerHTML = this.properties[key].toString();
                    div.classList.remove('bg-warning');
                }
                else {
                    input.value = this.properties[key].toString();
                    input.classList.remove('bg-warning');
                }
            }
        }
        for (let key in this.changes) {
            const element = document.querySelector(`#${key}`);
            if (element) {
                element.value = this.changes[key];
                element.classList.add('bg-warning');
            }
        }
        this.populateDate();
        return this;
    }
    populateDate() {
        const containerInternal = document.querySelector('#containerInternal');
        const containerExternal = document.querySelector('#containerExternal');
        const internalYoS_total = document.querySelector('#internalYoS_total');
        const externalYoS_total = document.querySelector('#externalYoS_total');
        const totalYoS = document.querySelector('#totalYoS');
        this.properties.totalYoS = 0;
        if (!this.changes.internalYoS_periods) {
            containerInternal.innerHTML = '';
            this.properties.internalYoS_total = 0;
            this.properties.internalYoS_periods.forEach(p => {
                this.properties.internalYoS_total += p.till - p.from;
                containerInternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
            });
        }
        if (!this.changes.externalYoS_periods) {
            containerExternal.innerHTML = '';
            this.properties.externalYoS_total = 0;
            this.properties.externalYoS_periods.forEach(p => {
                this.properties.externalYoS_total += p.till - p.from;
                containerExternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
            });
        }
        if (!this.changes.internalYoS_total && !this.changes.externalYoS_total) {
            this.properties.totalYoS = this.properties.externalYoS_total + this.properties.internalYoS_total;
        }
        const internal = new Date(this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
        internalYoS_total.innerHTML = templates_1.dateTemplate(internal);
        const external = new Date(this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total);
        externalYoS_total.innerHTML = templates_1.dateTemplate(external);
        const total = new Date(this.changes.totalYoS ? this.changes.totalYoS : this.properties.totalYoS);
        totalYoS.innerHTML = templates_1.dateTemplate(total);
        return this;
    }
    addInternalYoS(from, till) {
        const containerInternal = document.querySelector('#containerInternal');
        containerInternal.innerHTML = '';
        this.changes.internalYoS_periods = new Array(...this.properties.internalYoS_periods);
        this.changes.internalYoS_periods.push({
            from: new Date(from).valueOf(),
            till: new Date(till).valueOf()
        });
        this.changes.internalYoS_total = 0;
        this.changes.internalYoS_periods.forEach(p => {
            this.changes.internalYoS_total += p.till - p.from;
            containerInternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
        });
        this.changes.totalYoS =
            (this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total) +
                (this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
        this.populateDate();
        return this;
    }
    addExternalYoS(from, till) {
        const containerExternal = document.querySelector('#containerExternal');
        containerExternal.innerHTML = '';
        this.changes.externalYoS_periods = new Array(...this.properties.externalYoS_periods);
        this.changes.externalYoS_periods.push({
            from: new Date(from).valueOf(),
            till: new Date(till).valueOf()
        });
        this.changes.externalYoS_total = 0;
        this.changes.externalYoS_periods.forEach(p => {
            this.changes.externalYoS_total += p.till - p.from;
            containerExternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
        });
        this.changes.totalYoS =
            (this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total) +
                (this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
        this.populateDate();
        return this;
    }
}
exports.Employee = Employee;
