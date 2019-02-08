"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function employeeData(e) {
    return "<tr>\n\t\t<td>\n\t\t\t" + e.id + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.umcn + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.firstName + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.lastName + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.hours + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.percentage + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.coefficient1 + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.amount + "\n\t\t</td>\n\t</tr>";
}
var employees = document.store.getState("employeeArray");
var modalBody = document.querySelector("#modal .card-body");
var table = document.createElement("table");
table.classList.add("w-100");
table.innerHTML += "<tr><th>ID</th><th>Mat. Br.</th><th>Ime</th><th>Prezime</th><th>Sati</th><th>Procenat</th><th>Koef.</th><th>Iznos</th></tr>";
employees.forEach(function (e) {
    table.innerHTML += employeeData(e.properties);
});
modalBody.appendChild(table);
document.querySelectorAll("table th").forEach(function (e) { return e.classList.add("text-center"); });
