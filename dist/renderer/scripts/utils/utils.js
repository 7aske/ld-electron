"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addStyleSheet(rules) {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.append(style);
    for (var i = 0; i < rules.length; i++) {
        style.sheet.insertRule(rules[i], i);
    }
}
exports.addStyleSheet = addStyleSheet;
function initBackdrop(id) {
    var bd = document.createElement("div");
    bd.id = id;
    document.body.appendChild(bd);
    return bd;
}
exports.initBackdrop = initBackdrop;
