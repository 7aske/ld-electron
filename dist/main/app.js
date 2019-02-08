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
var electron_1 = require("electron");
var fs_1 = require("fs");
var path_1 = require("path");
var sequelize_1 = __importDefault(require("sequelize"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var employeesFilePath = path_1.join(__dirname, "database/employees.json");
var calcFilePath = path_1.join(__dirname, "database/calcElements.json");
var employeeDBPath = path_1.join(__dirname, "database/employees.sqlite3");
var db = new sqlite3_1.default.Database(employeeDBPath);
exports.sequelize = new sequelize_1.default({ dialect: "sqlite", storage: employeeDBPath });
var EmployeeModel_1 = require("./models/EmployeeModel");
// setTimeout(() => {
// 	employeesFile.employees.forEach(async e => {
// 		await execute("insert", e);
// 	});
// }, 200)
var window;
var employeesFile = JSON.parse(fs_1.readFileSync(employeesFilePath, "utf8").toString());
var calcFile = JSON.parse(fs_1.readFileSync(calcFilePath, "utf8").toString());
function main() {
    window = new electron_1.BrowserWindow({
        width: 1920,
        height: 1080,
        center: true,
        show: false,
        maximizable: true,
        icon: path_1.join(__dirname, "icons/default.png")
    });
    window.loadFile(path_1.join(__dirname, "../renderer/views/mainMenu.html"));
    window.on("ready-to-show", function () {
        window.show();
    });
    window.on("closed", function () {
        window = null;
    });
    window.webContents.on("new-window", function (event) {
        event.preventDefault();
    });
}
electron_1.app.on("ready", main);
electron_1.app.on("window-all-closed", function () {
    electron_1.app.quit();
});
function handleSave(employees) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // employees.forEach(employee => {
                    // 	const check: EmployeeProperties | undefined = employeesFile.employees.find(e => {
                    // 		return e._id == employee._id;
                    // 	});
                    // 	if (check) {
                    // 		console.log(check._id);
                    // 		const replace: number = employeesFile.employees.findIndex(e => {
                    // 			return e._id == check._id;
                    // 		});
                    // 		employeesFile.employees.splice(replace, 1, employee);
                    // 	} else if (check == undefined) {
                    // 		employeesFile.employees.push(employee);
                    // 	}
                    // });
                    // employeesFile.employees.sort((a, b) => {
                    // 	if (a.id > b.id) return 1;
                    // 	if (a.id < b.id) return -1;
                    // 	else return 0;
                    // });
                    // writeFileSync(employeesFilePath, JSON.stringify(employeesFile), "utf8");
                    // return employeesFile.employees;
                    employees.forEach(function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            EmployeeModel_1.execute("insert", e);
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, EmployeeModel_1.EmployeeModel.findAll()];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.map(function (e) { return e.dataValues; })];
            }
        });
    });
}
function handleCalcSave(calcs) {
    calcs.forEach(function (calc) {
        var check = calcFile.calcElements.find(function (c) {
            return c.id == calc.id;
        });
        if (check) {
            console.log(check.id);
            var replace = calcFile.calcElements.findIndex(function (e) {
                return e.id == check.id;
            });
            calcFile.calcElements.splice(replace, 1, calc);
        }
        else if (check == undefined) {
            calcFile.calcElements.push(calc);
        }
    });
    fs_1.writeFileSync(calcFilePath, JSON.stringify(calcFile), "utf8");
}
function handleDelete(toDelete) {
    toDelete.forEach(function (employee) {
        employeesFile.employees.splice(employeesFile.employees.indexOf(employee), 1);
    });
    fs_1.writeFileSync(employeesFilePath, JSON.stringify(employeesFile), "utf8");
    return employeesFile.employees;
}
function handleCalcDelete(toDelete) {
    toDelete.forEach(function (calc) {
        calcFile.calcElements.splice(calcFile.calcElements.indexOf(calc), 1);
    });
    fs_1.writeFileSync(calcFilePath, JSON.stringify(calcFile), "utf8");
    return calcFile.calcElements;
}
electron_1.ipcMain.on("calc:save", function (event, calc) {
    console.log(calc.length);
    event.returnValue = handleCalcSave(calc);
});
electron_1.ipcMain.on("calc:get", function (event, query) {
    console.log(query);
    if (query) {
        var calcs = calcFile.calcElements.filter(function (e) {
            return e.id == query;
        });
        event.returnValue = calcs;
    }
    else {
        calcFile.calcElements.sort(function (a, b) {
            if (a.id > b.id)
                return 1;
            if (a.id < b.id)
                return -1;
            else
                return 0;
        });
        event.returnValue = calcFile.calcElements;
    }
});
electron_1.ipcMain.on("calc:delete", function (event, calcs) {
    console.log(calcs.length);
    event.returnValue = handleDelete(calcs);
});
electron_1.ipcMain.on("employee:save", function (event, employees) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event;
                return [4 /*yield*/, handleSave(employees)];
            case 1:
                _a.returnValue = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("employee:delete", function (event, employees) {
    console.log(employees.length);
    event.returnValue = handleDelete(employees);
});
electron_1.ipcMain.on("employee:get", function (event, query) { return __awaiter(_this, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(query);
                if (!query) return [3 /*break*/, 1];
                event.returnValue = employeesFile.employees.filter(function (e) {
                    return e._id == query;
                });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, EmployeeModel_1.EmployeeModel.findAll()];
            case 2:
                res = _a.sent();
                event.returnValue = res.map(function (e) { return e.dataValues; });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
