export function addStyleSheet(rules: string[]) {
	const style = document.createElement("style") as HTMLStyleElement;
	style.appendChild(document.createTextNode(""));
	document.head.append(style);
	for (let i = 0; i < rules.length; i++) {
		(style.sheet as CSSStyleSheet).insertRule(rules[i], i);
	}
}

export function initBackdrop(id: string): HTMLElement {
	const bd = document.createElement("div");
	bd.id = id;
	document.body.appendChild(bd);
	return bd;
}
