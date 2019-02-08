"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// ts fix
window.process = process || {};
var ENV = window.process.type == "renderer" ? "electron" : "web";
var axios_1 = __importDefault(require("axios"));
var Resizer_1 = require("../scripts/layout/Resizer");
var Modal_1 = require("../scripts/modal/Modal");
var Employee_1 = require("../scripts/models/Employee");
var Store_1 = require("../scripts/store/Store");
var Menu_1 = require("../scripts/utils/Menu");
var PopupDialog_1 = require("../scripts/utils/PopupDialog");
var templates_1 = require("../scripts/utils/templates");
var initialState = {
    employeeArray: [],
    employeeList: [],
    currentEmployee: null,
    newEmployee: null,
    currentIndex: 0
};
var url = ENV == "electron" ? null : "http://localhost:3000";
var store = new Store_1.Store(initialState);
document.store = store;
var resizer = new Resizer_1.Resizer(store, true);
var menu = null;
var modal = new Modal_1.Modal(store);
store.subscribe("currentEmployee", [populateFields, colorEmployeeList]);
store.subscribe("employeeArray", [populateEmployeeList]);
store.subscribe("employeeList", [populateEmployeeList, colorEmployeeList]);
// const main: HTMLElement = document.querySelector('main');
var popup = new PopupDialog_1.PopupDialog(store);
var employeeList = document.querySelector("#employeeList");
var searchInp = document.querySelector("#searchInp");
searchInp.addEventListener("input", function () {
    searchEmployeeArray(this.value);
});
var moreBtn = document.querySelector("#moreBtn");
moreBtn.addEventListener("click", function () {
    modal.open("Lista zapolsenih");
    modal.runScripts("../scripts/modal/main0Modals/modal0.js");
});
var saveBtn = document.querySelector("#saveBtn");
saveBtn.addEventListener("click", function () {
    employeeSave(null);
});
var backBtn = document.querySelector("#backBtn");
backBtn.addEventListener("click", handleBack);
var rejectBtn = document.querySelector("#rejectBtn");
rejectBtn.addEventListener("click", function () {
    employeeReject(store.getState("employeeArray"));
});
var deleteBtn = document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click", function () {
    employeeDelete([store.getState("currentEmployee")]);
});
var fromDateInternal = document.querySelector("#fromDateInternal");
var tillDateInternal = document.querySelector("#tillDateInternal");
var addInternalYoSPeriod = document.querySelector("#addInternalYoSPeriod");
addInternalYoSPeriod.addEventListener("click", function () {
    addYoSPeriod(this.id, fromDateInternal.value, tillDateInternal.value);
});
var fromDateExternal = document.querySelector("#fromDateExternal");
var tillDateExternal = document.querySelector("#tillDateExternal");
var addExternalYoSPeriod = document.querySelector("#addExternalYoSPeriod");
addExternalYoSPeriod.addEventListener("click", function () {
    addYoSPeriod(this.id, fromDateExternal.value, tillDateExternal.value);
});
var addNewBtn = document.querySelector("#addNewBtn");
addNewBtn.addEventListener("click", employeeAdd);
var headerInputs = document.querySelectorAll("header input");
var mainInputs = document.querySelectorAll("main input");
var inputs = __spread(headerInputs, mainInputs, [document.querySelector("main textarea")]);
inputs.forEach(function (i) {
    i.addEventListener("keyup", function () {
        if (this.id.indexOf("fromDateInternal") == -1 && this.id.indexOf("tillDateInternal") == -1 && this.id.indexOf("fromDateExternal") == -1 && this.id.indexOf("tillDateExternal") == -1)
            handleInput(this.id, this.value, this);
    });
});
function handleBack(event) {
    event.preventDefault();
    var commit = [];
    var text = "Imate nesacuvane promene.\n";
    var check = false;
    var array = store.getState("employeeArray");
    array.forEach(function (e) {
        if (Object.keys(e.changes).length > 0) {
            check = true;
            commit.push(e);
        }
    });
    commit.forEach(function (e) {
        text += templates_1.employeeSummaryTemplate(e);
    });
    if (check) {
        popup.open("Obevestenje", text, function () {
            employeeSave(commit, true);
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
        });
    }
    else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "mainMenu.html";
    }
}
function changeListIndex(num) {
    var index = store.getState("currentIndex");
    var employees = store.getState("employeeArray");
    index += num;
    if (index > employees.length || index < 0)
        index -= num;
    store.setState("currentIndex", index);
    var employee = employees[index];
    if (employee)
        store.setState("currentEmployee", employee);
}
function changeInputIndex() {
    var tabs = document.querySelectorAll("[name=\"tabs\"]");
    var input = document.activeElement;
    var index = inputs.indexOf(input);
    if (index == 16) {
        tabs.forEach(function (t) { return t.checked == false; });
        tabs[0].checked = true;
        index = 19;
    }
    if (index == 39) {
        tabs.forEach(function (t) { return t.checked == false; });
        tabs[1].checked = true;
        index = 39;
    }
    if (index == 51) {
        tabs.forEach(function (t) { return t.checked == false; });
        tabs[2].checked = true;
        index = 51;
    }
    if (index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
}
function handleInput(prop, value, target) {
    if (prop == "umcn") {
        var employees = store.getState("employeeArray");
        employees.forEach(function (e) {
            if (e.properties.umcn == value && store.getState("currentEmployee").properties.umcn != value) {
                popup.open("Greska", "Vec postoji radnik sa tim JMBG. " + templates_1.employeeSummaryTemplate(e));
                value = value.substring(0, target.value.length - 1);
            }
        });
    }
    var employee = store.getState("currentEmployee");
    if (employee) {
        if (value == employee.properties[prop]) {
            delete employee.changes[prop];
            store.setState("currentEmployee", employee);
        }
        else {
            employee.changes[prop] = value;
            store.setState("currentEmployee", employee);
        }
    }
}
function addYoSPeriod(type, f, t) {
    if (t != "" && type != "") {
        var employee = store.getState("currentEmployee");
        if (type == "addExternalYoSPeriod") {
            if (employee) {
                employee.addExternalYoS(new Date(f).getTime(), new Date(t).getTime());
                store.setState("currentEmployee", employee);
            }
            else {
                alert("Izaberite radnika");
            }
        }
        else if (type == "addInternalYoSPeriod") {
            if (employee) {
                employee.addInternalYoS(new Date(f).getTime(), new Date(t).getTime());
                store.setState("currentEmployee", employee);
            }
            else {
                alert("Izaberite radnika");
            }
        }
    }
    else {
        popup.open("Greska", "Neispravan datum");
    }
}
function populateFields() {
    var employee = store.getState("currentEmployee");
    if (employee)
        employee.populate();
}
function colorEmployeeList() {
    var currentEmployee = store.getState("currentEmployee");
    var listItems = Array.prototype.slice.call(document.querySelectorAll("#employeeList li"));
    var employees = store.getState("employeeList");
    employees.forEach(function (e) {
        var item = document.querySelector("[data-id=\"" + e.properties._id + "\"]");
        var badge = item.lastElementChild;
        if (Object.keys(e.changes).length > 0) {
            if (item)
                item.classList.add("list-group-item-warning");
            if (badge)
                badge.innerHTML = Object.keys(e.changes).length.toString();
        }
        else {
            if (item)
                item.classList.remove("list-group-item-warning");
            if (badge)
                badge.innerHTML = "";
        }
    });
    listItems.forEach(function (item) {
        if (searchInp.value != "") {
            item.firstElementChild.innerHTML = highlight(item.firstElementChild.innerHTML, searchInp.value);
        }
        if (item.attributes.getNamedItem("data-id"))
            if (item.attributes.getNamedItem("data-id").value == currentEmployee.properties._id)
                item.classList.add("list-group-item-dark");
            else
                item.classList.remove("list-group-item-dark");
    });
}
function highlight(text, string) {
    text = text.trim();
    var q = string.split(" ");
    if (q.length == 1) {
        var p = new RegExp("<span class=\"bg-warning\">.*?</span>", "gi");
        var res_1 = new RegExp(q[0], "gi");
        if (text.match(p)) {
            var arr = text.split(p);
            var result_1 = [];
            var old_1 = text.match(p);
            arr.forEach(function (t) {
                var matches = t.match(res_1);
                var arr2 = t.split(res_1);
                if (matches) {
                    matches.forEach(function (m, i2) {
                        var replacement = "<span class=\"bg-warning\">" + m + "</span>";
                        arr2.splice(i2 == 0 ? i2 + 1 : i2 * 2 + 1, 0, replacement);
                    });
                    t = arr2.join("");
                    result_1.push(t);
                }
                else {
                    result_1.push(t);
                }
            });
            result_1.forEach(function (r, i) {
                if (i != result_1.length - 1)
                    result_1.splice(i == 0 ? i + 1 : i * 2 + 1, 0, old_1[i]);
            });
            return result_1.length > 0 ? result_1.join("") : text;
        }
        else {
            var matches = text.match(res_1);
            var arr_1 = text.split(res_1);
            if (matches) {
                matches.forEach(function (m, i) {
                    var replacement = "<span class=\"bg-warning\">" + m + "</span>";
                    arr_1.splice(i == 0 ? i + 1 : i * 2 + 1, 0, replacement);
                });
                text = arr_1.join("");
            }
            return text;
        }
    }
    else {
        q.forEach(function (query) {
            if (query != "")
                text = highlight(text, query);
        });
        return text;
    }
}
function populateEmployeeList() {
    var result = "";
    employeeList.innerHTML = "";
    var employees = store.getState("employeeList");
    employees.forEach(function (e) {
        result += templates_1.optionTemplate(e);
    });
    employeeList.innerHTML = result;
    var listItems = document.querySelectorAll("aside li");
    listItems.forEach(function (item) {
        var listEmployees = store.getState("employeeArray");
        var employee = listEmployees.find(function (e) {
            return e.properties._id == item.attributes.getNamedItem("data-id").value;
        });
        item.addEventListener("contextmenu", function (event) {
            menu = new Menu_1.Menu(event, [
                {
                    name: "Sacuvaj",
                    action: function () { return employeeSave([employee]); },
                    disabled: Object.keys(employee.changes).length == 0
                },
                {
                    name: "Odbaci",
                    action: function () { return employeeReject([employee]); },
                    disabled: Object.keys(employee.changes).length == 0
                },
                {
                    name: "Obrisi",
                    type: "danger",
                    action: function () { return employeeDelete([employee]); },
                    disabled: false
                }
            ]);
        });
    });
}
function searchEmployeeArray(query) {
    var unique = function (arrArg) {
        return arrArg.filter(function (elem, pos, arr) {
            return arr.indexOf(elem) == pos;
        });
    };
    var search = function (arr, q1) {
        var r = new RegExp(q1, "gi");
        return arr.filter(function (e) {
            var c = e.properties;
            return r.test(c.id) || r.test(c.umcn) || r.test(c.firstName) || r.test(c.lastName);
        });
    };
    var q = query.split(" ");
    var result = store.getState("employeeArray");
    q.forEach(function (q2) {
        if (search(result, q2).length == 0) {
            for (var i = q2.length - 1; i >= 0; i--) {
                result = search(result, q2.substring(0, i));
            }
        }
        else {
            result = search(result, q2);
        }
    });
    store.setState("employeeList", result);
}
function changeCurrentEmployee() {
    var btn = event.target;
    console.log(btn.nodeName);
    var _id = btn.attributes.getNamedItem("data-id").value;
    var employees = store.getState("employeeArray");
    var employee = employees.find(function (e) {
        return e.properties._id == _id;
    });
    if (employee)
        store.setState("currentEmployee", employee);
}
function employeeAdd() {
    if (!store.getState("newEmployee")) {
        var newEmployee = new Employee_1.Employee(null);
        var newEmployeeArray = store.getState("employeeArray");
        newEmployeeArray.push(newEmployee);
        store.setState("newEmployee", newEmployee);
        store.setState("employeeArray", newEmployeeArray);
        store.setState("currentEmployee", newEmployee);
    }
}
function employeeReject(array) {
    var employees = array ? array : store.getState("employeeArray");
    var text = "Da li zelite da odbacite sve promene?\n";
    var employeesToReject = [];
    employees.forEach(function (employee) {
        if (Object.keys(employee.changes).length > 0) {
            employeesToReject.push(employee);
            text += templates_1.employeeSummaryTemplate(employee);
        }
    });
    if (employeesToReject.length > 0) {
        popup.open("Upozorenje", text, function () {
            employeesToReject.forEach(function (employee, i) {
                var keys = Object.keys(employee.changes);
                if (keys.length > 0) {
                    keys.forEach(function (k) {
                        delete employee.changes[k];
                    });
                }
                store.setState("currentEmployee", employeesToReject[i]);
            });
            store.setState("employeeArray", store.getState("employeeArray"));
            store.setState("currentEmployee", store.getState("employeeArray")[0]);
        });
    }
    else {
        popup.open("Obavestenje", "Nema trenutnih promena.");
    }
}
function employeeDelete(employeesToDelete) {
    if (employeesToDelete.length > 0) {
        var text_1 = "Da li ste sigurni da zelite da obrisete ove unose?";
        employeesToDelete.forEach(function (e) {
            text_1 += templates_1.employeeSummaryTemplate(e);
        });
        popup.open("Upozorenje", text_1, function () {
            var toDelete = [];
            employeesToDelete.forEach(function (employee) {
                var employees = store.getState("employeeArray");
                var newEmployee = store.getState("newEmployee");
                employees.splice(employees.indexOf(employee), 1);
                store.setState("employeeArray", employees);
                if (employees.length > 0) {
                    store.setState("currentEmployee", employees[0]);
                }
                if (newEmployee) {
                    if (newEmployee.properties._id == employee.properties._id)
                        store.setState("newEmployee", null);
                }
                else {
                    toDelete.push(employee.properties);
                }
            });
            employeeDeleteHandler(toDelete);
        });
    }
}
function employeeSave(array, skipModal) {
    if (skipModal) {
        var save_1 = [];
        array.forEach(function (e) {
            e.commitChanges();
            save_1.push(e.properties);
        });
        store.setState("newEmployee", null);
        employeeSaveHandler(save_1);
    }
    else {
        var commit_1 = [];
        var check_1 = false;
        var employees = array ? array : store.getState("employeeArray");
        employees.forEach(function (e) {
            if (Object.keys(e.changes).length > 0) {
                check_1 = true;
            }
        });
        if (check_1) {
            var text_2 = "";
            employees.forEach(function (e) {
                if (Object.keys(e.changes).length > 0) {
                    text_2 += templates_1.employeeSummaryTemplate(e);
                    commit_1.push(e);
                }
            });
            popup.open("Da li zelite da sacuvate sve promene?", text_2, function () {
                var save = [];
                commit_1.forEach(function (e) {
                    e.commitChanges();
                    save.push(e.properties);
                });
                store.setState("newEmployee", null);
                employeeSaveHandler(save);
            });
        }
        else {
            popup.open("Obavestenje", "Nema izmena");
        }
    }
}
function setEmployees(data) {
    var array = [];
    if (data instanceof Array) {
        data.forEach(function (e) {
            array.push(new Employee_1.Employee(e));
        });
        store.setState("currentEmployee", array[0]);
        store.setState("employeeArray", array);
        store.setState("employeeList", array);
    }
}
window.onload = function () {
    employeeGetHandler();
};
document.addEventListener("keydown", function (event) {
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
            break;
        case "Enter":
            if (store.getState("isPopUp"))
                popup.confirm.click();
            else {
                changeInputIndex();
            }
            break;
        case "PageUp":
            if (!store.getState("isModalUp")) {
                changeListIndex(-1);
            }
            break;
        case "PageDown":
            if (!store.getState("isModalUp")) {
                changeListIndex(1);
            }
            break;
        default:
    }
});
document.addEventListener("contextmenu", function () {
});
function employeeGetHandler() {
    if (ENV == "electron") {
        setEmployees(electron_1.ipcRenderer.sendSync("employee:get", null));
    }
    else {
        axios_1.default
            .get(url + "/employees")
            .then(function (response) {
            console.log(response.data);
            setEmployees(response.data);
        })
            .catch(function (err) { return console.log(err); });
    }
}
function employeeDeleteHandler(employees) {
    if (ENV == "electron") {
        var result = electron_1.ipcRenderer.sendSync("employee:delete", employees);
        setEmployees(result);
    }
    else {
        axios_1.default
            .post(url + "/employees/delete", { employees: employees })
            .then(function (response) {
            console.log(response.data);
            setEmployees(response.data);
        })
            .catch(function (err) { return console.log(err); });
    }
}
function employeeSaveHandler(save) {
    if (ENV == "electron") {
        setEmployees(electron_1.ipcRenderer.sendSync("employee:save", save));
    }
    else {
        axios_1.default
            .post(url + "/employees/save", { save: save })
            .then(function (response) {
            console.log(response.data);
            setEmployees(response.data);
        })
            .catch(function (err) { return console.log(err); });
    }
}
