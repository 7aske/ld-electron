import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

interface Employee {
	id: string;
	jmbg: string;
}

interface EmployeesFile {
	employees: Array<Employee>;
}
const employeesFilePath: string = join(
	__dirname,
	'assets/database/workers.json'
);
let window: BrowserWindow | null;
let child: BrowserWindow | null;
let employeesFile: EmployeesFile = JSON.parse(
	readFileSync(employeesFilePath, 'utf8').toString()
);
function handleSave(employees: Array<Employee>) {
	employees.forEach(employee => {
		const check: Array<Employee> = employeesFile.employees.filter(e => {
			return e.jmbg == employee.jmbg || e.id == employee.id;
		});
		console.log(check.length);
		if (check.length == 1) {
			const replace: number = employeesFile.employees.findIndex(e => {
				return e.jmbg == check[0].jmbg;
			});
			employeesFile.employees.splice(replace, 1, employee);
		} else if (check.length == 0) {
			employeesFile.employees.push(employee);
		}
	});
	employeesFile.employees.sort((a, b) => {
		if (a.id > b.id) return 1;
		if (a.id < b.id) return -1;
		else return 0;
	});
	writeFileSync(employeesFilePath, JSON.stringify(employeesFile), 'utf8');
	if (window)
		window.webContents.send('employee:search', employeesFile.employees);
}
function main() {
	window = new BrowserWindow({
		width: 1600,
		height: 1200,
		center: true
	});
	window.loadFile(join(__dirname, 'assets/views/main.html'));
	window.on('closed', () => {
		window = null;
	});
}
app.on('ready', main);
app.on('window-all-closed', () => {
	app.quit();
});
ipcMain.on('employee:save', (event: any, employees: any) => {
	console.log(employees);
	handleSave(employees);
});
ipcMain.on('employee:get', (event: any, query: any) => {
	console.log(query);

	if (query) {
		const employees = employeesFile.employees.filter(e => {
			return e.jmbg == query || e.id == query;
		});
		if (window) window.webContents.send('employee:search', employees);
	} else {
		employeesFile.employees.sort((a, b) => {
			if (a.id > b.id) return 1;
			if (a.id < b.id) return -1;
			else return 0;
		});
		if (window)
			window.webContents.send('employee:search', employeesFile.employees);
	}
});
