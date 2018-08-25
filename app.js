"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const fs_1 = require("fs");
const employeesFilePath = path_1.join(__dirname, 'assets/database/workers.json');
let window;
let child;
let employeesFile = JSON.parse(fs_1.readFileSync(employeesFilePath, 'utf8').toString());
function handleSave(employees) {
    employees.forEach(employee => {
        const check = employeesFile.employees.filter(e => {
            return e.jmbg == employee.jmbg || e.id == employee.id;
        });
        console.log(check.length);
        if (check.length == 1) {
            const replace = employeesFile.employees.findIndex(e => {
                return e.jmbg == check[0].jmbg;
            });
            employeesFile.employees.splice(replace, 1, employee);
        }
        else if (check.length == 0) {
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
    if (window)
        window.webContents.send('employee:search', employeesFile.employees);
}
function main() {
    window = new electron_1.BrowserWindow({
        width: 1600,
        height: 1200,
        center: true
    });
    window.loadFile(path_1.join(__dirname, 'assets/views/main.html'));
    window.on('closed', () => {
        window = null;
    });
}
electron_1.app.on('ready', main);
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
electron_1.ipcMain.on('employee:save', (event, employees) => {
    console.log(employees);
    handleSave(employees);
});
electron_1.ipcMain.on('employee:get', (event, query) => {
    console.log(query);
    if (query) {
        const employees = employeesFile.employees.filter(e => {
            return e.jmbg == query || e.id == query;
        });
        if (window)
            window.webContents.send('employee:search', employees);
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
        if (window)
            window.webContents.send('employee:search', employeesFile.employees);
    }
});
