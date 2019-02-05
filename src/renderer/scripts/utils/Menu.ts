import { MenuOption } from "../../../@types";

export class Menu {
	public items: EventTarget[];
	private menu: HTMLElement | null;
	constructor(event: MouseEvent, options: MenuOption[]) {
		this.menu = document.createElement("ul");
		this.menu.id = "contextmenu";
		this.menu.classList.add("list-group", "contextmenu");
		this.menu.style.left = event.pageX + 1 + "px";
		this.menu.style.top = event.pageY + 1 + "px";
		this.menu.style.display = "block";
		options.forEach(opt => {
			const li = document.createElement("li");
			li.classList.add("list-group-item");
			if (opt.disabled) li.classList.add("disabled");
			else li.classList.add("list-group-item-action");
			if (opt.type) li.classList.add(`list-group-item-${opt.type}`);
			li.innerHTML = opt.name;
			if (!opt.disabled)
				li.addEventListener("click", () => {
					opt.action();
					this.close();
				});
			this.menu.appendChild(li);
		});
		document.body.appendChild(this.menu);
		this.items = document.querySelectorAll("#contextmenu li") as unknown as EventTarget[];
		document.addEventListener("mousedown", e => {
			const target: EventTarget = e.target;
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
		document.removeEventListener("mousedown", () => {});
	}
}
