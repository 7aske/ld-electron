"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
window.process = process || {};
const ENV = window.process.type == 'renderer' ? 'electron' : 'web';
const Employee_1 = require("../scripts/Employee");
const Menu_1 = require("../scripts/Menu");
const Modal_1 = require("../scripts/Modal");
const Store_1 = require("../scripts/Store");
const axios_1 = require("axios");
const templates_1 = require("../scripts/templates");
const initialState = {
    employeeArray: [],
    employeeList: [],
    currentEmployee: null,
    isAsideOut: false,
    isModalUp: false,
    asideWidth: 400,
    contentWidth: 500,
    isResizingList: false,
    isResizingContent: false,
    newEmployee: null,
    currentIndex: 0
};
const store = new Store_1.Store(initialState);
const main = document.querySelector('main');
let menu = null;
console.log(localStorage.getItem('data'));
const url = ENV == 'electron' ? null : 'http://localhost:3000';
store.subscribe('isAsideOut', [asideToggle, positionResizeBars]);
store.subscribe('currentEmployee', [populateFields, colorEmployeeList]);
store.subscribe('employeeArray', [populateEmployeeList]);
store.subscribe('employeeList', [populateEmployeeList, colorEmployeeList]);
store.subscribe('asideWidth', [positionResizeBars]);
store.subscribe('contentWidth', [handleResizeContent, positionResizeBars]);
const resize0 = document.querySelector('#resize0');
resize0.addEventListener('mousedown', () => store.setState('isResizingList', !store.getState('isResizingList')));
const resize1 = document.querySelector('#resize1');
resize1.addEventListener('mousedown', () => store.setState('isResizingContent', !store.getState('isResizingContent')));
const modal = new Modal_1.Modal(store);
const employeeList = document.querySelector('#employeeList');
const searchInp = document.querySelector('#searchInp');
searchInp.addEventListener('input', function () {
    searchEmployeeArray(this.value);
});
const aside = document.querySelector('aside');
const asideTrigger = document.querySelector('#asideTrigger');
asideTrigger.addEventListener('click', () => {
    store.setState('isAsideOut', !store.getState('isAsideOut'));
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
addNewBtn.addEventListener('click', addNewEmployee);
const headerInputs = Array.prototype.slice.call(document.querySelectorAll('header input'));
const mainInputs = Array.prototype.slice.call(document.querySelectorAll('main input'));
const inputs = [...headerInputs, ...mainInputs, document.querySelector('main textarea')];
inputs.forEach(i => {
    i.addEventListener('keyup', function () {
        if (this.id.indexOf('fromDateInternal') == -1 &&
            this.id.indexOf('tillDateInternal') == -1 &&
            this.id.indexOf('fromDateExternal') == -1 &&
            this.id.indexOf('tillDateExternal') == -1)
            handleInput(this.id, this.value, this);
    });
});
function getWidth() {
    return store.getState('isAsideOut') ? window.innerWidth - store.getState('asideWidth') : window.innerWidth;
}
function handleBack(event) {
    event.preventDefault();
    let commit = [];
    let check = false;
    const array = store.getState('employeeArray');
    array.forEach(e => {
        if (Object.keys(e.changes).length > 0) {
            check = true;
        }
    });
    if (check) {
        modal.open('Obevestenje', 'Imate nesacuvane promene.');
    }
    else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'mainMenu.html';
    }
}
function asideToggle() {
    aside.style.width = `${store.getState('asideWidth')}px`;
    if (store.getState('isAsideOut')) {
        aside.style.left = `0px`;
        asideTrigger.classList.add('active');
    }
    else {
        aside.style.left = `-${store.getState('asideWidth')}px`;
        asideTrigger.classList.remove('active');
    }
    main.style.width = `${getWidth()}px`;
    const config = {
        isAsideOut: store.getState('isAsideOut'),
        contentWidth: store.getState('contentWidth'),
        asideWidth: store.getState('asideWidth')
    };
    settingsUpdateHandler(config);
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
function positionResizeBars() {
    main.style.width = `${getWidth()}px`;
    aside.style.width = `${store.getState('asideWidth')}px`;
    if (store.getState('isAsideOut')) {
        resize0.style.display = 'block';
        resize1.style.left = `${store.getState('asideWidth') + main.firstElementChild.clientWidth + 5}px`;
        resize0.style.left = `${store.getState('asideWidth')}px`;
    }
    else {
        resize0.style.display = 'none';
        resize1.style.left = `${main.firstElementChild.clientWidth + 10}px`;
    }
}
function handleResizeContent() {
    const width = main.offsetWidth;
    const c0 = main.children[0];
    const c1 = main.children[1];
    const mousePos = store.getState('contentWidth');
    const x = mousePos < width / 2 ? Math.round(width / mousePos) : Math.round(width / (width - mousePos));
    const col = mousePos < width / 2 ? Math.round(12 / x) : Math.round(12 / x);
    if (col < 13 && col > -1) {
        let col0 = col;
        let col1 = 12 - col;
        if (mousePos > width / 2) {
            col0 = 12 - col;
            col1 = col;
        }
        if (col == 12 || col == 0) {
            col0 = col1 = 12;
        }
        c0.classList.replace(c0.className.match(/col.+/gi)[0], `col-lg-${col0}`);
        c1.classList.replace(c1.className.match(/col.+/gi)[0], `col-lg-${col1}`);
    }
    //resize1.style.left = `${store.getState('asideWidth') + main.firstElementChild.offsetWidth + 5}px`;
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
        const badge = item.firstElementChild;
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
        if (item.attributes.getNamedItem('data-id'))
            if (item.attributes.getNamedItem('data-id').value == currentEmployee.properties._id)
                item.classList.add('list-group-item-dark');
            else
                item.classList.remove('list-group-item-dark');
    });
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
        item.addEventListener('contextmenu', function (event) {
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
    const employees = store.getState('employeeArray');
    const array = query
        ? employees.filter(e => {
            return (parseInt(e.properties.id) == parseInt(query) ||
                e.properties.umcn.startsWith(query) ||
                e.properties.firstName.startsWith(query) ||
                e.properties.lastName.startsWith(query));
        })
        : employees;
    store.setState('employeeList', array);
}
function changeCurrentEmployee(btn, _id) {
    const employees = store.getState('employeeArray');
    const employee = employees.find(e => {
        return e.properties._id == _id;
    });
    if (employee)
        store.setState('currentEmployee', employee);
}
function addNewEmployee() {
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
function employeeSave(array) {
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
function setSettings(data) {
    for (let key in data) {
        store.setState(key, data[key]);
    }
    setTimeout(() => {
        positionResizeBars();
    }, 100);
}
window.onload = () => {
    employeeGetHandler();
    settingsGetHandler();
};
window.addEventListener('resize', event => {
    positionResizeBars();
});
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
        //console.log(event.key);
    }
});
document.addEventListener('mousemove', event => {
    if (store.getState('isResizingList')) {
        store.setState('asideWidth', event.screenX);
    }
    if (store.getState('isResizingContent')) {
        if (store.getState('isAsideOut')) {
            store.setState('contentWidth', event.screenX - store.getState('asideWidth'));
        }
        else {
            store.setState('contentWidth', event.screenX);
        }
    }
});
document.addEventListener('mouseup', event => {
    if (store.getState('isResizingList') || store.getState('isResizingContent')) {
        const config = {
            isAsideOut: store.getState('isAsideOut'),
            contentWidth: store.getState('contentWidth'),
            asideWidth: store.getState('asideWidth')
        };
        settingsUpdateHandler(config);
    }
    store.setState('isResizingList', false);
    store.setState('isResizingContent', false);
});
document.addEventListener('contextmenu', event => { });
function settingsGetHandler() {
    // if (ENV == 'electron') {
    // 	setSettings(ipcRenderer.sendSync('window:settings-get'));
    // } else {
    // 	axios
    // 		.get(`${url}/config`)
    // 		.then(response => {
    // 			console.log(response.data);
    // 			setSettings(response.data);
    // 		})
    // 		.catch(err => console.log(err));
    //}
    const isAsideOut = localStorage.getItem('isAsideOut') === 'true';
    const contentWidth = parseInt(localStorage.getItem('contentWidth')) || initialState.contentWidth;
    const asideWidth = parseInt(localStorage.getItem('asideWidth')) || initialState.asideWidth;
    const config = {
        isAsideOut: isAsideOut,
        contentWidth: contentWidth,
        asideWidth: asideWidth
    };
    setSettings(config);
}
function settingsUpdateHandler(config) {
    // if (ENV == 'electron') {
    // 	ipcRenderer.sendSync('window:settings-update', config);
    // } else {
    // 	axios
    // 		.post(`${url}/config/update`, { config: config })
    // 		.then(response => {
    // 			console.log(response.data);
    // 			return response.data;
    // 		})
    // 		.catch(err => console.log(err));
    // }
    localStorage.setItem('isAsideOut', config.isAsideOut ? 'true' : 'false');
    localStorage.setItem('contentWidth', config.contentWidth.toString());
    localStorage.setItem('asideWidth', config.asideWidth.toString());
}
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
