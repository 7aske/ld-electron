"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
window.process = process || {};
const ENV = window.process.type == 'renderer' ? 'electron' : 'web';
const Store_1 = require("../scripts/Store");
const Resizer_1 = require("../scripts/Resizer");
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
let store = new Store_1.Store(initialState);
let resizer = new Resizer_1.Resizer(store);
function asideToggleWrapper() {
    resizer.asideToggle();
}
function positionResizeBarsWrapper() {
    resizer.positionResizeBars();
}
function handleResizeContentWrapper() {
    resizer.handleResizeContent();
}
store.subscribe('isAsideOut', [asideToggleWrapper, positionResizeBarsWrapper]);
store.subscribe('asideWidth', [positionResizeBarsWrapper]);
store.subscribe('contentWidth', [handleResizeContentWrapper, positionResizeBarsWrapper]);
