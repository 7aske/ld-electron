import { Store } from '../scripts/Store';
interface ModalButtons {
	confirm: HTMLElement | null;
	close: HTMLElement | null;
}
export class Modal {
	public buttons: ModalButtons;
	private body: HTMLElement | null;
	public modal: HTMLElement | null;
	private backdrop: HTMLElement | null;
	private title: HTMLElement | null;
	private store: Store;
	constructor(store: Store) {
		this.store = store;
		this.backdrop = document.querySelector('#backdrop');
		this.modal = null;
		this.title = null;
		this.body = null;
		this.buttons = {
			confirm: null,
			close: null
		};
	}
	public open(title: string, body: string, cb?: Function) {
		const html = `<div id="modal" class="card">
						<div class="card-header">
							<h5 class="card-title mb-0"></h5>
						</div>
						<div class="card-body">
						</div>
						<div class="card-footer">
							<button class="btn btn-secondary" id="modalClose">Zatvori</button>
							<button class="btn btn-primary" id="modalConfirm">Potvrdi</button>
						</div>
					</div>
					`;
		this.backdrop.innerHTML += html;
		this.modal = document.querySelector('#modal');
		this.title = document.querySelector('#modal .card-title');
		this.body = document.querySelector('#modal .card-body');
		this.buttons = {
			confirm: document.querySelector('#modalConfirm'),
			close: document.querySelector('#modalClose')
		};
		this.buttons.close.addEventListener('click', () => {
			this.close();
		});
		if (cb) {
			this.buttons.confirm.addEventListener('click', () => {
				cb();
				this.close();
			});
			this.buttons.confirm.style.display = 'inline-block';
		}
		this.title.innerHTML = title;
		this.body.innerHTML = body;
		setTimeout(() => {
			this.modal.style.transform = 'translateY(10vh)';
		}, 10);
		this.backdrop.style.visibility = 'visible';
		this.backdrop.style.opacity = '1';
		this.store.setState('isModalUp', true);
		return true;
	}
	public close() {
		this.backdrop.style.color = '0';
		setTimeout(() => {
			this.modal.style.transform = 'translateY(-10vh)';
			this.buttons.confirm.remove();
			this.buttons.close.remove();
			this.modal.remove();
			this.modal = null;
			this.title = null;
			this.body = null;
			this.buttons = {
				confirm: null,
				close: null
			};
			this.backdrop.style.visibility = 'hidden';
		}, 100);
		this.store.setState('isModalUp', false);
		return false;
	}
}
