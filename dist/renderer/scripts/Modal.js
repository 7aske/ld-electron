"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Modal {
    constructor() {
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
    open(title, body, cb) {
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
        return true;
    }
    close() {
        this.backdrop.style.color = '0';
        setTimeout(() => {
            if (this.backdrop)
                this.backdrop.style.visibility = 'hidden';
        }, 100);
        this.modal.style.transform = 'translateY(-10vh)';
        this.buttons.confirm.style.display = 'none';
        this.title.innerHTML = '';
        this.body.innerHTML = '';
        return false;
    }
}
exports.Modal = Modal;
