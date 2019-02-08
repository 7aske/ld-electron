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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
        this.properties = {};
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
                        this.properties._id = shortid_1.default.generate();
                    else if (key == "externalYoS_periods")
                        this.properties.externalYoS_periods = [];
                    else if (key == "externalYoS_total")
                        this.properties.externalYoS_total = 0;
                    else if (key == "internalYoS_periods")
                        this.properties.internalYoS_periods = [];
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
        console.log(this.properties);
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
                element.value = this.changes[key];
                element.classList.add("bg-warning");
            }
        }
        // this.populateDate();
        return this;
    };
    Employee.prototype.populateDate = function () {
        var _this = this;
        var containerInternal = document.querySelector("#containerInternal");
        var containerExternal = document.querySelector("#containerExternal");
        var internalYoS_total = document.querySelector("#internalYoS_total");
        var externalYoS_total = document.querySelector("#externalYoS_total");
        var totalYoS = document.querySelector("#totalYoS");
        this.properties.totalYoS = 0;
        if (!this.changes.internalYoS_periods) {
            containerInternal.innerHTML = "";
            this.properties.internalYoS_total = 0;
            this.properties.internalYoS_periods.forEach(function (p) {
                _this.properties.internalYoS_total += p.till - p.from;
                containerInternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
            });
        }
        if (!this.changes.externalYoS_periods) {
            containerExternal.innerHTML = "";
            this.properties.externalYoS_total = 0;
            this.properties.externalYoS_periods.forEach(function (p) {
                _this.properties.externalYoS_total += p.till - p.from;
                containerExternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
            });
        }
        if (!this.changes.internalYoS_total && !this.changes.externalYoS_total) {
            this.properties.totalYoS = this.properties.externalYoS_total + this.properties.internalYoS_total;
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
        var _this = this;
        var containerInternal = document.querySelector("#containerInternal");
        containerInternal.innerHTML = "";
        this.changes.internalYoS_periods = new (Array.bind.apply(Array, __spread([void 0], this.properties.internalYoS_periods)))();
        this.changes.internalYoS_periods.push({
            from: from,
            till: till
        });
        console.log(this.changes.internalYoS_periods);
        this.changes.internalYoS_total = 0;
        this.changes.internalYoS_periods.forEach(function (p) {
            _this.changes.internalYoS_total += p.till - p.from;
            containerInternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
        });
        this.changes.totalYoS =
            (this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total) + (this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
        // this.populateDate();
        return this;
    };
    Employee.prototype.addExternalYoS = function (from, till) {
        var _this = this;
        var containerExternal = document.querySelector("#containerExternal");
        containerExternal.innerHTML = "";
        this.changes.externalYoS_periods = new (Array.bind.apply(Array, __spread([void 0], this.properties.externalYoS_periods)))();
        this.changes.externalYoS_periods.push({
            from: from,
            till: till
        });
        this.changes.externalYoS_total = 0;
        this.changes.externalYoS_periods.forEach(function (p) {
            _this.changes.externalYoS_total += p.till - p.from;
            containerExternal.innerHTML += templates_1.dateListTemplate(p.from, p.till);
        });
        this.changes.totalYoS =
            (this.changes.externalYoS_total ? this.changes.externalYoS_total : this.properties.externalYoS_total) + (this.changes.internalYoS_total ? this.changes.internalYoS_total : this.properties.internalYoS_total);
        // try {
        // 	this.populateDate();
        // } catch (err) {
        // 	console.error(err);
        // }
        return this;
    };
    return Employee;
}());
exports.Employee = Employee;
