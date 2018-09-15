import { Store, ContentCols } from './Store';

export class Resizer {
	public asideResizer: HTMLElement;
	public mainResizer: HTMLElement;
	private main: HTMLElement;
	private aside: HTMLElement;
	private store: Store;
	constructor(store: Store) {
		this.store = store;
        this.aside = document.querySelector('aside');
        this.main = document.querySelector('main');
        
	}
	positionResizeBars(): void {
		this.main.style.width = `${this.getWidth()}px`;
		this.aside.style.width = `${this.store.getState('asideWidth')}px`;
		if (this.store.getState('isAsideOut')) {
			this.asideResizer.style.display = 'block';
			this.mainResizer.style.left = `${this.store.getState('asideWidth') + this.main.firstElementChild.clientWidth + 15}px`;
			this.asideResizer.style.left = `${this.store.getState('asideWidth')}px`;
		} else {
			this.asideResizer.style.display = 'none';
			this.mainResizer.style.left = `${this.main.firstElementChild.clientWidth + 15}px`;
		}
	}
	getWidth(): number {
		return this.store.getState('isAsideOut') ? window.innerWidth - this.store.getState('asideWidth') : window.innerWidth;
	}

	handleResizeContent(mousePos?: number): void {
		const c0: HTMLElement = <HTMLElement>this.main.children[0];
		const c1: HTMLElement = <HTMLElement>this.main.children[1];
		if (!mousePos) {
			const cols: ContentCols = this.store.getState('contentWidth');
			c0.classList.replace(c0.className.match(/col.+/gi)[0], `col-lg-${cols.left}`);
			c1.classList.replace(c1.className.match(/col.+/gi)[0], `col-lg-${cols.right}`);
		} else {
			const width: number = this.main.offsetWidth;
			const x: number = mousePos < width / 2 ? width / mousePos : width / (width - mousePos);
			const col: number = Math.round(12 / x);
			if (col < 13 && col > -1) {
				let col0: number = col;
				let col1: number = 12 - col;
				if (mousePos > width / 2) {
					col0 = 12 - col;
					col1 = col;
				}
				if (col == 12 || col == 0) {
					col0 = col1 = 12;
				}
				c0.classList.replace(c0.className.match(/col.+/gi)[0], `col-lg-${col0}`);
				c1.classList.replace(c1.className.match(/col.+/gi)[0], `col-lg-${col1}`);
				this.store.setState('contentWidth', { left: col0, right: col1 });
			}
		}
	}
}
