const dateListTemplate = (f, t) => {
	const from = new Date(f);
	const till = new Date(t);
	return `<div class="list-group-item">${from.getDate()}/${from.getMonth() +
		1}/${from.getFullYear()} - ${till.getDate()}/${till.getMonth() +
		1}/${till.getFullYear()}</div>`;
};
const dateTemplate = date => {
	return `${date.getDate() -
		1} dana ${date.getMonth()} meseci ${date.getFullYear() - 1970} godina`;
};
const optionTemplate = e => {
	return `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="changeCurrentEmployee(event.target,event.target.attributes['data-id'].value)" data-id="${
		e.properties._id
	}">${e.properties.id} - ${e.properties.jmbg} - ${e.properties.lastName} ${
		e.properties.firstName
	}<span class="badge badge-warning badge-pill"></span></li>`;
};
const employeeSummaryTemplate = e => {
	return `<div class="list-group-item d-flex justify-content-between align-items-center">${
		e.properties.id
	} - ${e.properties.jmbg} - ${e.properties.lastName} ${
		e.properties.firstName
	} <span class="badge badge-warning badge-pill">${
		Object.keys(e.changes).length
	}</span></div>`;
};
