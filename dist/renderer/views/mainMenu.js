"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var Store_1 = require("../scripts/store/Store");
var PopupDialog_1 = require("../scripts/utils/PopupDialog");
var store = new Store_1.Store({});
var popup = new PopupDialog_1.PopupDialog(store);
document.addEventListener("mouseup", function (event) {
    if (event.button === 1)
        event.preventDefault();
});
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "Escape":
            // console.log(store.getState("isPopUp"));
            if (store.getState("isPopUp")) {
                popup.close.click();
                break;
            }
            else {
                popup.open("Upozorenje", "Da li stvarno zelite da izadjete?", function () {
                    electron_1.ipcRenderer.send("app:exit");
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
