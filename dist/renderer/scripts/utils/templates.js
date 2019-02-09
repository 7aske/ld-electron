"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dateListTemplate(f, t) {
    var from = new Date(f);
    var till = new Date(t);
    return "<div class=\"list-group-item p-2 text-left\">" + from.getDate() + "/" + (from.getMonth() + 1) + "/" + from.getFullYear() + " - " + till.getDate() + "/" + (till.getMonth() + 1) + "/" + till.getFullYear() + "</div>";
}
exports.dateListTemplate = dateListTemplate;
function dateTemplate(date) {
    return date.getDate() - 1 + " dana " + date.getMonth() + " meseci " + (date.getFullYear() - 1970) + " godina";
}
exports.dateTemplate = dateTemplate;
function optionTemplate(e) {
    return "<li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n\tonclick=\"changeCurrentEmployee()\"\n\tdata-id=\"" + e.properties._id + "\"><div style=\"pointer-events:none\">\n\t" + e.properties.id + " - " + e.properties.umcn + " - " + e.properties.lastName + " " + e.properties.firstName + "</div>\n\t<span data-id=\"" + e.properties._id + "\" class=\"badge badge-warning badge-pill\"></span></li>";
}
exports.optionTemplate = optionTemplate;
function employeeSummaryTemplate(e) {
    var id = e.changes.id ? e.changes.id : e.properties.id;
    var umcn = e.changes.umcn ? e.changes.umcn : e.properties.umcn;
    var firstName = e.changes.firstName ? e.changes.firstName : e.properties.firstName;
    var lastName = e.changes.lastName ? e.changes.lastName : e.properties.lastName;
    var changes = Object.keys(e.changes).length;
    return "<div class=\"list-group-item d-flex justify-content-between align-items-center\">\n\t" + id + " - " + umcn + " - " + lastName + " " + firstName + "\n\t<span class=\"badge badge-warning badge-pill\">" + changes + "</span></div>";
}
exports.employeeSummaryTemplate = employeeSummaryTemplate;
function calcSummaryTemplate(c) {
    return "";
}
exports.calcSummaryTemplate = calcSummaryTemplate;
function openCalculationTemplate() {
    return "<li class=\"pr-2 pl-2 list-group-item bg-warning d-flex justify-content-between align-items-center\">\n\t\t\t\t<div class=\"lastOpen-mgod\">M-God</div>\n\t\t\t\t<div class=\"lastOpen-code\">Sifra</div>\n\t\t\t\t<div class=\"lastOpen-name\">Naziv obracuna</div>\n\t\t\t\t<div class=\"lastOpen-date\">Datum</div>\n\t\t\t\t<div class=\"lastOpen-badge\"><span class=\"badge badge-primary badge-pill\">T</span></div>\n\t\t\t</li>";
}
exports.openCalculationTemplate = openCalculationTemplate;
