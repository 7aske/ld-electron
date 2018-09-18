"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
window.process = process || {};
const ENV = window.process.type == 'renderer' ? 'electron' : 'web';
const Employee_1 = require("../scripts/Employee");
const Menu_1 = require("../scripts/Menu");
const Modal_1 = require("../scripts/Modal");
const Store_1 = require("../scripts/Store");
const Resizer_1 = require("../scripts/Resizer");
const axios_1 = require("axios");
const templates_1 = require("../scripts/templates");
const initialState = {
    employeeArray: [],
    employeeList: [],
    currentEmployee: null,
    isAsideOut: false,
    isModalUp: false,
    asideWidth: 400,
    contentWidth: { left: 6, right: 6 },
    isResizingList: false,
    isResizingContent: false,
    newEmployee: null,
    currentIndex: 0
};
const url = ENV == 'electron' ? null : 'http://localhost:3000';
let store = new Store_1.Store(initialState);
let resizer = new Resizer_1.Resizer(store);
let menu = null;
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
store.subscribe('currentEmployee', [populateFields, colorEmployeeList]);
store.subscribe('employeeArray', [populateEmployeeList]);
store.subscribe('employeeList', [populateEmployeeList, colorEmployeeList]);
//const main: HTMLElement = document.querySelector('main');
const modal = new Modal_1.Modal(store);
const employeeList = document.querySelector('#employeeList');
const searchInp = document.querySelector('#searchInp');
searchInp.addEventListener('input', function () {
    searchEmployeeArray(this.value);
});
const saveBtn = document.querySelector('#saveBtn');
saveBtn.addEventListener('click', () => {
    employeeSave(null);
});
const backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', handleBack);
const rejectBtn = document.querySelector('#rejectBtn');
rejectBtn.addEventListener('click', () => {
    employeeReject(store.getState('employeeArray'));
});
const deleteBtn = document.querySelector('#deleteBtn');
deleteBtn.addEventListener('click', () => {
    employeeDelete([store.getState('currentEmployee')]);
});
const fromDateInternal = document.querySelector('#fromDateInternal');
const tillDateInternal = document.querySelector('#tillDateInternal');
const addInternalYoSPeriod = document.querySelector('#addInternalYoSPeriod');
addInternalYoSPeriod.addEventListener('click', function () {
    addYoSPeriod(this.id, fromDateInternal.value, tillDateInternal.value);
});
const fromDateExternal = document.querySelector('#fromDateExternal');
const tillDateExternal = document.querySelector('#tillDateExternal');
const addExternalYoSPeriod = document.querySelector('#addExternalYoSPeriod');
addExternalYoSPeriod.addEventListener('click', function () {
    addYoSPeriod(this.id, fromDateExternal.value, tillDateExternal.value);
});
const addNewBtn = document.querySelector('#addNewBtn');
addNewBtn.addEventListener('click', employeeAdd);
const headerInputs = Array.prototype.slice.call(document.querySelectorAll('header input'));
const mainInputs = Array.prototype.slice.call(document.querySelectorAll('main input'));
const inputs = [...headerInputs, ...mainInputs, document.querySelector('main textarea')];
inputs.forEach(i => {
    i.addEventListener('keyup', function () {
        if (this.id.indexOf('fromDateInternal') == -1 && this.id.indexOf('tillDateInternal') == -1 && this.id.indexOf('fromDateExternal') == -1 && this.id.indexOf('tillDateExternal') == -1)
            handleInput(this.id, this.value, this);
    });
});
function handleBack(event) {
    event.preventDefault();
    let commit = [];
    let text = 'Imate nesacuvane promene.<br>';
    let check = false;
    const array = store.getState('employeeArray');
    array.forEach(e => {
        if (Object.keys(e.changes).length > 0) {
            check = true;
            commit.push(e);
        }
    });
    commit.forEach(e => {
        text += templates_1.employeeSummaryTemplate(e);
    });
    if (check) {
        modal.open('Obevestenje', text, () => {
            employeeSave(commit, true);
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'mainMenu.html';
        });
    }
    else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'mainMenu.html';
    }
}
function changeListIndex(num) {
    let index = store.getState('currentIndex');
    const employees = store.getState('employeeArray');
    index += num;
    if (index > employees.length || index < 0)
        index -= num;
    store.setState('currentIndex', index);
    const employee = employees[index];
    if (employee)
        store.setState('currentEmployee', employee);
}
function changeInputIndex() {
    const tabs = Array.prototype.slice.call(document.querySelectorAll('[name="tabs"]'));
    const input = document.activeElement;
    let index = inputs.indexOf(input);
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
function handleInput(prop, value, target) {
    if (prop == 'umcn') {
        const employees = store.getState('employeeArray');
        employees.forEach(e => {
            if (e.properties.umcn == value && store.getState('currentEmployee').properties.umcn != value) {
                modal.open('Greska', `Vec postoji radnik sa tim JMBG. ${templates_1.employeeSummaryTemplate(e)}`);
                value = value.substring(0, target.value.length - 1);
            }
        });
    }
    const employee = store.getState('currentEmployee');
    if (employee) {
        if (value == employee.properties[prop]) {
            delete employee.changes[prop];
            store.setState('currentEmployee', employee);
        }
        else {
            employee.changes[prop] = value;
            store.setState('currentEmployee', employee);
        }
    }
}
function addYoSPeriod(type, from, till) {
    if (till != '' && type != '') {
        const employee = store.getState('currentEmployee');
        if (type == 'addExternalYoSPeriod') {
            if (employee) {
                employee.addExternalYoS(parseInt(from), parseInt(till));
                store.setState('currentEmployee', employee);
            }
            else {
                alert('Izaberite radnika');
            }
        }
        else if (type == 'addInternalYoSPeriod') {
            if (employee) {
                employee.addInternalYoS(parseInt(from), parseInt(till));
                store.setState('currentEmployee', employee);
            }
            else {
                alert('Izaberite radnika');
            }
        }
    }
    else {
        modal.open('Greska', 'Neispravan datum');
    }
}
function populateFields() {
    const employee = store.getState('currentEmployee');
    if (employee)
        employee.populate();
}
function colorEmployeeList() {
    const currentEmployee = store.getState('currentEmployee');
    const listItems = Array.prototype.slice.call(document.querySelectorAll('#employeeList li'));
    const employees = store.getState('employeeList');
    employees.forEach(e => {
        const item = document.querySelector(`[data-id="${e.properties._id}"]`);
        const badge = item.lastElementChild;
        if (Object.keys(e.changes).length > 0) {
            if (item)
                item.classList.add('list-group-item-warning');
            if (badge)
                badge.innerHTML = Object.keys(e.changes).length.toString();
        }
        else {
            if (item)
                item.classList.remove('list-group-item-warning');
            if (badge)
                badge.innerHTML = '';
        }
    });
    listItems.forEach(item => {
        if (searchInp.value != '') {
            let q = searchInp.value;
            item.firstElementChild.innerHTML = highlight(item.firstElementChild.innerHTML, q);
        }
        if (item.attributes.getNamedItem('data-id'))
            if (item.attributes.getNamedItem('data-id').value == currentEmployee.properties._id)
                item.classList.add('list-group-item-dark');
            else
                item.classList.remove('list-group-item-dark');
    });
}
function highlight(text, string) {
    text = text.trim();
    const q = string.split(' ');
    if (q.length == 1) {
        const p = new RegExp(`<span class="bg-warning">.*?<\/span>`, 'gi');
        const r = new RegExp(q[0], 'gi');
        if (text.match(p)) {
            let arr = text.split(p);
            let result = [];
            let old = text.match(p);
            arr.forEach((t, i) => {
                const matches = t.match(r);
                let arr = t.split(r);
                if (matches) {
                    matches.forEach((m, i) => {
                        const replacement = `<span class="bg-warning">${m}</span>`;
                        arr.splice(i == 0 ? i + 1 : i * 2 + 1, 0, replacement);
                    });
                    t = arr.join('');
                    result.push(t);
                }
                else {
                    result.push(t);
                }
            });
            result.forEach((r, i) => {
                if (i != result.length - 1)
                    result.splice(i == 0 ? i + 1 : i * 2 + 1, 0, old[i]);
            });
            return result.length > 0 ? result.join('') : text;
        }
        else {
            const matches = text.match(r);
            let arr = text.split(r);
            if (matches) {
                matches.forEach((m, i) => {
                    const replacement = `<span class="bg-warning">${m}</span>`;
                    arr.splice(i == 0 ? i + 1 : i * 2 + 1, 0, replacement);
                });
                text = arr.join('');
            }
            return text;
        }
    }
    else {
        q.forEach(query => {
            if (query != '')
                text = highlight(text, query);
        });
        return text;
    }
}
function populateEmployeeList() {
    let result = '';
    employeeList.innerHTML = '';
    const employees = store.getState('employeeList');
    employees.forEach(e => {
        result += templates_1.optionTemplate(e);
    });
    employeeList.innerHTML = result;
    const listItems = Array.prototype.slice.call(document.querySelectorAll('aside li'));
    listItems.forEach(item => {
        const employees = store.getState('employeeArray');
        const employee = employees.find(e => {
            return e.properties._id == item.attributes.getNamedItem('data-id').value;
        });
        item.addEventListener('contextmenu', event => {
            menu = new Menu_1.Menu(event, [
                {
                    name: 'Sacuvaj',
                    action: () => employeeSave([employee]),
                    disabled: Object.keys(employee.changes).length == 0
                },
                {
                    name: 'Odbaci',
                    action: () => employeeReject([employee]),
                    disabled: Object.keys(employee.changes).length == 0
                },
                {
                    name: 'Obrisi',
                    type: 'danger',
                    action: () => employeeDelete([employee]),
                    disabled: false
                }
            ]);
        });
    });
}
function searchEmployeeArray(query) {
    let unique = (arrArg) => {
        return arrArg.filter((elem, pos, arr) => {
            return arr.indexOf(elem) == pos;
        });
    };
    let search = (arr, query) => {
        const r = new RegExp(query, 'gi');
        return arr.filter(e => {
            const c = e.properties;
            return r.test(c.id) || r.test(c.umcn) || r.test(c.firstName) || r.test(c.lastName);
        });
    };
    const q = query.split(' ');
    let result = store.getState('employeeArray');
    q.forEach(query => {
        if (search(result, query).length == 0) {
            for (let i = query.length - 1; i >= 0; i--) {
                if (search(result, query.substring(0, i)).length == 0)
                    continue;
                else
                    result = search(result, query.substring(0, i));
            }
        }
        else {
            result = search(result, query);
        }
    });
    store.setState('employeeList', result);
}
function changeCurrentEmployee() {
    let btn = event.target;
    console.log(btn.nodeName);
    let _id = btn.attributes.getNamedItem('data-id').value;
    const employees = store.getState('employeeArray');
    const employee = employees.find(e => {
        return e.properties._id == _id;
    });
    if (employee)
        store.setState('currentEmployee', employee);
}
function employeeAdd() {
    if (!store.getState('newEmployee')) {
        const newEmployee = new Employee_1.Employee(null);
        const newEmployeeArray = store.getState('employeeArray');
        newEmployeeArray.push(newEmployee);
        store.setState('newEmployee', newEmployee);
        store.setState('employeeArray', newEmployeeArray);
        store.setState('currentEmployee', newEmployee);
    }
}
function employeeReject(array) {
    const employees = array ? array : store.getState('employeeArray');
    let text = 'Da li zelite da odbacite sve promene?<br>';
    let employeesToReject = [];
    employees.forEach(employee => {
        if (Object.keys(employee.changes).length > 0) {
            employeesToReject.push(employee);
            text += templates_1.employeeSummaryTemplate(employee);
        }
    });
    if (employeesToReject.length > 0) {
        modal.open('Upozorenje', text, () => {
            employeesToReject.forEach((employee, i) => {
                const keys = Object.keys(employee.changes);
                if (keys.length > 0) {
                    keys.forEach(k => {
                        delete employee.changes[k];
                    });
                }
                store.setState('currentEmployee', employeesToReject[i]);
            });
            store.setState('employeeArray', store.getState('employeeArray'));
            store.setState('currentEmployee', store.getState('employeeArray')[0]);
        });
    }
    else {
        modal.open('Obavestenje', 'Nema trenutnih promena.');
    }
}
function employeeDelete(employeesToDelete) {
    if (employeesToDelete.length > 0) {
        let text = 'Da li ste sigurni da zelite da obrisete ove unose?';
        employeesToDelete.forEach(e => {
            text += templates_1.employeeSummaryTemplate(e);
        });
        modal.open('Upozorenje', text, () => {
            let toDelete = [];
            employeesToDelete.forEach(employee => {
                const employees = store.getState('employeeArray');
                const newEmployee = store.getState('newEmployee');
                employees.splice(employees.indexOf(employee), 1);
                store.setState('employeeArray', employees);
                if (employees.length > 0) {
                    store.setState('currentEmployee', employees[0]);
                }
                if (newEmployee) {
                    if (newEmployee.properties._id == employee.properties._id)
                        store.setState('newEmployee', null);
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
        let save = [];
        array.forEach(e => {
            e.commitChanges();
            save.push(e.properties);
        });
        store.setState('newEmployee', null);
        employeeSaveHandler(save);
    }
    else {
        let commit = [];
        let check = false;
        const employees = array ? array : store.getState('employeeArray');
        employees.forEach(e => {
            if (Object.keys(e.changes).length > 0) {
                check = true;
            }
        });
        if (check) {
            let text = '';
            employees.forEach(e => {
                if (Object.keys(e.changes).length > 0) {
                    text += templates_1.employeeSummaryTemplate(e);
                    commit.push(e);
                }
            });
            modal.open('Da li zelite da sacuvate sve promene?', text, () => {
                let save = [];
                commit.forEach(e => {
                    e.commitChanges();
                    save.push(e.properties);
                });
                store.setState('newEmployee', null);
                employeeSaveHandler(save);
            });
        }
        else {
            modal.open('Obavestenje', 'Nema izmena');
        }
    }
}
function setEmployees(data) {
    const array = [];
    if (data instanceof Array) {
        data.forEach(e => {
            array.push(new Employee_1.Employee(e));
        });
        store.setState('currentEmployee', array[0]);
        store.setState('employeeArray', array);
        store.setState('employeeList', array);
    }
}
window.onload = () => {
    employeeGetHandler();
};
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'Escape':
            if (store.getState('isModalUp'))
                modal.buttons.close.click();
            break;
        case 'Enter':
            if (store.getState('isModalUp'))
                modal.buttons.confirm.click();
            else {
                changeInputIndex();
            }
            break;
        case 'PageUp':
            changeListIndex(-1);
            break;
        case 'PageDown':
            changeListIndex(1);
            break;
        default:
    }
});
document.addEventListener('contextmenu', event => { });
function employeeGetHandler() {
    console.log(ENV == 'electron');
    if (ENV == 'electron') {
        setEmployees(electron_1.ipcRenderer.sendSync('employee:get', null));
    }
    else {
        axios_1.default
            .get(`${url}/employees`)
            .then(response => {
            console.log(response.data);
            setEmployees(response.data);
        })
            .catch(err => console.log(err));
    }
}
function employeeDeleteHandler(employees) {
    if (ENV == 'electron') {
        const result = electron_1.ipcRenderer.sendSync('employee:delete', employees);
        setEmployees(result);
    }
    else {
        axios_1.default
            .post(`${url}/employees/delete`, { employees: employees })
            .then(response => {
            console.log(response.data);
            setEmployees(response.data);
        })
            .catch(err => console.log(err));
    }
}
function employeeSaveHandler(save) {
    if (ENV == 'electron') {
        setEmployees(electron_1.ipcRenderer.sendSync('employee:save', save));
    }
    else {
        axios_1.default
            .post(`${url}/employees/save`, { save: save })
            .then(response => {
            console.log(response.data);
            setEmployees(response.data);
        })
            .catch(err => console.log(err));
    }
}
