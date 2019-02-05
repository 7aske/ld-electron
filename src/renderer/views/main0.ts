import { ipcRenderer } from "electron";

declare global {
	interface Window {
		process: any;
	}
}
window.process = process || {};
const ENV: string | undefined = window.process.type == "renderer" ? "electron" : "web";
import axios from "axios";
import { EmployeeProperties, State } from "../../@types";
import { Employee } from "../scripts/models/Employee";
import { Menu } from "../scripts/utils/Menu";
import { Modal } from "../scripts/utils/Modal";
import { Resizer } from "../scripts/utils/Resizer";
import { Store } from "../scripts/store/Store";
import { employeeSummaryTemplate, optionTemplate } from "../scripts/utils/templates";

const initialState: State = {
	employeeArray: [],
	employeeList: [],
	currentEmployee: null,
	isAsideOut: false,
	isModalUp: false,
	asideWidth: 400,
	contentWidth: {left: 6, right: 6},
	isResizingList: false,
	isResizingContent: false,
	newEmployee: null,
	currentIndex: 0
};
const url: string | null = ENV == "electron" ? null : "http://localhost:3000";

const store: Store = new Store(initialState);
const resizer: Resizer = new Resizer(store);
let menu: Menu | null = null;
// function asideToggleWrapper() {
// 	resizer.asideToggle();
// }
// function handleResizeAsideWrapper() {
// 	resizer.handleResizeAside();
// }
// function handleResizeContentWrapper() {
// 	resizer.handleResizeContent();
// }
// store.subscribe('isAsideOut', [asideToggleWrapper]);
// store.subscribe('asideWidth', [handleResizeAsideWrapper]);
// store.subscribe('contentWidth', [handleResizeContentWrapper]);
store.subscribe("currentEmployee", [populateFields, colorEmployeeList]);
store.subscribe("employeeArray", [populateEmployeeList]);
store.subscribe("employeeList", [populateEmployeeList, colorEmployeeList]);

// const main: HTMLElement = document.querySelector('main');
const modal = new Modal(store);
console.log(modal);
const employeeList = document.querySelector("#employeeList") as HTMLElement;
const searchInp = document.querySelector("#searchInp") as HTMLInputElement;
searchInp.addEventListener("input", function() {
	searchEmployeeArray(this.value);
});

const saveBtn = document.querySelector("#saveBtn") as HTMLButtonElement;
saveBtn.addEventListener("click", () => {
	employeeSave(null);
});
const backBtn = document.querySelector("#backBtn") as HTMLButtonElement;
backBtn.addEventListener("click", handleBack);
const rejectBtn = document.querySelector("#rejectBtn") as HTMLButtonElement;
rejectBtn.addEventListener("click", () => {
	employeeReject(store.getState("employeeArray"));
});
const deleteBtn = document.querySelector("#deleteBtn") as HTMLButtonElement;
deleteBtn.addEventListener("click", () => {
	employeeDelete([store.getState("currentEmployee")]);
});
const fromDateInternal = document.querySelector("#fromDateInternal") as HTMLInputElement;
const tillDateInternal = document.querySelector("#tillDateInternal") as HTMLInputElement;
const addInternalYoSPeriod = document.querySelector("#addInternalYoSPeriod") as HTMLButtonElement;
addInternalYoSPeriod.addEventListener("click", function() {
	addYoSPeriod(this.id, fromDateInternal.value, tillDateInternal.value);
});
const fromDateExternal = document.querySelector("#fromDateExternal") as HTMLInputElement;
const tillDateExternal = document.querySelector("#tillDateExternal") as HTMLInputElement;
const addExternalYoSPeriod = document.querySelector("#addExternalYoSPeriod") as HTMLButtonElement;
addExternalYoSPeriod.addEventListener("click", function() {
	addYoSPeriod(this.id, fromDateExternal.value, tillDateExternal.value);
});
const addNewBtn: HTMLButtonElement = document.querySelector("#addNewBtn");
addNewBtn.addEventListener("click", employeeAdd);
const headerInputs = document.querySelectorAll<HTMLInputElement>("header input") as unknown as HTMLInputElement[];
const mainInputs = document.querySelectorAll<HTMLInputElement>("main input") as unknown as HTMLInputElement[];
const inputs = [...headerInputs, ...mainInputs, document.querySelector("main textarea")] as HTMLInputElement[];
inputs.forEach(i => {
	i.addEventListener("keyup", function() {
		if (this.id.indexOf("fromDateInternal") == -1 && this.id.indexOf("tillDateInternal") == -1 && this.id.indexOf("fromDateExternal") == -1 && this.id.indexOf("tillDateExternal") == -1)
			handleInput(this.id, this.value, this);
	});
});

function handleBack(event: Event): void {
	event.preventDefault();
	const commit: Employee[] = [];
	let text = "Imate nesacuvane promene.<br>";
	let check: boolean = false;
	const array: Employee[] = store.getState("employeeArray");
	array.forEach(e => {
		if (Object.keys(e.changes).length > 0) {
			check = true;
			commit.push(e);
		}
	});
	commit.forEach(e => {
		text += employeeSummaryTemplate(e);
	});
	if (check) {
		modal.open("Obevestenje", text, () => {
			employeeSave(commit, true);
			window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
		});
	} else {
		window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
	}
}

function changeListIndex(num: number): void {
	let index: number = store.getState("currentIndex");
	const employees: Employee[] = store.getState("employeeArray");
	index += num;
	if (index > employees.length || index < 0) index -= num;
	store.setState("currentIndex", index);
	const employee: Employee = employees[index];
	if (employee) store.setState("currentEmployee", employee);
}

function changeInputIndex(): void {
	const tabs = document.querySelectorAll("[name=\"tabs\"]") as unknown as HTMLInputElement[];
	const input: HTMLInputElement = document.activeElement as HTMLInputElement;
	let index: number = inputs.indexOf(input);
	if (index == 16) {
		tabs.forEach(t => t.checked == false);
		tabs[0].checked = true;
		index = 19;
	}
	if (index == 39) {
		tabs.forEach(t => t.checked == false);
		tabs[1].checked = true;
		index = 39;
	}
	if (index == 51) {
		tabs.forEach(t => t.checked == false);
		tabs[2].checked = true;
		index = 51;
	}
	if (index < inputs.length - 1) {
		inputs[index + 1].focus();
	}
}

function handleInput(prop: string, value: string, target: HTMLInputElement): void {
	if (prop == "umcn") {
		const employees: Employee[] = store.getState("employeeArray");
		employees.forEach(e => {
			if (e.properties.umcn == value && store.getState("currentEmployee").properties.umcn != value) {
				modal.open("Greska", `Vec postoji radnik sa tim JMBG. ${employeeSummaryTemplate(e)}`);
				value = value.substring(0, target.value.length - 1);
			}
		});
	}
	const employee: Employee = store.getState("currentEmployee");
	if (employee) {
		if (value == employee.properties[prop]) {
			delete employee.changes[prop];
			store.setState("currentEmployee", employee);
		} else {
			employee.changes[prop] = value;
			store.setState("currentEmployee", employee);
		}
	}
}

function addYoSPeriod(type: string, f: string, t: string): void {
	if (t != "" && type != "") {
		const employee: Employee = store.getState("currentEmployee");
		if (type == "addExternalYoSPeriod") {
			if (employee) {
				employee.addExternalYoS(parseInt(f, 10), parseInt(t, 10));
				store.setState("currentEmployee", employee);
			} else {
				alert("Izaberite radnika");
			}
		} else if (type == "addInternalYoSPeriod") {
			if (employee) {
				employee.addInternalYoS(parseInt(f, 10), parseInt(t, 10));
				store.setState("currentEmployee", employee);
			} else {
				alert("Izaberite radnika");
			}
		}
	} else {
		modal.open("Greska", "Neispravan datum");
	}
}

function populateFields(): void {
	const employee: Employee = store.getState("currentEmployee");
	if (employee) employee.populate();
}

function colorEmployeeList(): void {
	const currentEmployee: Employee = store.getState("currentEmployee");
	const listItems: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll("#employeeList li"));
	const employees: Employee[] = store.getState("employeeList");
	employees.forEach(e => {
		const item: HTMLElement = document.querySelector(`[data-id="${e.properties._id}"]`);
		const badge: HTMLElement = item.lastElementChild as HTMLElement;
		if (Object.keys(e.changes).length > 0) {
			if (item) item.classList.add("list-group-item-warning");
			if (badge) badge.innerHTML = Object.keys(e.changes).length.toString();
		} else {
			if (item) item.classList.remove("list-group-item-warning");
			if (badge) badge.innerHTML = "";
		}
	});
	listItems.forEach(item => {
		if (searchInp.value != "") {
			const q: string = searchInp.value;
			item.firstElementChild.innerHTML = highlight(item.firstElementChild.innerHTML, q);
		}
		if (item.attributes.getNamedItem("data-id"))
			if (item.attributes.getNamedItem("data-id").value == currentEmployee.properties._id) item.classList.add("list-group-item-dark");
			else item.classList.remove("list-group-item-dark");
	});
}

function highlight(text: string, string: string) {
	text = text.trim();
	const q: string[] = string.split(" ");
	if (q.length == 1) {
		const p: RegExp = new RegExp(`<span class="bg-warning">.*?<\/span>`, "gi");
		const res: RegExp = new RegExp(q[0], "gi");
		if (text.match(p)) {
			const arr: string[] = text.split(p);
			const result: string[] = [];
			const old: string[] = text.match(p);
			arr.forEach(t => {
				const matches: string[] = t.match(res);
				const arr2: string[] = t.split(res);
				if (matches) {
					matches.forEach((m, i2) => {
						const replacement: string = `<span class="bg-warning">${m}</span>`;
						arr2.splice(i2 == 0 ? i2 + 1 : i2 * 2 + 1, 0, replacement);
					});
					t = arr.join("");
					result.push(t);
				} else {
					result.push(t);
				}
			});
			result.forEach((r, i) => {
				if (i != result.length - 1) result.splice(i == 0 ? i + 1 : i * 2 + 1, 0, old[i]);
			});
			return result.length > 0 ? result.join("") : text;
		} else {
			const matches: string[] = text.match(res);
			const arr: string[] = text.split(res);
			if (matches) {
				matches.forEach((m, i) => {
					const replacement: string = `<span class="bg-warning">${m}</span>`;
					arr.splice(i == 0 ? i + 1 : i * 2 + 1, 0, replacement);
				});
				text = arr.join("");
			}
			return text;
		}
	} else {
		q.forEach(query => {
			if (query != "") text = highlight(text, query);
		});
		return text;
	}
}

function populateEmployeeList(): void {
	let result: string = "";
	employeeList.innerHTML = "";
	const employees: Employee[] = store.getState("employeeList");
	employees.forEach(e => {
		result += optionTemplate(e);
	});
	employeeList.innerHTML = result;

	const listItems = document.querySelectorAll("aside li") as unknown as HTMLUListElement[];
	listItems.forEach(item => {
		const listEmployees: Employee[] = store.getState("employeeArray");
		const employee: Employee = listEmployees.find(e => {
			return e.properties._id == item.attributes.getNamedItem("data-id").value;
		});
		item.addEventListener("contextmenu", event => {
			menu = new Menu(event, [
				{
					name: "Sacuvaj",
					action: () => employeeSave([employee]),
					disabled: Object.keys(employee.changes).length == 0
				},
				{
					name: "Odbaci",
					action: () => employeeReject([employee]),
					disabled: Object.keys(employee.changes).length == 0
				},
				{
					name: "Obrisi",
					type: "danger",
					action: () => employeeDelete([employee]),
					disabled: false
				}
			]);
		});
	});
}

function searchEmployeeArray(query: string | null): void {
	const unique = (arrArg: Employee[]) => {
		return arrArg.filter((elem, pos, arr) => {
			return arr.indexOf(elem) == pos;
		});
	};
	const search = (arr: Employee[], q1: string) => {
		const r: RegExp = new RegExp(q1, "gi");
		return arr.filter(e => {
			const c = e.properties;
			return r.test(c.id) || r.test(c.umcn) || r.test(c.firstName) || r.test(c.lastName);
		});
	};
	const q: string[] = query.split(" ");
	let result: Employee[] = store.getState("employeeArray");
	q.forEach(q2 => {
		if (search(result, q2).length == 0) {
			for (let i = q2.length - 1; i >= 0; i--) {
				if (search(result, q2.substring(0, i)).length == 0) continue;
				else result = search(result, q2.substring(0, i));
			}
		} else {
			result = search(result, q2);
		}
	});
	store.setState("employeeList", result);
}

function changeCurrentEmployee(): void {
	const btn: HTMLButtonElement = event.target as HTMLButtonElement;
	console.log(btn.nodeName);
	const _id: string = btn.attributes.getNamedItem("data-id").value;
	const employees: Employee[] = store.getState("employeeArray");
	const employee: Employee = employees.find(e => {
		return e.properties._id == _id;
	});
	if (employee) store.setState("currentEmployee", employee);
}

function employeeAdd(): void {
	if (!store.getState("newEmployee")) {
		const newEmployee: Employee = new Employee(null);
		const newEmployeeArray: Employee[] = store.getState("employeeArray");
		newEmployeeArray.push(newEmployee);
		store.setState("newEmployee", newEmployee);
		store.setState("employeeArray", newEmployeeArray);
		store.setState("currentEmployee", newEmployee);
	}
}

function employeeReject(array: Employee[] | null): void {
	const employees: Employee[] = array ? array : store.getState("employeeArray");
	let text = "Da li zelite da odbacite sve promene?<br>";
	const employeesToReject: Employee[] = [];
	employees.forEach(employee => {
		if (Object.keys(employee.changes).length > 0) {
			employeesToReject.push(employee);
			text += employeeSummaryTemplate(employee);
		}
	});
	if (employeesToReject.length > 0) {
		modal.open("Upozorenje", text, () => {
			employeesToReject.forEach((employee, i) => {
				const keys: string[] = Object.keys(employee.changes);
				if (keys.length > 0) {
					keys.forEach(k => {
						delete employee.changes[k];
					});
				}
				store.setState("currentEmployee", employeesToReject[i]);
			});
			store.setState("employeeArray", store.getState("employeeArray"));
			store.setState("currentEmployee", store.getState("employeeArray")[0]);
		});
	} else {
		modal.open("Obavestenje", "Nema trenutnih promena.");
	}
}

function employeeDelete(employeesToDelete: Employee[]): void {
	if (employeesToDelete.length > 0) {
		let text = "Da li ste sigurni da zelite da obrisete ove unose?";
		employeesToDelete.forEach(e => {
			text += employeeSummaryTemplate(e);
		});
		modal.open("Upozorenje", text, () => {
			const toDelete: EmployeeProperties[] = [];
			employeesToDelete.forEach(employee => {
				const employees: Employee[] = store.getState("employeeArray");
				const newEmployee: Employee = store.getState("newEmployee");
				employees.splice(employees.indexOf(employee), 1);
				store.setState("employeeArray", employees);
				if (employees.length > 0) {
					store.setState("currentEmployee", employees[0]);
				}
				if (newEmployee) {
					if (newEmployee.properties._id == employee.properties._id) store.setState("newEmployee", null);
				} else {
					toDelete.push(employee.properties);
				}
			});
			employeeDeleteHandler(toDelete);
		});
	}
}

function employeeSave(array: Employee[], skipModal?: boolean): void {
	if (skipModal) {
		const save: EmployeeProperties[] = [];
		array.forEach(e => {
			e.commitChanges();
			save.push(e.properties);
		});
		store.setState("newEmployee", null);
		employeeSaveHandler(save);
	} else {
		const commit: Employee[] = [];
		let check: boolean = false;
		const employees: Employee[] = array ? array : store.getState("employeeArray");
		employees.forEach(e => {
			if (Object.keys(e.changes).length > 0) {
				check = true;
			}
		});
		if (check) {
			let text: string = "";
			employees.forEach(e => {
				if (Object.keys(e.changes).length > 0) {
					text += employeeSummaryTemplate(e);
					commit.push(e);
				}
			});

			modal.open("Da li zelite da sacuvate sve promene?", text, () => {
				const save: EmployeeProperties[] = [];
				commit.forEach(e => {
					e.commitChanges();
					save.push(e.properties);
				});
				store.setState("newEmployee", null);
				employeeSaveHandler(save);
			});
		} else {
			modal.open("Obavestenje", "Nema izmena");
		}
	}
}

function setEmployees(data: EmployeeProperties[] | EmployeeProperties): void {
	const array: Employee[] = [];
	if (data instanceof Array) {
		data.forEach(e => {
			array.push(new Employee(e));
		});
		store.setState("currentEmployee", array[0]);
		store.setState("employeeArray", array);
		store.setState("employeeList", array);
	}
}

window.onload = () => {
	employeeGetHandler();
};
document.addEventListener("keydown", event => {
	switch (event.key) {
		case "Escape":
			if (store.getState("isModalUp")) modal.close.click();
			break;
		case "Enter":
			if (store.getState("isModalUp")) modal.confirm.click();
			else {
				changeInputIndex();
			}
			break;
		case "PageUp":
			changeListIndex(-1);
			break;
		case "PageDown":
			changeListIndex(1);
			break;
		default:
	}
});

document.addEventListener("contextmenu", () => {
});

function employeeGetHandler() {
	console.log(ENV == "electron");
	if (ENV == "electron") {
		setEmployees(ipcRenderer.sendSync("employee:get", null));
	} else {
		axios
			.get(`${url}/employees`)
			.then(response => {
				console.log(response.data);
				setEmployees(response.data);
			})
			.catch(err => console.log(err));
	}
}

function employeeDeleteHandler(employees: EmployeeProperties[]) {
	if (ENV == "electron") {
		const result: EmployeeProperties[] = ipcRenderer.sendSync("employee:delete", employees);
		setEmployees(result);
	} else {
		axios
			.post(`${url}/employees/delete`, {employees})
			.then(response => {
				console.log(response.data);
				setEmployees(response.data);
			})
			.catch(err => console.log(err));
	}
}

function employeeSaveHandler(save: EmployeeProperties[]) {
	if (ENV == "electron") {
		setEmployees(ipcRenderer.sendSync("employee:save", save));
	} else {
		axios
			.post(`${url}/employees/save`, {save})
			.then(response => {
				console.log(response.data);
				setEmployees(response.data);
			})
			.catch(err => console.log(err));
	}
}
