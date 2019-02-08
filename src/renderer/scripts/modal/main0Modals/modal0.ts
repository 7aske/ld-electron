import { EmployeeProperties } from "../../../../@types";
import { Employee } from "../../models/Employee";

function employeeData(e: EmployeeProperties) {
	return `<tr>
		<td>
			${e.id}
		</td>
		<td>
			${e.umcn}
		</td>
		<td>
			${e.firstName}
		</td>
		<td>
			${e.lastName}
		</td>
		<td>
			${e.hours}
		</td>
		<td>
			${e.percentage}
		</td>
		<td>
			${e.coefficient1}
		</td>
		<td>
			${e.amount}
		</td>
	</tr>`;
}

const employees: Employee[] = document.store.getState("employeeArray");
const modalBody = document.querySelector("#modal .card-body");
const table = document.createElement("table");
table.classList.add("w-100");
table.innerHTML += `<tr><th>ID</th><th>Mat. Br.</th><th>Ime</th><th>Prezime</th><th>Sati</th><th>Procenat</th><th>Koef.</th><th>Iznos</th></tr>`;
employees.forEach(e => {
	table.innerHTML += employeeData(e.properties);
});
modalBody.appendChild(table);
document.querySelectorAll("table th").forEach(e => e.classList.add("text-center"));
