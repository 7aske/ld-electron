"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = __importDefault(require("shortid"));
var templates_1 = require("../utils/templates");
var employeeKeys = ["healthInsuranceDateOfIssue",
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
var Employee = /** @class */ (function () {
    function Employee(newEmployee) {
        var e_1, _a;
        this.properties = { _id: shortid_1.default.generate() };
        if (newEmployee) {
            for (var key in newEmployee) {
                this.properties[key] = newEmployee[key];
            }
        }
        else {
            try {
                for (var employeeKeys_1 = __values(employeeKeys), employeeKeys_1_1 = employeeKeys_1.next(); !employeeKeys_1_1.done; employeeKeys_1_1 = employeeKeys_1.next()) {
                    var key = employeeKeys_1_1.value;
                    if (key == "_id")
                        continue;
                    else if (key == "externalYoS_total")
                        this.properties.externalYoS_total = 0;
                    else if (key == "internalYoS_total")
                        this.properties.internalYoS_total = 0;
                    else if (key == "totalYoS")
                        this.properties.totalYoS = 0;
                    else
                        this.properties[key] = "";
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (employeeKeys_1_1 && !employeeKeys_1_1.done && (_a = employeeKeys_1.return)) _a.call(employeeKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        this.changes = {};
    }
    Employee.formatSexFromUMCN = function (umcn) {
        var num = parseInt("" + umcn[9] + umcn[10] + umcn[11], 10);
        if (num < 500)
            return "Muskarac";
        else
            return "Zena";
    };
    Employee.formatDoBfromUMCN = function (umcn) {
        if (umcn[4] == "0") {
            return "" + umcn[0] + umcn[1] + "-" + umcn[2] + umcn[3] + "-2" + umcn[4] + umcn[5] + umcn[6];
        }
        else {
            return "" + umcn[0] + umcn[1] + "-" + umcn[2] + umcn[3] + "-1" + umcn[4] + umcn[5] + umcn[6];
        }
    };
    Employee.prototype.commitChanges = function () {
        this.properties.sex = Employee.formatSexFromUMCN(this.properties.umcn);
        this.properties.dateOfBirth = Employee.formatDoBfromUMCN(this.properties.umcn);
        for (var key in this.changes) {
            this.properties[key] = this.changes[key];
        }
        this.changes = {};
        // this.populate();
        return this;
    };
    Employee.prototype.populate = function () {
        for (var key in this.properties) {
            var element = document.querySelector("#" + key);
            if (element) {
                element.classList.remove("bg-warning");
                if (key == "internalYoS_total" || key == "externalYoS_total" || key == "totalYoS")
                    continue;
                if (element.nodeName == "DIV") {
                    element.innerHTML = this.properties[key].toString();
                }
                else {
                    element.value = this.properties[key].toString();
                }
            }
        }
        for (var key in this.changes) {
            var element = document.querySelector("#" + key);
            if (element) {
                element.classList.add("bg-warning");
                if (key == "internalYoS_total" || key == "externalYoS_total" || key == "totalYoS")
                    continue;
                element.value = this.changes[key];
            }
        }
        this.populateDate();
        return this;
    };
    Employee.prototype.populateDate = function () {
        var containerInternal = document.querySelector("#containerInternal");
        var containerExternal = document.querySelector("#containerExternal");
        var internalYoS_total = document.querySelector("#internalYoS_total");
        var externalYoS_total = document.querySelector("#externalYoS_total");
        var totalYoS = document.querySelector("#totalYoS");
        if (typeof this.changes.internalYoS_periods != "undefined") {
            if (this.changes.internalYoS_periods != "") {
                containerInternal.innerHTML = "";
                this.changes.internalYoS_periods.split(" ").forEach(function (p) {
                    var from = parseInt(p.split("-")[0], 10);
                    var till = parseInt(p.split("-")[1], 10);
                    containerInternal.innerHTML += templates_1.dateListTemplate(from, till);
                });
            }
        }
        else {
            if (this.properties.internalYoS_periods != "") {
                containerInternal.innerHTML = "";
                this.properties.internalYoS_periods.split(" ").forEach(function (p) {
                    var from = parseInt(p.split("-")[0], 10);
                    var till = parseInt(p.split("-")[1], 10);
                    containerInternal.innerHTML += templates_1.dateListTemplate(from, till);
                });
            }
        }
        if (typeof this.changes.externalYoS_periods != "undefined") {
            if (this.changes.externalYoS_periods != "") {
                containerExternal.innerHTML = "";
                this.changes.externalYoS_periods.split(" ").forEach(function (p) {
                    var from = parseInt(p.split("-")[0], 10);
                    var till = parseInt(p.split("-")[1], 10);
                    containerExternal.innerHTML += templates_1.dateListTemplate(from, till);
                });
            }
        }
        else {
            if (this.properties.externalYoS_periods != "") {
                containerExternal.innerHTML = "";
                this.properties.externalYoS_periods.split(" ").forEach(function (p) {
                    var from = parseInt(p.split("-")[0], 10);
                    var till = parseInt(p.split("-")[1], 10);
                    containerExternal.innerHTML += templates_1.dateListTemplate(from, till);
                });
            }
        }
        var internal = new Date(this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
        internalYoS_total.innerHTML = templates_1.dateTemplate(internal);
        var external = new Date(this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total);
        externalYoS_total.innerHTML = templates_1.dateTemplate(external);
        var total = new Date(this.changes.totalYoS ? this.changes.totalYoS : this.properties.totalYoS);
        totalYoS.innerHTML = templates_1.dateTemplate(total);
        return this;
    };
    Employee.prototype.addInternalYoS = function (from, till) {
        if (typeof this.changes.internalYoS_periods == "undefined") {
            this.changes.internalYoS_periods = this.properties.internalYoS_periods;
        }
        this.changes.internalYoS_periods += " " + from + "-" + till;
        if (typeof this.changes.internalYoS_total == "undefined") {
            this.changes.internalYoS_total = this.properties.internalYoS_total;
        }
        this.changes.internalYoS_total += till - from;
        if (typeof this.changes.totalYoS == "undefined") {
            this.changes.totalYoS = this.properties.totalYoS;
        }
        this.changes.totalYoS += till - from;
        return this;
    };
    Employee.prototype.addExternalYoS = function (from, till) {
        if (typeof this.changes.externalYoS_periods == "undefined") {
            this.changes.externalYoS_periods = this.properties.externalYoS_periods;
        }
        this.changes.externalYoS_periods += " " + from + "-" + till;
        if (typeof this.changes.externalYoS_total == "undefined") {
            this.changes.externalYoS_total = this.properties.externalYoS_total;
        }
        this.changes.externalYoS_total += till - from;
        if (typeof this.changes.totalYoS == "undefined") {
            this.changes.totalYoS = this.properties.totalYoS;
        }
        this.changes.totalYoS += till - from;
        return this;
    };
    return Employee;
}());
exports.Employee = Employee;
