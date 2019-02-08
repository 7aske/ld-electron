import { Config, ContentCols } from "../../../@types";
import { Store } from "../store/Store";
import { addStyleSheet } from "../utils/utils";

export class Resizer {
	private readonly asideResizer: HTMLElement;
	private readonly mainResizer: HTMLElement;
	private asideTrigger: HTMLButtonElement;
	private readonly main: HTMLElement;
	private aside: HTMLElement;
	private store: Store;
	private readonly double: boolean;

	constructor(store: Store, double: boolean, main?: HTMLElement, aside?: HTMLElement) {
		this.store = store;
		this.double = double;
		this.aside = aside ? aside : document.querySelector("aside");
		this.main = main ? main : document.querySelector("main");
		if (!this.main) {
			throw new Error("Invalid main element");
		}

		// set required states to the store
		this.initStates();

		if (double) {
			if (this.main.childElementCount < 2) {
				for (let i = 0; i < 2 - this.main.childElementCount; i++) {
					const content = document.createElement("div");
					content.classList.add("content");
					content.classList.add("col-xl-6");
					this.main.appendChild(content);
				}
			}
		}
		this.initStyleSheet();
		this.asideTrigger = document.querySelector("#asideTrigger");

		this.asideResizer = document.createElement("div");
		this.asideResizer.classList.add("resize");
		this.asideResizer.addEventListener("mousedown", () => store.setState("isResizingList", !store.getState("isResizingList")));

		if (double) {
			this.mainResizer = document.createElement("div");
			this.mainResizer.classList.add("resize");
			this.mainResizer.addEventListener("mousedown", () => store.setState("isResizingContent", !store.getState("isResizingContent")));
			document.body.insertBefore(this.mainResizer, document.body.firstElementChild);
			document.addEventListener("mousemove", event => {
				if (store.getState("isResizingContent")) {
					if (store.getState("isAsideOut")) {
						this.handleResizeContent(event.screenX - store.getState("asideWidth"));
					} else {
						this.handleResizeContent(event.screenX);
					}
				}
			});
			document.addEventListener("mouseup", () => {
				const config: Config = {
					isAsideOut: store.getState("isAsideOut"),
					contentWidth: store.getState("contentWidth"),
					asideWidth: store.getState("asideWidth")
				};
				if (store.getState("isResizingList") || store.getState("isResizingContent")) {
					localStorage.setItem("contentWidth", JSON.stringify(config.contentWidth));
					localStorage.setItem("asideWidth", config.asideWidth.toString());
				}
				store.setState("isResizingList", false);
				store.setState("isResizingContent", false);
			});
		} else {
			document.addEventListener("mouseup", () => {
				const config: Config = {
					isAsideOut: store.getState("isAsideOut"),
					asideWidth: store.getState("asideWidth")
				};
				if (store.getState("isResizingList") || store.getState("isResizingContent")) {
					localStorage.setItem("asideWidth", config.asideWidth.toString());
				}
				store.setState("isResizingList", false);
			});
		}
		document.body.insertBefore(this.asideResizer, document.body.firstElementChild);
		this.asideTrigger.addEventListener("click", () => {
			this.asideToggle(!this.store.getState("isAsideOut"));
		});
		document.addEventListener("mousemove", event => {
			if (store.getState("isResizingList")) {
				this.handleResizeAside(event.screenX);
			}
		});
		window.addEventListener("resize", () => {
			this.positionResizeBars();
		});

		// update starting positions
		this.updateValues();
		this.asideToggle();
		this.handleResizeAside();
		if (double) {
			this.handleResizeContent();
		}
	}

	private updateValues() {
		if (localStorage.length < 3) {
			if (this.double) {
				localStorage.setItem("contentWidth", JSON.stringify(this.store.getState("contentWidth")));
			}
			localStorage.setItem("isAsideOut", this.store.getState("isAsideOut") ? "true" : "false");
			localStorage.setItem("asideWidth", this.store.getState("asideWidth").toString());
		}
		if (this.double) {
			this.store.setState("contentWidth", JSON.parse(localStorage.getItem("contentWidth")));
		}
		this.store.setState("isAsideOut", localStorage.getItem("isAsideOut") == "true");
		this.store.setState("asideWidth", parseInt(localStorage.getItem("asideWidth"), 10));
	}

	public handleResizeAside(width?: number): void {
		if (width) {
			if (width > 400) {
				this.aside.style.width = width + "px";
				this.store.setState("asideWidth", width);
			}
		} else {
			this.aside.style.width = this.store.getState("asideWidth") + "px";
		}
		this.positionResizeBars();
	}

	public positionResizeBars(): void {
		this.main.style.width = `${this.getWidth()}px`;
		if (this.store.getState("isAsideOut")) {
			this.asideResizer.style.display = "block";
			if (this.double) {
				this.mainResizer.style.left = `${this.store.getState("asideWidth") + this.main.firstElementChild.clientWidth + 15}px`;
			}
			this.asideResizer.style.left = `${this.store.getState("asideWidth")}px`;
		} else {
			this.asideResizer.style.display = "none";
			if (this.double) {
				this.mainResizer.style.left = `${this.main.firstElementChild.clientWidth + 15}px`;
			}
		}
	}

	public getWidth(): number {
		return this.store.getState("isAsideOut") ? window.innerWidth - this.store.getState("asideWidth") : window.innerWidth;
	}

	public handleResizeContent(mousePos?: number): void {
		const c0: HTMLElement = this.main.children[0] as HTMLElement;
		const c1: HTMLElement = this.main.children[1] as HTMLElement;
		if (!mousePos) {
			const cols: ContentCols = this.store.getState("contentWidth");
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
				this.store.setState("contentWidth", {left: col0, right: col1});
			}
		}
		this.positionResizeBars();
	}

	public asideToggle(toggle?: boolean): void {
		if (toggle != null || toggle != undefined) {
			if (toggle) {
				this.aside.style.left = `0px`;
				this.asideTrigger.classList.add("active");
			} else {
				this.aside.style.left = `-${this.store.getState("asideWidth")}px`;
				this.asideTrigger.classList.remove("active");
			}
			localStorage.setItem("isAsideOut", toggle ? "true" : "false");
			this.store.setState("isAsideOut", toggle);
		} else {
			if (this.store.getState("isAsideOut")) {
				this.aside.style.left = `0px`;
				this.asideTrigger.classList.add("active");
			} else {
				this.aside.style.left = `-${this.store.getState("asideWidth")}px`;
				this.asideTrigger.classList.remove("active");
			}
		}
		setTimeout(() => {
			this.main.style.width = `${this.getWidth()}px`;
			this.positionResizeBars();
		}, 200);
	}

	private initStyleSheet() {
		const rule0 = `
		.resize {
	 		user-select: none;
	 		position: absolute;
	 		cursor: all-scroll;
	 		z-index: 10;
	 		width: 15px;
	 		height: 100vh;
	 		background-color: transparent;
	 	}
		`;
		const rule1 = `
			.resize:hover, .resize:active {
			background-color: orange;
		`;
		addStyleSheet([rule0, rule1]);
	}

	private initStates() {
		if (this.double) {
			this.store.registerState("contentWidth", {left: 6, right: 6});
			this.store.registerState("isResizingContent", false);
		}
		this.store.registerState("isResizingList", false);
		this.store.registerState("isAsideOut", false);
		this.store.registerState("asideWidth", 400);
	}

}
