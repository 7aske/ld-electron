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
	return `<option onclick="changeCurrentEmployee(event.target.value)" value="${
		e.properties.id
	}">${e.properties.id} - ${e.properties.jmbg} - ${e.properties.lastName} ${
		e.properties.firstName
	}</option>`;
};
