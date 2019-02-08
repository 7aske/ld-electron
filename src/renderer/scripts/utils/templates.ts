import { EmployeeProperties } from "../../../@types";
import { Calc } from "../models/Calc";
import { Employee } from "../models/Employee";

export function dateListTemplate(f: number, t: number): string {
	const from = new Date(f);
	const till = new Date(t);
	return `<div class="list-group-item">${from.getDate()}/${from.getMonth() + 1}/${from.getFullYear()} - ${till.getDate()}/${till.getMonth() + 1}/${till.getFullYear()}</div>`;
}

export function dateTemplate(date: Date) {
	return `${date.getDate() - 1} dana ${date.getMonth()} meseci ${date.getFullYear() - 1970} godina`;
}

export function optionTemplate(e: Employee): string {
	return `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
	onclick="changeCurrentEmployee()"
	data-id="${e.properties._id}"><div style="pointer-events:none">
	${e.properties.id} - ${e.properties.umcn} - ${e.properties.lastName} ${e.properties.firstName}</div>
	<span data-id="${e.properties._id}" class="badge badge-warning badge-pill"></span></li>`;
}

export function employeeSummaryTemplate(e: Employee): string {
	const id = e.changes.id ? e.changes.id : e.properties.id;
	const umcn = e.changes.umcn ? e.changes.umcn : e.properties.umcn;
	const firstName = e.changes.firstName ? e.changes.firstName : e.properties.firstName;
	const lastName = e.changes.lastName ? e.changes.lastName : e.properties.lastName;
	const changes = Object.keys(e.changes).length;
	return `<div class="list-group-item d-flex justify-content-between align-items-center">
	${id} - ${umcn} - ${lastName} ${firstName}
	<span class="badge badge-warning badge-pill">${changes}</span></div>`;
}

export function calcSummaryTemplate(c: Calc): string {
	return "";
}

export function openCalculationTemplate(): string {
	return `<li class="pr-2 pl-2 list-group-item bg-warning d-flex justify-content-between align-items-center">
				<div class="lastOpen-mgod">M-God</div>
				<div class="lastOpen-code">Sifra</div>
				<div class="lastOpen-name">Naziv obracuna</div>
				<div class="lastOpen-date">Datum</div>
				<div class="lastOpen-badge"><span class="badge badge-primary badge-pill">T</span></div>
			</li>`;
}
