"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function employeeData(e) {
    return "<tr>\n\t\t<td>\n\t\t\t" + e.id + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.umcn + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.firstName + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.lastName + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.hours + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.percentage + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.coefficient1 + "\n\t\t</td>\n\t\t<td>\n\t\t\t" + e.amount + "\n\t\t</td>\n\t</tr>";
}
var employees = document.store.getState("employeeArray");
var modalBody = document.querySelector("#modal .card-body");
modalBody.appendChild(document.createElement("table"));
modalBody.children[0].classList.add("w-100");
modalBody.children[0].innerHTML += "<tr><th>ID</th><th>Mat. Br.</th><th>Ime</th><th>Prezime</th><th>Sati</th><th>Procenat</th><th>Koef.</th><th>Iznos</th></tr>";
employees.forEach(function (e) {
    modalBody.children[0].innerHTML += employeeData(e.properties);
});
