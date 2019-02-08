import axios from "axios";
import { ipcRenderer } from "electron";
import { State } from "../../@types";
import { Resizer } from "../scripts/layout/Resizer";
import { Modal } from "../scripts/modal/Modal";
import { Store } from "../scripts/store/Store";
import { ENV } from "../scripts/utils/env";
import { PopupDialog } from "../scripts/utils/PopupDialog";
const initialState: State = {
	currentIndex: 0
};
// const url: string | null = ENV == "electron" ? null : "http://localhost:3000";

const store = new Store(initialState);
const resizer = new Resizer(store, true);
const popup = new PopupDialog(store);
const modal = new Modal(store);
const test = document.querySelector("#testBtn") as HTMLButtonElement;
test.addEventListener("click", () => modal.open());
// const saveBtn = document.querySelector("#saveBtn") as HTMLButtonElement;
// saveBtn.addEventListener("click", () => {
// 	calcSave(null);
// });
const backBtn = document.querySelector("#backBtn") as HTMLButtonElement;
backBtn.addEventListener("click", handleBack);
// const rejectBtn = document.querySelector("#rejectBtn") as HTMLButtonElement;
// rejectBtn.addEventListener("click", () => {
// 	calcReject(store.getState("calcArray"));
// });
// const deleteBtn = document.querySelector("#deleteBtn") as HTMLButtonElement;
// deleteBtn.addEventListener("click", () => {
// 	calcDelete([store.getState("currentCalc")]);
// });

function handleBack(event: Event): void {
	event.preventDefault();
	// const commit: Calc[] = [];
	// let text = "Imate nesacuvane promene.<br>";
	// let check: boolean = false;
	// const array: Calc[] = store.getState("employeeArray");
	// array.forEach(e => {
	// 	if (Object.keys(e.changes).length > 0) {
	// 		check = true;
	// 		commit.push(e);
	// 	}
	// });
	// // TODO: convert to calc
	// commit.forEach(e => {
	// 	text += "calcSummaryTemplate(e)";
	// });
	// if (false) {
	// 	modal.open("Obevestenje", text, () => {
	// 		// calcSave(commit, true);
	// 		window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
	// 	});
	// } else {
	window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
	// }
}

// function setCalc(data: CalcProps[] | CalcProps): void {
// 	const array: Calc[] = [];
// 	if (data instanceof Array) {
// 		data.forEach(e => {
// 			array.push(new Calc(e));
// 		});
// 		store.setState("currentCalc", array[0]);
// 		store.setState("calcArray", array);
// 		store.setState("calcList", array);
// 	}
// }
//
// function calcDelete(calcsToDelete: Calc[]): void {
// 	if (calcsToDelete.length > 0) {
// 		let text = "Da li ste sigurni da zelite da obrisete ove unose?";
// 		calcsToDelete.forEach(e => {
// 			text += calcSummaryTemplate(e);
// 		});
// 		modal.open("Upozorenje", text, () => {
// 			const toDelete: CalcProps[] = [];
// 			calcsToDelete.forEach(calc => {
// 				const calcs: Calc[] = store.getState("calcArray");
// 				const newCalc: Calc = store.getState("newCalc");
// 				calcs.splice(calcs.indexOf(calc), 1);
// 				store.setState("calcArray", calcs);
// 				if (calcs.length > 0) {
// 					store.setState("currentCalc", calcs[0]);
// 				}
// 				if (newCalc) {
// 					if (newCalc.properties.id == calc.properties.id) store.setState("newCalc", null);
// 				} else {
// 					toDelete.push(calc.properties);
// 				}
// 			});
// 			calcDeleteHandler(toDelete);
// 		});
// 	}
// }

// function calcReject(array: Calc[] | null): void {
// 	const calcs: Calc[] = array ? array : store.getState("calcArray");
// 	let text = "Da li zelite da odbacite sve promene?<br>";
// 	const calcsToReject: Calc[] = [];
// 	calcs.forEach(calc => {
// 		if (Object.keys(calc.changes).length > 0) {
// 			calcsToReject.push(calc);
// 			text += calcSummaryTemplate(calc);
// 		}
// 	});
// 	if (calcsToReject.length > 0) {
// 		modal.open("Upozorenje", text, () => {
// 			calcsToReject.forEach((calc, i) => {
// 				const keys: string[] = Object.keys(calc.changes);
// 				if (keys.length > 0) {
// 					keys.forEach(k => {
// 						delete calc.changes[k];
// 					});
// 				}
// 				store.setState("currentCalc", calcsToReject[i]);
// 			});
// 			store.setState("calcArray", store.getState("calcArray"));
// 			store.setState("currentCalc", store.getState("calcArray")[0]);
// 		});
// 	} else {
// 		modal.open("Obavestenje", "Nema trenutnih promena.");
// 	}
// }

// function calcSave(array: Calc[], skipModal?: boolean): void {
// 	if (skipModal) {
// 		const save: CalcProps[] = [];
// 		array.forEach(e => {
// 			e.commitChanges();
// 			save.push(e.properties);
// 		});
// 		store.setState("newCalc", null);
// 		calcSaveHandler(save);
// 	} else {
// 		const commit: Calc[] = [];
// 		let check: boolean = false;
// 		const calcs: Calc[] = array ? array : store.getState("calcArray");
// 		calcs.forEach(e => {
// 			if (Object.keys(e.changes).length > 0) {
// 				check = true;
// 			}
// 		});
// 		if (check) {
// 			let text: string = "";
// 			calcs.forEach(e => {
// 				if (Object.keys(e.changes).length > 0) {
// 					text += calcSummaryTemplate(e);
// 					commit.push(e);
// 				}
// 			});
//
// 			modal.open("Da li zelite da sacuvate sve promene?", text, () => {
// 				const save: CalcProps[] = [];
// 				commit.forEach(e => {
// 					e.commitChanges();
// 					save.push(e.properties);
// 				});
// 				store.setState("newCalc", null);
// 				calcSaveHandler(save);
// 			});
// 		} else {
// 			modal.open("Obavestenje", "Nema izmena");
// 		}
// 	}
// }

// function calcGetHandler() {
// 	console.log(ENV == "electron");
// 	if (ENV == "electron") {
// 		setCalc(ipcRenderer.sendSync("calc:get", null));
// 	} else {
// 		axios
// 			.get(`${url}/calcs`)
// 			.then(response => {
// 				console.log(response.data);
// 				setCalc(response.data);
// 			})
// 			.catch(err => console.log(err));
// 	}
// }

// function calcDeleteHandler(calcs: CalcProps[]) {
// 	if (ENV == "electron") {
// 		const result: CalcProps[] = ipcRenderer.sendSync("calc:delete", calcs);
// 		setCalc(result);
// 	} else {
// 		axios
// 			.post(`${url}/calcs/delete`, {calcs})
// 			.then(response => {
// 				console.log(response.data);
// 				setCalc(response.data);
// 			})
// 			.catch(err => console.log(err));
// 	}
// }

// function calcSaveHandler(save: CalcProps[]) {
// 	if (ENV == "electron") {
// 		setCalc(ipcRenderer.sendSync("calc:save", save));
// 	} else {
// 		axios
// 			.post(`${url}/calcs/save`, {save})
// 			.then(response => {
// 				console.log(response.data);
// 				setCalc(response.data);
// 			})
// 			.catch(err => console.log(err));
// 	}
// }
// window.onload = () => calcGetHandler();
document.addEventListener("keydown", event => {
	switch (event.key) {
		case "Escape":
			if (store.getState("isPopUp")) {
				popup.close.click();
				break;
			}
			if (store.getState("isModalUp")) {
				modal.close.click();
				break;
			}
			handleBack(event);
			break;
		case "Enter":
			if (store.getState("isPopUp")) popup.confirm.click();
			break;
		default:
			break;
	}
});
