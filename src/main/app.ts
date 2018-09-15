import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { EmployeeProperties } from '../renderer/scripts/Employee';
interface EmployeesFile {
	employees: EmployeeProperties[];
}
const employeesFilePath: string = join(__dirname, 'database/employees.json');
let window: BrowserWindow | null;
let employeesFile: EmployeesFile = JSON.parse(readFileSync(employeesFilePath, 'utf8').toString());
function main() {
	window = new BrowserWindow({
		width: 1920,
		height: 1080,
		center: true,
		show: false,
		maximizable: true,
		icon: join(__dirname, 'icons/default.png')
	});
	window.loadFile(join(__dirname, '../renderer/views/mainMenu.html'));
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
app.on('ready', main);
app.on('window-all-closed', () => {
	app.quit();
});
function handleSave(employees: EmployeeProperties[]) {
	employees.forEach(employee => {
		const check: EmployeeProperties | undefined = employeesFile.employees.find(e => {
			return e._id == employee._id;
		});
		if (check) {
			console.log(check._id);
			const replace: number = employeesFile.employees.findIndex(e => {
				return e._id == check._id;
			});
			employeesFile.employees.splice(replace, 1, employee);
		} else if (check == undefined) {
			employeesFile.employees.push(employee);
		}
	});
	employeesFile.employees.sort((a, b) => {
		if (a.id > b.id) return 1;
		if (a.id < b.id) return -1;
		else return 0;
	});
	writeFileSync(employeesFilePath, JSON.stringify(employeesFile), 'utf8');
	return employeesFile.employees;
}
function handleDelete(toDelete: EmployeeProperties[]) {
	toDelete.forEach(employee => {
		employeesFile.employees.splice(employeesFile.employees.indexOf(employee), 1);
	});
	writeFileSync(employeesFilePath, JSON.stringify(employeesFile), 'utf8');
	return employeesFile.employees;
}
ipcMain.on('employee:save', (event: any, employees: any) => {
	console.log(employees.length);
	event.returnValue = handleSave(employees);
});
ipcMain.on('employee:delete', (event: any, employees: any) => {
	console.log(employees.length);
	event.returnValue = handleDelete(employees);
});
ipcMain.on('employee:get', (event: any, query: string | null) => {
	console.log(query);
	if (query) {
		const employees = employeesFile.employees.filter(e => {
			return e._id == query;
		});
		event.returnValue = employees;
	} else {
		employeesFile.employees.sort((a, b) => {
			if (a.id > b.id) return 1;
			if (a.id < b.id) return -1;
			else return 0;
		});
		event.returnValue = employeesFile.employees;
	}
});
