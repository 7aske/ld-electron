export interface MenuOption {
	name: string;
	type?: string;
	action: Function;
	disabled: boolean;
}
export class Menu {
	public items: Array<EventTarget>;
	private menu: HTMLElement | null;
	constructor(event: MouseEvent, options: Array<MenuOption>) {
		this.menu = document.createElement('ul');
		this.menu.id = 'contextmenu';
		this.menu.classList.add('list-group', 'contextmenu');
		this.menu.style.left = event.pageX + 1 + 'px';
		this.menu.style.top = event.pageY + 1 + 'px';
		this.menu.style.display = 'block';
		options.forEach(opt => {
			const li = document.createElement('li');
			li.classList.add('list-group-item');
			if (opt.disabled) li.classList.add('disabled');
			else li.classList.add('list-group-item-action');
			if (opt.type) li.classList.add(`list-group-item-${opt.type}`);
			li.innerHTML = opt.name;
			if (!opt.disabled)
				li.addEventListener('click', () => {
					opt.action();
					this.close();
				});
			this.menu.appendChild(li);
		});

		document.body.appendChild(this.menu);
		this.items = Array.prototype.slice.call(document.querySelectorAll('#contextmenu li'));
		document.addEventListener('mousedown', event => {
			const target: EventTarget = event.target;
			if (this.menu) {
				if (this.items.indexOf(target) == -1) {
					this.close();
				}
			}
		});
	}
	public close() {
		this.menu.remove();
		this.menu = null;
		document.removeEventListener('mousedown', event => {
			const target: EventTarget = event.target;
			if (this.menu) {
				if (this.items.indexOf(target) == -1) {
					this.close();
				}
			}
		});
	}
}
