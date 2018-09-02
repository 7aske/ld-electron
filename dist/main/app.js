"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const fs_1 = require("fs");
const configFilePath = path_1.join(__dirname, 'config/config.json');
let configFile = fs_1.readFileSync(configFilePath, 'utf8');
const employeesFilePath = path_1.join(__dirname, 'database/employees.json');
let window;
let child;
let employeesFile = JSON.parse(fs_1.readFileSync(employeesFilePath, 'utf8').toString());
function main() {
    window = new electron_1.BrowserWindow({
        width: 1600,
        height: 1200,
        center: true
    });
    window.loadFile(path_1.join(__dirname, '../renderer/views/mainMenu.html'));
    window.on('closed', () => {
        window = null;
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
function handleDelete(employees) {
    employeesFile.employees = employees;
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
electron_1.ipcMain.on('window:settings-get', (event, data) => {
    event.returnValue = configFile;
});
electron_1.ipcMain.on('window:settings-update', (event, data) => {
    console.log(data);
    configFile = data;
    fs_1.writeFileSync(configFilePath, JSON.stringify(data), 'utf8');
    event.returnValue = data;
});
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
