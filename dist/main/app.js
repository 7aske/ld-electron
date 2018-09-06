"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const fs_1 = require("fs");
const employeesFilePath = path_1.join(__dirname, 'database/employees.json');
let window;
let employeesFile = JSON.parse(fs_1.readFileSync(employeesFilePath, 'utf8').toString());
function main() {
    window = new electron_1.BrowserWindow({
        width: 1920,
        height: 1080,
        center: true,
        show: false,
        maximizable: true,
        icon: path_1.join(__dirname, 'icons/default.png')
    });
    window.loadFile(path_1.join(__dirname, '../renderer/views/mainMenu.html'));
    window.on('ready-to-show', () => {
        window.show();
    });
    window.on('closed', () => {
        window = null;
    });
    window.webContents.on('new-window', event => {
        event.preventDefault();
    });
}
electron_1.app.on('ready', main);
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
function handleSave(employees) {
    employees.forEach(employee => {
        const check = employeesFile.employees.find(e => {
            return e._id == employee._id;
        });
        if (check) {
            console.log(check._id);
            const replace = employeesFile.employees.findIndex(e => {
                return e._id == check._id;
            });
            employeesFile.employees.splice(replace, 1, employee);
        }
        else if (check == undefined) {
            employeesFile.employees.push(employee);
        }
    });
    employeesFile.employees.sort((a, b) => {
        if (a.id > b.id)
            return 1;
        if (a.id < b.id)
            return -1;
        else
            return 0;
    });
    fs_1.writeFileSync(employeesFilePath, JSON.stringify(employeesFile), 'utf8');
    return employeesFile.employees;
}
function handleDelete(toDelete) {
    toDelete.forEach(employee => {
        employeesFile.employees.splice(employeesFile.employees.indexOf(employee), 1);
    });
    fs_1.writeFileSync(employeesFilePath, JSON.stringify(employeesFile), 'utf8');
    return employeesFile.employees;
}
electron_1.ipcMain.on('employee:save', (event, employees) => {
    console.log(employees.length);
    event.returnValue = handleSave(employees);
});
electron_1.ipcMain.on('employee:delete', (event, employees) => {
    console.log(employees.length);
    event.returnValue = handleDelete(employees);
});
electron_1.ipcMain.on('employee:get', (event, query) => {
    console.log(query);
    if (query) {
        const employees = employeesFile.employees.filter(e => {
            return e._id == query;
        });
        event.returnValue = employees;
    }
    else {
        employeesFile.employees.sort((a, b) => {
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
