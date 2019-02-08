import { Store } from "../store/Store";
import { addStyleSheet, initBackdrop } from "../utils/utils";

export class Modal {
	private readonly backdrop: HTMLElement;
	private readonly store: Store;
	private modal: HTMLElement;
	public close: HTMLButtonElement;

	constructor(store: Store) {
		this.store = store;
		this.initStyleSheets();
		this.initStates();

		this.modal = document.createElement("section");
		this.backdrop = initBackdrop("modal-backdrop");
		this.close = null;
	}

	private createModal(header?: string, body?: string) {
		const html = `<div id="modal" class="card"><div class="card-header"><h5 class="card-title mb-0">${header ? header : ""}</h5>
						</div><div class="card-body">${body ? body : ""}</div>
						<div class="card-footer">
							<button class="btn btn-secondary" id="modalClose">Zatvori</button>
						</div></div>`;
		this.backdrop.innerHTML = html;
		this.close = document.querySelector("#modalClose") as HTMLButtonElement;
		this.modal = document.querySelector("#modal");
	}

	public open(header?: string, body?: string) {
		this.createModal(header, body);
		this.close.addEventListener("click", () => {
			this.destroyModal();
		});
		setTimeout(() => {
			this.modal.style.transform = "translateY(10vh)";
		}, 10);
		this.backdrop.style.visibility = "visible";
		this.backdrop.style.opacity = "1";
		this.store.setState("isModalUp", true);
	}

	public destroyModal() {
		this.modal.style.transform = "translateY(-10vh)";
		this.backdrop.style.backgroundColor = "background-color: rgba(0, 0, 0, 0)";
		setTimeout(() => {
			this.close.remove();
			this.modal.remove();
			this.modal = null;
			this.close = null;
			this.backdrop.style.visibility = "hidden";
			this.store.setState("isModalUp", false);
			this.backdrop.style.color = "0";
		}, 100);
	}

	private initStates() {
		this.store.registerState("isModalUp", false);
	}

	private initStyleSheets() {
		const rule0 = `#modal-backdrop {
			transition: 100ms all;
			visibility: hidden;
			position: absolute;
			height: 100vh;
			width: 100vw;
			opacity: 1;
			background-color: rgba(0, 0, 0, 0.4);
			z-index: 3000;
			padding: 20px;
		}`;
		const rule1 = `#modal-backdrop #modal {
			-webkit-transition: 200ms -webkit-transform;
			transition: 200ms -webkit-transform;
			transition: 200ms transform;
			transition: 200ms transform, 200ms -webkit-transform;
			margin-top: -10vh;
			width: 100%;
			height: 100%;
		}`;
		addStyleSheet([rule0, rule1]);
	}

	public getBackdrop(): HTMLElement {
		return this.backdrop;
	}
}
