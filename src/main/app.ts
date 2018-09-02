import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

interface Employee {
	_id: string;
	id: string;
	jmbg: string;
}

interface EmployeesFile {
	employees: Array<Employee>;
}

const configFilePath: string = join(__dirname, 'config/config.json');
let configFile = readFileSync(configFilePath, 'utf8');
const employeesFilePath: string = join(__dirname, 'database/employees.json');
let window: BrowserWindow | null;
let child: BrowserWindow | null;
let employeesFile: EmployeesFile = JSON.parse(readFileSync(employeesFilePath, 'utf8').toString());
function main() {
	window = new BrowserWindow({
		width: 1600,
		height: 1200,
		center: true
	});

	window.loadFile(join(__dirname, '../renderer/views/mainMenu.html'));

	window.on('closed', () => {
		window = null;
	});
}
app.on('ready', main);
app.on('window-all-closed', () => {
	app.quit();
});
function handleSave(employees: Array<Employee>) {
	employees.forEach(employee => {
		const check: Employee | undefined = employeesFile.employees.find(e => {
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
function handleDelete(employees: Array<Employee>) {
	employeesFile.employees = employees;
	employeesFile.employees.sort((a, b) => {
		if (a.id > b.id) return 1;
		if (a.id < b.id) return -1;
		else return 0;
	});
	writeFileSync(employeesFilePath, JSON.stringify(employeesFile), 'utf8');
	return employeesFile.employees;
}

ipcMain.on('window:settings-get', (event: any, data: any) => {
	event.returnValue = configFile;
});
ipcMain.on('window:settings-update', (event: any, data: any) => {
	console.log(data);
	configFile = data;
	writeFileSync(configFilePath, JSON.stringify(data), 'utf8');
	event.returnValue = data;
});
ipcMain.on('employee:save', (event: any, employees: any) => {
	console.log(employees.length);
	event.returnValue = handleSave(employees);
});
ipcMain.on('employee:delete', (event: any, employees: any) => {
	console.log(employees.length);
	event.returnValue = handleDelete(employees);
});
ipcMain.on('employee:get', (event: any, query: any) => {
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
