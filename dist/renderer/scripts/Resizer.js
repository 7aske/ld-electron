"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Resizer {
    constructor(store, main, aside) {
        this.store = store;
        this.aside = aside ? aside : document.querySelector('aside');
        this.main = main ? main : document.querySelector('main');
        this.asideTrigger = document.querySelector('#asideTrigger');
        this.asideResizer = document.createElement('div');
        this.asideResizer.classList.add('resize');
        this.mainResizer = document.createElement('div');
        this.mainResizer.classList.add('resize');
        this.asideResizer.addEventListener('mousedown', () => store.setState('isResizingList', !store.getState('isResizingList')));
        this.mainResizer.addEventListener('mousedown', () => store.setState('isResizingContent', !store.getState('isResizingContent')));
        document.body.insertBefore(this.asideResizer, document.body.firstElementChild);
        document.body.insertBefore(this.mainResizer, document.body.firstElementChild);
        this.asideTrigger.addEventListener('click', () => {
            store.setState('isAsideOut', !store.getState('isAsideOut'));
        });
        document.addEventListener('mousemove', event => {
            if (store.getState('isResizingList')) {
                store.setState('asideWidth', event.screenX);
            }
            if (store.getState('isResizingContent')) {
                if (store.getState('isAsideOut')) {
                    this.handleResizeContent(event.screenX - store.getState('asideWidth'));
                }
                else {
                    this.handleResizeContent(event.screenX);
                }
            }
        });
        document.addEventListener('mouseup', event => {
            if (store.getState('isResizingList') || store.getState('isResizingContent')) {
                const config = {
                    isAsideOut: store.getState('isAsideOut'),
                    contentWidth: store.getState('contentWidth'),
                    asideWidth: store.getState('asideWidth')
                };
                localStorage.setItem('isAsideOut', config.isAsideOut ? 'true' : 'false');
                localStorage.setItem('contentWidth', JSON.stringify(config.contentWidth));
                localStorage.setItem('asideWidth', config.asideWidth.toString());
            }
            store.setState('isResizingList', false);
            store.setState('isResizingContent', false);
        });
        window.addEventListener('resize', event => {
            this.positionResizeBars();
        });
        if (localStorage.length < 3) {
            localStorage.setItem('isAsideOut', 'true');
            localStorage.setItem('contentWidth', JSON.stringify({ left: 6, right: 6 }));
            localStorage.setItem('asideWidth', '400');
        }
        // const isAsideOut = localStorage.getItem('isAsideOut') === 'true';
        // const contentWidth = JSON.parse(localStorage.getItem('contentWidth'));
        // const asideWidth = parseInt(localStorage.getItem('asideWidth'));
        const isAsideOut = store.getState('isAsideOut');
        const contentWidth = store.getState('contentWidth');
        const asideWidth = store.getState('asideWidth');
        const config = {
            isAsideOut: isAsideOut,
            contentWidth: contentWidth,
            asideWidth: asideWidth
        };
        this.setSettings(config);
    }
    positionResizeBars() {
        this.main.style.width = `${this.getWidth()}px`;
        this.aside.style.width = `${this.store.getState('asideWidth')}px`;
        if (this.store.getState('isAsideOut')) {
            this.asideResizer.style.display = 'block';
            this.mainResizer.style.left = `${this.store.getState('asideWidth') + this.main.firstElementChild.clientWidth + 15}px`;
            this.asideResizer.style.left = `${this.store.getState('asideWidth')}px`;
        }
        else {
            this.asideResizer.style.display = 'none';
            this.mainResizer.style.left = `${this.main.firstElementChild.clientWidth + 15}px`;
        }
    }
    getWidth() {
        return this.store.getState('isAsideOut') ? window.innerWidth - this.store.getState('asideWidth') : window.innerWidth;
    }
    handleResizeContent(mousePos) {
        const c0 = this.main.children[0];
        const c1 = this.main.children[1];
        if (!mousePos) {
            const cols = this.store.getState('contentWidth');
            c0.classList.replace(c0.className.match(/col.+/gi)[0], `col-lg-${cols.left}`);
            c1.classList.replace(c1.className.match(/col.+/gi)[0], `col-lg-${cols.right}`);
        }
        else {
            const width = this.main.offsetWidth;
            const x = mousePos < width / 2 ? width / mousePos : width / (width - mousePos);
            const col = Math.round(12 / x);
            if (col < 13 && col > -1) {
                let col0 = col;
                let col1 = 12 - col;
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
    asideToggle() {
        this.aside.style.width = `${this.store.getState('asideWidth')}px`;
        if (this.store.getState('isAsideOut')) {
            this.aside.style.left = `0px`;
            this.asideTrigger.classList.add('active');
        }
        else {
            this.aside.style.left = `-${this.store.getState('asideWidth')}px`;
            this.asideTrigger.classList.remove('active');
        }
        setTimeout(() => {
            this.main.style.width = `${this.getWidth()}px`;
        }, 200);
    }
    setSettings(data) {
        for (let key in data) {
            console.log(key, data[key]);
            this.store.setState(key, data[key]);
        }
        setTimeout(() => {
            this.positionResizeBars();
        }, 200);
    }
}
exports.Resizer = Resizer;
