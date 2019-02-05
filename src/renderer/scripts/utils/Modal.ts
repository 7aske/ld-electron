import { Store } from "./Store";

export class Modal {
	public confirm: HTMLButtonElement | null;
	public close: HTMLButtonElement | null;
	public modal: HTMLElement | null;
	private backdrop: HTMLElement | null;
	private store: Store;

	constructor(store: Store) {
		this.store = store;
		this.createBackdrop();
		this.modal = null;
		this.confirm = null;
		this.close = null;
	}

	public open(title: string, body: string, cb?: Function) {
		this.createModal(title, body);
		this.close.addEventListener("click", () => {
			this.destroyModal();
		});
		if (cb) {
			this.confirm.addEventListener("click", () => {
				cb();
				this.destroyModal();
			});
			this.confirm.style.display = "inline-block";
		}
		setTimeout(() => {
			this.modal.style.transform = "translateY(10vh)";
		}, 10);
		this.backdrop.style.visibility = "visible";
		this.backdrop.style.opacity = "1";
		this.store.setState("isModalUp", true);
		return true;
	}

	public destroyModal() {
		this.modal.style.transform = "translateY(-10vh)";
		setTimeout(() => {
			this.confirm.remove();
			this.close.remove();
			this.modal.remove();
			this.modal = null;
			this.confirm = null;
			this.close = null;
			this.backdrop.style.visibility = "hidden";
			this.store.setState("isModalUp", false);
			this.backdrop.style.color = "0";
		}, 100);
		return false;
	}

	private createModal(title: string, body: string) {
		const html = `<div id="modal" class="card"><div class="card-header"><h5 class="card-title mb-0">${title}</h5>
						</div><div class="card-body">${body}</div>
						<div class="card-footer">
							<button class="btn btn-secondary" id="modalClose">Zatvori</button>
							<button class="btn btn-primary" id="modalConfirm">Potvrdi</button>
						</div></div>`;
		this.backdrop.innerHTML += html;
		this.modal = document.querySelector("#modal");
		this.confirm = document.querySelector("#modalConfirm");
		this.close = document.querySelector("#modalClose");
	}

	private createBackdrop() {
		const rule0 = `
			#backdrop {
			  visibility: hidden;
			  position: absolute;
			  height: 100vh;
			  width: 100vw;
			  opacity: 1;
			  background-color: rgba(0, 0, 0, 0.4);
			  z-index: 2000;
			}`;
		const rule1 = `#backdrop #modal {
			  -webkit-transition: 200ms -webkit-transform;
			  transition: 200ms -webkit-transform;
			  transition: 200ms transform;
			  transition: 200ms transform, 200ms -webkit-transform;
			  width: 600px;
			  height: 300px;
			  margin: 20vh auto;
			}`;
		const rule2 = `#backdrop #modal .card-body {
			  overflow-y: scroll;
			}`;
		const rule3 = `#backdrop #modal .card-footer {
			  text-align: right;
			}`;
		const rule4 = `#backdrop #modal #modalConfirm {
			  display: none;
			}`;
		const rules: string[] = [rule0, rule1, rule2, rule3, rule4];
		const style = document.createElement("style") as HTMLStyleElement;
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		for (let i = 0; i < rules.length; i++) {
			(style.sheet as CSSStyleSheet).insertRule(rules[i], i);
		}
		const bd = document.createElement("div");
		bd.id = "backdrop";
		document.body.appendChild(bd);
		this.backdrop = bd;
	}
}
