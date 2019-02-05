"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = require("fs");
var path_1 = require("path");
var employeesFilePath = path_1.join(__dirname, "database/employees.json");
var calcFilePath = path_1.join(__dirname, "database/calcElements.json");
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
    employees.forEach(function (employee) {
        var check = employeesFile.employees.find(function (e) {
            return e._id == employee._id;
        });
        if (check) {
            console.log(check._id);
            var replace = employeesFile.employees.findIndex(function (e) {
                return e._id == check._id;
            });
            employeesFile.employees.splice(replace, 1, employee);
        }
        else if (check == undefined) {
            employeesFile.employees.push(employee);
        }
    });
    employeesFile.employees.sort(function (a, b) {
        if (a.id > b.id)
            return 1;
        if (a.id < b.id)
            return -1;
        else
            return 0;
    });
    fs_1.writeFileSync(employeesFilePath, JSON.stringify(employeesFile), "utf8");
    return employeesFile.employees;
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
electron_1.ipcMain.on("employee:save", function (event, employees) {
    console.log(employees.length);
    event.returnValue = handleSave(employees);
});
electron_1.ipcMain.on("employee:delete", function (event, employees) {
    console.log(employees.length);
    event.returnValue = handleDelete(employees);
});
electron_1.ipcMain.on("employee:get", function (event, query) {
    console.log(query);
    if (query) {
        var employees = employeesFile.employees.filter(function (e) {
            return e._id == query;
        });
        event.returnValue = employees;
    }
    else {
        employeesFile.employees.sort(function (a, b) {
            if (a.id > b.id)
                return 1;
            if (a.id < b.id)
                return -1;
            else
                return 0;
        });
        event.returnValue = employeesFile.employees;
    }
});
