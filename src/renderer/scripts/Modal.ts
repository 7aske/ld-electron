import { Store } from '../scripts/Store';
interface ModalButtons {
	confirm: HTMLElement | null;
	close: HTMLElement | null;
}
export class Modal {
	public readonly buttons: ModalButtons;
	private body: HTMLElement | null;
	private modal: HTMLElement | null;
	private backdrop: HTMLElement | null;
	private title: HTMLElement | null;
	private store: Store;
	constructor(store: Store) {
		this.store = store;
		this.modal = document.querySelector('#modal');
		this.backdrop = document.querySelector('#backdrop');
		this.title = document.querySelector('#modal .card-title');
		this.body = document.querySelector('#modal .card-body');
		this.buttons = {
			confirm: document.querySelector('#modalConfirm'),
			close: document.querySelector('#modalClose')
		};

		this.buttons.close.addEventListener('click', () => {
			this.close();
		});

		this.buttons.confirm.addEventListener('click', () => {
			this.close();
		});
	}
	public open(title: string, body: string, cb?: Function) {
		this.backdrop.style.visibility = 'visible';
		setTimeout(() => {
			this.modal.style.transform = 'translateY(10vh)';
		}, 10);
		this.backdrop.style.opacity = '1';

		if (cb) {
			this.buttons.confirm.addEventListener('click', () => {
				cb();
			});
			this.buttons.confirm.style.display = 'inline-block';
		}
		this.title.innerHTML = title;
		this.body.innerHTML = body;
		this.store.setState('isModalUp', true);
		return true;
	}
	public close() {
		this.backdrop.style.color = '0';
		setTimeout(() => {
			if (this.backdrop) this.backdrop.style.visibility = 'hidden';
		}, 100);
		this.modal.style.transform = 'translateY(-10vh)';
		this.buttons.confirm.style.display = 'none';
		this.title.innerHTML = '';
		this.body.innerHTML = '';
		this.store.setState('isModalUp', false);
		return false;
	}
}
