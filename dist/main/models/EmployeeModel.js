"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:only-arrow-functions */
var sequelize_1 = __importDefault(require("sequelize"));
var app_1 = require("../app");
exports.execute = function (method, e) { return __awaiter(_this, void 0, void 0, function () {
    var employee, _a, err_1, err_2, err_3, res, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (method != "remove" && e) {
                    employee = {
                        _id: e._id,
                        id: e.id,
                        umcn: e.umcn,
                        passport: e.passport,
                        firstName: e.firstName,
                        lastName: e.lastName,
                        middleName: e.middleName,
                        typeReceiver: e.typeReceiver,
                        typeEmployment: e.typeEmployment,
                        typeEmployee: e.typeEmployee,
                        employmentUnit: e.employmentUnit,
                        employmentSection: e.employmentSection,
                        employmentPosition: e.employmentPosition,
                        rating: e.rating,
                        group: e.group,
                        realQualification: e.realQualification,
                        verifiedQualification: e.verifiedQualification,
                        points: e.points,
                        average1: e.average1,
                        average2: e.average2,
                        average3: e.average3,
                        allowanceMeal: e.allowanceMeal,
                        allowanceInsurance: e.allowanceInsurance,
                        transportAllowanceCategory1: e.transportAllowanceCategory1,
                        transportAllowanceCategory2: e.transportAllowanceCategory2,
                        transportAllowanceCategory3: e.transportAllowanceCategory3,
                        hours: e.hours,
                        amount: e.amount,
                        coefficient1: e.coefficient1,
                        percentage: e.percentage,
                        coefficient2: e.coefficient2,
                        reducedYoS: e.reducedYoS,
                        municipalityEmployment: e.municipalityEmployment,
                        municipalityResidency: e.municipalityResidency,
                        municipalityPayout1: e.municipalityPayout1,
                        municipalityPayout2: e.municipalityPayout2,
                        accountPayout1: e.accountPayout1,
                        accountPayout2: e.accountPayout2,
                        employmentBooklet_SerialNumber: e.employmentBooklet_SerialNumber,
                        employmentBooklet_RegistryNumber: e.employmentBooklet_RegistryNumber,
                        employmentBooklet_DateOfIssue: e.employmentBooklet_DateOfIssue,
                        employmentBooklet_Municipality: e.employmentBooklet_Municipality,
                        employmentBooklet_EmploymentCode: e.employmentBooklet_EmploymentCode,
                        // externalYoS_periods: YoSPeriod[],
                        externalYoS_total: e.externalYoS_total,
                        // internalYoS_periods: YoSPeriod[],
                        internalYoS_total: e.internalYoS_total,
                        totalYoS: e.totalYoS,
                        address: e.address,
                        zip: e.zip,
                        municipality: e.municipality,
                        sex: e.sex,
                        dateOfBirth: e.dateOfBirth,
                        idSerialNumber: e.idSerialNumber,
                        idRegistryNumber: e.idRegistryNumber,
                        idDateOfIssue: e.idDateOfIssue,
                        idMunicipalityOfIssue: e.idMunicipalityOfIssue,
                        healthInsuranceSerialNumber: e.healthInsuranceSerialNumber,
                        healthInsuranceRegistryNumber: e.healthInsuranceRegistryNumber,
                        healthInsuranceDateOfIssue: e.healthInsuranceDateOfIssue,
                        healthInsuranceMunicipalityOfIssue: e.healthInsuranceMunicipalityOfIssue,
                        familyMembers: e.familyMembers,
                        numberOfKids: e.numberOfKids,
                        email: e.email,
                        comment: e.comment
                    };
                }
                _a = method;
                switch (_a) {
                    case "update": return [3 /*break*/, 1];
                    case "insert": return [3 /*break*/, 4];
                    case "get-all": return [3 /*break*/, 7];
                    case "remove": return [3 /*break*/, 10];
                }
                return [3 /*break*/, 14];
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.EmployeeModel.update(employee)];
            case 2: return [2 /*return*/, _b.sent()];
            case 3:
                err_1 = _b.sent();
                throw new Error(err_1.message);
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, exports.EmployeeModel.insertOrUpdate(employee)];
            case 5: return [2 /*return*/, _b.sent()];
            case 6:
                err_2 = _b.sent();
                throw new Error(err_2.message);
            case 7:
                _b.trys.push([7, 9, , 10]);
                return [4 /*yield*/, exports.EmployeeModel.findAll()];
            case 8: return [2 /*return*/, _b.sent()];
            case 9:
                err_3 = _b.sent();
                throw new Error(err_3.message);
            case 10:
                _b.trys.push([10, 13, , 14]);
                return [4 /*yield*/, exports.EmployeeModel.findOne({ where: { _id: e._id } })];
            case 11:
                res = _b.sent();
                return [4 /*yield*/, res.destroy()];
            case 12:
                _b.sent();
                return [2 /*return*/, res];
            case 13:
                err_4 = _b.sent();
                throw new Error(err_4.message);
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.EmployeeModel = app_1.sequelize.define("Employee", {
    _id: { type: sequelize_1.default.STRING, primaryKey: true },
    id: sequelize_1.default.STRING,
    umcn: sequelize_1.default.STRING,
    passport: sequelize_1.default.STRING,
    firstName: sequelize_1.default.STRING,
    lastName: sequelize_1.default.STRING,
    middleName: sequelize_1.default.STRING,
    typeReceiver: sequelize_1.default.STRING,
    typeEmployment: sequelize_1.default.STRING,
    typeEmployee: sequelize_1.default.STRING,
    employmentUnit: sequelize_1.default.STRING,
    employmentSection: sequelize_1.default.STRING,
    employmentPosition: sequelize_1.default.STRING,
    rating: sequelize_1.default.STRING,
    group: sequelize_1.default.STRING,
    realQualification: sequelize_1.default.STRING,
    verifiedQualification: sequelize_1.default.STRING,
    points: sequelize_1.default.STRING,
    average1: sequelize_1.default.STRING,
    average2: sequelize_1.default.STRING,
    average3: sequelize_1.default.STRING,
    allowanceMeal: sequelize_1.default.STRING,
    allowanceInsurance: sequelize_1.default.STRING,
    transportAllowanceCategory1: sequelize_1.default.STRING,
    transportAllowanceCategory2: sequelize_1.default.STRING,
    transportAllowanceCategory3: sequelize_1.default.STRING,
    hours: sequelize_1.default.STRING,
    amount: sequelize_1.default.STRING,
    coefficient1: sequelize_1.default.STRING,
    percentage: sequelize_1.default.STRING,
    coefficient2: sequelize_1.default.STRING,
    reducedYoS: sequelize_1.default.STRING,
    municipalityEmployment: sequelize_1.default.STRING,
    municipalityResidency: sequelize_1.default.STRING,
    municipalityPayout1: sequelize_1.default.STRING,
    municipalityPayout2: sequelize_1.default.STRING,
    accountPayout1: sequelize_1.default.STRING,
    accountPayout2: sequelize_1.default.STRING,
    employmentBooklet_SerialNumber: sequelize_1.default.STRING,
    employmentBooklet_RegistryNumber: sequelize_1.default.STRING,
    employmentBooklet_DateOfIssue: sequelize_1.default.STRING,
    employmentBooklet_Municipality: sequelize_1.default.STRING,
    employmentBooklet_EmploymentCode: sequelize_1.default.STRING,
    // externalYoS_periods: YoSPeriod[],
    externalYoS_total: sequelize_1.default.BIGINT,
    // internalYoS_periods: YoSPeriod[],
    internalYoS_total: sequelize_1.default.BIGINT,
    totalYoS: sequelize_1.default.BIGINT,
    address: sequelize_1.default.STRING,
    zip: sequelize_1.default.STRING,
    municipality: sequelize_1.default.STRING,
    sex: sequelize_1.default.STRING,
    dateOfBirth: sequelize_1.default.STRING,
    idSerialNumber: sequelize_1.default.STRING,
    idRegistryNumber: sequelize_1.default.STRING,
    idDateOfIssue: sequelize_1.default.STRING,
    idMunicipalityOfIssue: sequelize_1.default.STRING,
    healthInsuranceSerialNumber: sequelize_1.default.STRING,
    healthInsuranceRegistryNumber: sequelize_1.default.STRING,
    healthInsuranceDateOfIssue: sequelize_1.default.STRING,
    healthInsuranceMunicipalityOfIssue: sequelize_1.default.STRING,
    familyMembers: sequelize_1.default.STRING,
    numberOfKids: sequelize_1.default.STRING,
    email: sequelize_1.default.STRING,
    comment: sequelize_1.default.STRING
});
