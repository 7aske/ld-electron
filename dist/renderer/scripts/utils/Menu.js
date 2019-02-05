"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Menu = /** @class */ (function () {
    function Menu(event, options) {
        var _this = this;
        this.menu = document.createElement("ul");
        this.menu.id = "contextmenu";
        this.menu.classList.add("list-group", "contextmenu");
        this.menu.style.left = event.pageX + 1 + "px";
        this.menu.style.top = event.pageY + 1 + "px";
        this.menu.style.display = "block";
        options.forEach(function (opt) {
            var li = document.createElement("li");
            li.classList.add("list-group-item");
            if (opt.disabled)
                li.classList.add("disabled");
            else
                li.classList.add("list-group-item-action");
            if (opt.type)
                li.classList.add("list-group-item-" + opt.type);
            li.innerHTML = opt.name;
            if (!opt.disabled)
                li.addEventListener("click", function () {
                    opt.action();
                    _this.close();
                });
            _this.menu.appendChild(li);
        });
        document.body.appendChild(this.menu);
        this.items = document.querySelectorAll("#contextmenu li");
        document.addEventListener("mousedown", function (e) {
            var target = e.target;
            if (_this.menu) {
                if (_this.items.indexOf(target) == -1) {
                    _this.close();
                }
            }
        });
    }
    Menu.prototype.close = function () {
        this.menu.remove();
        this.menu = null;
        document.removeEventListener("mousedown", function () { });
    };
    return Menu;
}());
exports.Menu = Menu;
