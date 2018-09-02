module.exports = class Menu {
	constructor(event) {
		this.element = document.querySelector('#menu');
		this.element.style.left = event.pageX + 'px';
		this.element.style.top = event.pageY + 'px';
		this.element.style.display = 'block';
		this.element.innerHTML = `
				<li class="list-group-item p-2">Sacuvaj</li>
				<li class="list-group-item p-2">Obrisi</li>
				<li class="list-group-item p-2">Odbaci</li>
			`;
	}
	close() {
		this.element.style.display = 'none';
	}
};
