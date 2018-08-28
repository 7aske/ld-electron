module.exports.dateLisstTemplate = (f, t) => {
	const from = new Date(f);
	const till = new Date(t);
	return `<div class="list-group-item">${from.getDate()}/${from.getMonth() +
		1}/${from.getFullYear()} - ${till.getDate()}/${till.getMonth() + 1}/${till.getFullYear()}</div>`;
};
module.exports.dateTemplate = date => {
	return `${date.getDate() - 1} dana ${date.getMonth()} meseci ${date.getFullYear() - 1970} godina`;
};
module.exports.optionTemplate = e => {
	return `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
	onclick="changeCurrentEmployee(event.target,event.target.attributes['data-id'].value)"
	data-id="${e.properties._id}">
	${e.properties.id} - ${e.properties.umcn} - ${e.properties.lastName} ${e.properties.firstName}
	<span class="badge badge-warning badge-pill"></span></li>`;
};
module.exports.employeeSummaryTemplate = e => {
	const id = e.changes.id ? e.changes.id : e.properties.id;
	const umcn = e.changes.umcn ? e.changes.umcn : e.properties.umcn;
	const firstName = e.changes.firstName ? e.changes.firstName : e.properties.firstName;
	const lastName = e.changes.lastName ? e.changes.lastName : e.properties.lastName;
	const changes = Object.keys(e.changes).length;
	return `<div class="list-group-item d-flex justify-content-between align-items-center">
	${id} - ${umcn} - ${lastName} ${firstName}
	<span class="badge badge-warning badge-pill">${changes}</span></div>`;
};
