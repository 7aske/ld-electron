"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = require("shortid");
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
        this.properties = { _id: shortid_1.default.generate() };
        if (newEmployee) {
            for (var key in newEmployee) {
                this.properties[key] = newEmployee[key];
            }
        }
        else {
            for (var _i = 0, employeeKeys_1 = employeeKeys; _i < employeeKeys_1.length; _i++) {
                var key = employeeKeys_1[_i];
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
        return this;
    };
    Employee.prototype.populate = function () {
        for (var key in this.properties) {
            var input = void 0;
            var div = void 0;
            if (key == "internalYoS_total" || key == "externalYoS_total" || key == "totalYoS")
                continue;
            if (document.querySelector("#" + key)) {
                if (document.querySelector("#" + key).nodeName == "DIV")
                    div = document.querySelector("#" + key);
                else
                    input = document.querySelector("#" + key);
                if (div) {
                    div.innerHTML = this.properties[key].toString();
                    div.classList.remove("bg-warning");
                }
                else {
                    input.value = this.properties[key].toString();
                    input.classList.remove("bg-warning");
                }
            }
        }
        for (var key in this.changes) {
            var element = document.querySelector("#" + key);
            if (element) {
                if (key != "totalYoS")
                    element.value = this.changes[key];
                element.classList.add("bg-warning");
            }
        }
        // this.populateDate();
        return this;
    };
    Employee.prototype.populateDate = function () {
        var containerInternal = document.querySelector("#containerInternal");
        var containerExternal = document.querySelector("#containerExternal");
        var internalYoS_total = document.querySelector("#internalYoS_total");
        var externalYoS_total = document.querySelector("#externalYoS_total");
        var totalYoS = document.querySelector("#totalYoS");
        if (!this.changes.internalYoS_periods) {
            containerInternal.innerHTML = "";
            this.properties.internalYoS_periods.split(" ").forEach(function (p) {
                var from = parseInt(p.split("-")[0], 10);
                var till = parseInt(p.split("-")[1], 10);
                containerInternal.innerHTML += templates_1.dateListTemplate(from, till);
            });
        }
        if (!this.changes.externalYoS_periods) {
            containerExternal.innerHTML = "";
            this.properties.externalYoS_periods.split(" ").forEach(function (p) {
                var from = parseInt(p.split("-")[0], 10);
                var till = parseInt(p.split("-")[1], 10);
                containerExternal.innerHTML += templates_1.dateListTemplate(from, till);
            });
        }
        var internal = new Date(this.properties.internalYoS_total);
        internalYoS_total.innerHTML = templates_1.dateTemplate(internal);
        var external = new Date(this.properties.externalYoS_total);
        externalYoS_total.innerHTML = templates_1.dateTemplate(external);
        var total = new Date(this.properties.totalYoS);
        totalYoS.innerHTML = templates_1.dateTemplate(total);
        return this;
    };
    Employee.prototype.addInternalYoS = function (from, till) {
        if (this.properties.internalYoS_periods.length == 0) {
            this.properties.internalYoS_periods += from + "-" + till;
            this.changes.externalYoS_periods += from + "-" + till;
        }
        else {
            this.properties.internalYoS_periods += " " + from + "-" + till;
            this.changes.externalYoS_periods += " " + from + "-" + till;
        }
        this.changes.internalYoS_total += till - from;
        this.properties.internalYoS_total += till - from;
        this.changes.totalYoS += till - from;
        this.properties.totalYoS += till - from;
        this.populateDate();
        return this;
    };
    Employee.prototype.addExternalYoS = function (from, till) {
        if (this.properties.externalYoS_periods.length == 0) {
            this.properties.externalYoS_periods += from + "-" + till;
            this.changes.externalYoS_periods += from + "-" + till;
        }
        else {
            this.properties.externalYoS_periods += " " + from + "-" + till;
            this.changes.externalYoS_periods += " " + from + "-" + till;
        }
        this.changes.externalYoS_total += till - from;
        this.properties.externalYoS_total += till - from;
        this.changes.totalYoS += till - from;
        this.properties.totalYoS += till - from;
        this.populateDate();
        return this;
    };
    return Employee;
}());
exports.Employee = Employee;
