"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var electron_1 = require("electron");
var Calc_1 = require("../scripts/models/Calc");
window.process = process || {};
var ENV = window.process.type == "renderer" ? "electron" : "web";
var url = ENV == "electron" ? null : "http://localhost:3000";
var Modal_1 = require("../scripts/utils/Modal");
var Resizer_1 = require("../scripts/utils/Resizer");
var Store_1 = require("../scripts/store/Store");
var templates_1 = require("../scripts/utils/templates");
var initialState = {
    calcArray: [],
    calcList: [],
    currentCalc: null,
    newCalc: null,
    isAsideOut: false,
    isModalUp: false,
    asideWidth: 400,
    contentWidth: { left: 6, right: 6 },
    isResizingList: false,
    isResizingContent: false,
    currentIndex: 0
};
var store = new Store_1.Store(initialState);
var resizer = new Resizer_1.Resizer(store);
var modal = new Modal_1.Modal(store);
var saveBtn = document.querySelector("#saveBtn");
saveBtn.addEventListener("click", function () {
    calcSave(null);
});
var backBtn = document.querySelector("#backBtn");
backBtn.addEventListener("click", handleBack);
var rejectBtn = document.querySelector("#rejectBtn");
rejectBtn.addEventListener("click", function () {
    calcReject(store.getState("calcArray"));
});
var deleteBtn = document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click", function () {
    calcDelete([store.getState("currentCalc")]);
});
function handleBack(event) {
    event.preventDefault();
    var commit = [];
    var text = "Imate nesacuvane promene.<br>";
    var check = false;
    var array = store.getState("calcArray");
    array.forEach(function (e) {
        if (Object.keys(e.changes).length > 0) {
            check = true;
            commit.push(e);
        }
    });
    // TODO: convert to calc
    commit.forEach(function (e) {
        text += "calcSummaryTemplate(e)";
    });
    if (check) {
        modal.open("Obevestenje", text, function () {
            calcSave(commit, true);
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
        });
    }
    else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
    }
}
function setCalc(data) {
    var array = [];
    if (data instanceof Array) {
        data.forEach(function (e) {
            array.push(new Calc_1.Calc(e));
        });
        store.setState("currentCalc", array[0]);
        store.setState("calcArray", array);
        store.setState("calcList", array);
    }
}
function calcDelete(calcsToDelete) {
    if (calcsToDelete.length > 0) {
        var text_1 = "Da li ste sigurni da zelite da obrisete ove unose?";
        calcsToDelete.forEach(function (e) {
            text_1 += templates_1.calcSummaryTemplate(e);
        });
        modal.open("Upozorenje", text_1, function () {
            var toDelete = [];
            calcsToDelete.forEach(function (calc) {
                var calcs = store.getState("calcArray");
                var newCalc = store.getState("newCalc");
                calcs.splice(calcs.indexOf(calc), 1);
                store.setState("calcArray", calcs);
                if (calcs.length > 0) {
                    store.setState("currentCalc", calcs[0]);
                }
                if (newCalc) {
                    if (newCalc.properties.id == calc.properties.id)
                        store.setState("newCalc", null);
                }
                else {
                    toDelete.push(calc.properties);
                }
            });
            calcDeleteHandler(toDelete);
        });
    }
}
function calcReject(array) {
    var calcs = array ? array : store.getState("calcArray");
    var text = "Da li zelite da odbacite sve promene?<br>";
    var calcsToReject = [];
    calcs.forEach(function (calc) {
        if (Object.keys(calc.changes).length > 0) {
            calcsToReject.push(calc);
            text += templates_1.calcSummaryTemplate(calc);
        }
    });
    if (calcsToReject.length > 0) {
        modal.open("Upozorenje", text, function () {
            calcsToReject.forEach(function (calc, i) {
                var keys = Object.keys(calc.changes);
                if (keys.length > 0) {
                    keys.forEach(function (k) {
                        delete calc.changes[k];
                    });
                }
                store.setState("currentCalc", calcsToReject[i]);
            });
            store.setState("calcArray", store.getState("calcArray"));
            store.setState("currentCalc", store.getState("calcArray")[0]);
        });
    }
    else {
        modal.open("Obavestenje", "Nema trenutnih promena.");
    }
}
function calcSave(array, skipModal) {
    if (skipModal) {
        var save_1 = [];
        array.forEach(function (e) {
            e.commitChanges();
            save_1.push(e.properties);
        });
        store.setState("newCalc", null);
        calcSaveHandler(save_1);
    }
    else {
        var commit_1 = [];
        var check_1 = false;
        var calcs = array ? array : store.getState("calcArray");
        calcs.forEach(function (e) {
            if (Object.keys(e.changes).length > 0) {
                check_1 = true;
            }
        });
        if (check_1) {
            var text_2 = "";
            calcs.forEach(function (e) {
                if (Object.keys(e.changes).length > 0) {
                    text_2 += templates_1.calcSummaryTemplate(e);
                    commit_1.push(e);
                }
            });
            modal.open("Da li zelite da sacuvate sve promene?", text_2, function () {
                var save = [];
                commit_1.forEach(function (e) {
                    e.commitChanges();
                    save.push(e.properties);
                });
                store.setState("newCalc", null);
                calcSaveHandler(save);
            });
        }
        else {
            modal.open("Obavestenje", "Nema izmena");
        }
    }
}
function calcGetHandler() {
    console.log(ENV == "electron");
    if (ENV == "electron") {
        setCalc(electron_1.ipcRenderer.sendSync("calc:get", null));
    }
    else {
        axios_1.default
            .get(url + "/calcs")
            .then(function (response) {
            console.log(response.data);
            setCalc(response.data);
        })
            .catch(function (err) { return console.log(err); });
    }
}
function calcDeleteHandler(calcs) {
    if (ENV == "electron") {
        var result = electron_1.ipcRenderer.sendSync("calc:delete", calcs);
        setCalc(result);
    }
    else {
        axios_1.default
            .post(url + "/calcs/delete", { calcs: calcs })
            .then(function (response) {
            console.log(response.data);
            setCalc(response.data);
        })
            .catch(function (err) { return console.log(err); });
    }
}
function calcSaveHandler(save) {
    if (ENV == "electron") {
        setCalc(electron_1.ipcRenderer.sendSync("calc:save", save));
    }
    else {
        axios_1.default
            .post(url + "/calcs/save", { save: save })
            .then(function (response) {
            console.log(response.data);
            setCalc(response.data);
        })
            .catch(function (err) { return console.log(err); });
    }
}
window.onload = function () { return calcGetHandler(); };
