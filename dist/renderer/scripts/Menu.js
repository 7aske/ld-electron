"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Menu {
    constructor(event) {
        this.element = document.querySelector('#menu');
        if (this.element)
            this.element.style.left = event.pageX + 'px';
        if (this.element)
            this.element.style.top = event.pageY + 'px';
        if (this.element)
            this.element.style.display = 'block';
        if (this.element)
            this.element.innerHTML = `
				<li class="list-group-item p-2">Sacuvaj</li>
				<li class="list-group-item p-2">Obrisi</li>
				<li class="list-group-item p-2">Odbaci</li>
			`;
    }
    close() {
        if (this.element)
            this.element.style.display = 'none';
    }
}
exports.Menu = Menu;
