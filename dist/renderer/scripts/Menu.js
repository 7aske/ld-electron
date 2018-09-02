"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Menu {
    constructor(event, options) {
        this.menu = document.createElement('ul');
        this.menu.id = 'contextmenu';
        this.menu.classList.add('list-group', 'contextmenu');
        this.menu.style.left = event.pageX + 1 + 'px';
        this.menu.style.top = event.pageY + 1 + 'px';
        this.menu.style.display = 'block';
        options.forEach(opt => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            if (opt.disabled)
                li.classList.add('disabled');
            else
                li.classList.add('list-group-item-action');
            if (opt.type)
                li.classList.add(`list-group-item-${opt.type}`);
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
            const target = event.target;
            if (this.menu) {
                if (this.items.indexOf(target) == -1) {
                    this.close();
                }
            }
        });
    }
    close() {
        this.menu.remove();
        this.menu = null;
        document.removeEventListener('mousedown', event => {
            const target = event.target;
            if (this.menu) {
                if (this.items.indexOf(target) == -1) {
                    this.close();
                }
            }
        });
    }
}
exports.Menu = Menu;
