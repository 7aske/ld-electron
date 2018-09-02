export class Menu {
	private element: HTMLElement | null;
	constructor(event: MouseEvent) {
		this.element = document.querySelector('#menu');
		if (this.element) this.element.style.left = event.pageX + 'px';
		if (this.element) this.element.style.top = event.pageY + 'px';
		if (this.element) this.element.style.display = 'block';
		if (this.element)
			this.element.innerHTML = `
				<li class="list-group-item p-2">Sacuvaj</li>
				<li class="list-group-item p-2">Obrisi</li>
				<li class="list-group-item p-2">Odbaci</li>
			`;
	}
	public close() {
		if (this.element) this.element.style.display = 'none';
	}
}
