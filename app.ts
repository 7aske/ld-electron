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
function handleSave(employee: Employee) {
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
	} else {
		if (window)
			window.webContents.send(
				'window:alert',
				'Postoji radnik sa datom sifrom ili maticnim brojem'
			);
	}
	employeesFile.employees.sort();
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
ipcMain.on('employee:save', (event: any, employee: any) => {
	console.log(employee);
	handleSave(employee);
});
ipcMain.on('employee:get', (event: any, query: any) => {
	console.log(query);

	if (query) {
		const employees = employeesFile.employees.filter(e => {
			return e.jmbg == query || e.id == query;
		});
		if (window) window.webContents.send('employee:search', employees);
	} else {
		employeesFile.employees.sort();
		if (window)
			window.webContents.send('employee:search', employeesFile.employees);
	}
});
