import { ipcRenderer } from "electron";
import { Store } from "../scripts/store/Store";
import { PopupDialog } from "../scripts/utils/PopupDialog";

const store = new Store({});
const popup = new PopupDialog(store);

document.addEventListener("mouseup", event => {
	if (event.button === 1) event.preventDefault();
});
document.addEventListener("keydown", event => {
	switch (event.key) {
		case "Escape":
			// console.log(store.getState("isPopUp"));
			if (store.getState("isPopUp")) {
				popup.close.click();
				break;
			} else {
				popup.open("Upozorenje", "Da li stvarno zelite da izadjete?", () => {
					ipcRenderer.send("app:exit");
				});
			}
			break;
		case "Enter":
			if (store.getState("isPopUp")) {
				popup.confirm.click();
				break;
			}
			break;
		case "1":
			window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "main0.html";
			break;
		case "2":
			window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "main1.html";
			break;
		default:
			break;
	}
});
