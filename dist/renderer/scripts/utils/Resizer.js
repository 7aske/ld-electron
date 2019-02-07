"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resizer = /** @class */ (function () {
    function Resizer(store, double, main, aside) {
        var _this = this;
        this.double = double;
        this.store = store;
        this.aside = aside ? aside : document.querySelector("aside");
        this.main = main ? main : document.querySelector("main");
        this.initStyleSheet();
        this.asideTrigger = document.querySelector("#asideTrigger");
        this.asideResizer = document.createElement("div");
        this.asideResizer.classList.add("resize");
        this.asideResizer.addEventListener("mousedown", function () { return store.setState("isResizingList", !store.getState("isResizingList")); });
        if (double) {
            this.mainResizer = document.createElement("div");
            this.mainResizer.classList.add("resize");
            this.mainResizer.addEventListener("mousedown", function () { return store.setState("isResizingContent", !store.getState("isResizingContent")); });
            document.body.insertBefore(this.mainResizer, document.body.firstElementChild);
            document.addEventListener("mousemove", function (event) {
                if (store.getState("isResizingContent")) {
                    if (store.getState("isAsideOut")) {
                        _this.handleResizeContent(event.screenX - store.getState("asideWidth"));
                    }
                    else {
                        _this.handleResizeContent(event.screenX);
                    }
                }
            });
        }
        document.body.insertBefore(this.asideResizer, document.body.firstElementChild);
        this.asideTrigger.addEventListener("click", function () {
            _this.asideToggle(!_this.store.getState("isAsideOut"));
        });
        document.addEventListener("mousemove", function (event) {
            if (store.getState("isResizingList")) {
                _this.handleResizeAside(event.screenX);
            }
        });
        document.addEventListener("mouseup", function () {
            if (double) {
                var config = {
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
            }
            else {
                var config = {
                    isAsideOut: store.getState("isAsideOut"),
                    asideWidth: store.getState("asideWidth")
                };
                if (store.getState("isResizingList") || store.getState("isResizingContent")) {
                    localStorage.setItem("asideWidth", config.asideWidth.toString());
                }
                store.setState("isResizingList", false);
            }
        });
        window.addEventListener("resize", function () {
            _this.positionResizeBars();
        });
        if (localStorage.length < 3) {
            if (double) {
                localStorage.setItem("contentWidth", JSON.stringify(this.store.getState("contentWidth")));
            }
            localStorage.setItem("isAsideOut", this.store.getState("isAsideOut") ? "true" : "false");
            localStorage.setItem("asideWidth", this.store.getState("asideWidth").toString());
        }
        if (double) {
            this.store.setState("contentWidth", JSON.parse(localStorage.getItem("contentWidth")));
        }
        this.store.setState("isAsideOut", localStorage.getItem("isAsideOut") == "true");
        this.store.setState("asideWidth", parseInt(localStorage.getItem("asideWidth"), 10));
        this.asideToggle();
        this.handleResizeAside();
        if (double) {
            this.handleResizeContent();
        }
    }
    Resizer.prototype.handleResizeAside = function (width) {
        if (width) {
            if (width > 400) {
                this.aside.style.width = width + "px";
                this.store.setState("asideWidth", width);
            }
        }
        else {
            this.aside.style.width = this.store.getState("asideWidth") + "px";
        }
        this.positionResizeBars();
    };
    Resizer.prototype.positionResizeBars = function () {
        this.main.style.width = this.getWidth() + "px";
        if (this.store.getState("isAsideOut")) {
            this.asideResizer.style.display = "block";
            if (this.double) {
                this.mainResizer.style.left = this.store.getState("asideWidth") + this.main.firstElementChild.clientWidth + 15 + "px";
            }
            this.asideResizer.style.left = this.store.getState("asideWidth") + "px";
        }
        else {
            this.asideResizer.style.display = "none";
            if (this.double) {
                this.mainResizer.style.left = this.main.firstElementChild.clientWidth + 15 + "px";
            }
        }
    };
    Resizer.prototype.getWidth = function () {
        return this.store.getState("isAsideOut") ? window.innerWidth - this.store.getState("asideWidth") : window.innerWidth;
    };
    Resizer.prototype.handleResizeContent = function (mousePos) {
        var c0 = this.main.children[0];
        var c1 = this.main.children[1];
        if (!mousePos) {
            var cols = this.store.getState("contentWidth");
            c0.classList.replace(c0.className.match(/col.+/gi)[0], "col-lg-" + cols.left);
            c1.classList.replace(c1.className.match(/col.+/gi)[0], "col-lg-" + cols.right);
        }
        else {
            var width = this.main.offsetWidth;
            var x = mousePos < width / 2 ? width / mousePos : width / (width - mousePos);
            var col = Math.round(12 / x);
            if (col < 13 && col > -1) {
                var col0 = col;
                var col1 = 12 - col;
                if (mousePos > width / 2) {
                    col0 = 12 - col;
                    col1 = col;
                }
                if (col == 12 || col == 0) {
                    col0 = col1 = 12;
                }
                c0.classList.replace(c0.className.match(/col.+/gi)[0], "col-lg-" + col0);
                c1.classList.replace(c1.className.match(/col.+/gi)[0], "col-lg-" + col1);
                this.store.setState("contentWidth", { left: col0, right: col1 });
            }
        }
        this.positionResizeBars();
    };
    Resizer.prototype.asideToggle = function (toggle) {
        var _this = this;
        if (toggle != null || toggle != undefined) {
            if (toggle) {
                this.aside.style.left = "0px";
                this.asideTrigger.classList.add("active");
            }
            else {
                this.aside.style.left = "-" + this.store.getState("asideWidth") + "px";
                this.asideTrigger.classList.remove("active");
            }
            localStorage.setItem("isAsideOut", toggle ? "true" : "false");
            this.store.setState("isAsideOut", toggle);
        }
        else {
            if (this.store.getState("isAsideOut")) {
                this.aside.style.left = "0px";
                this.asideTrigger.classList.add("active");
            }
            else {
                this.aside.style.left = "-" + this.store.getState("asideWidth") + "px";
                this.asideTrigger.classList.remove("active");
            }
        }
        setTimeout(function () {
            _this.main.style.width = _this.getWidth() + "px";
            _this.positionResizeBars();
        }, 200);
    };
    Resizer.prototype.initStyleSheet = function () {
        var rule0 = "\n\t\t.resize {\n\t \t\tuser-select: none;\n\t \t\tposition: absolute;\n\t \t\tcursor: all-scroll;\n\t \t\tz-index: 10;\n\t \t\twidth: 15px;\n\t \t\theight: 100vh;\n\t \t\tbackground-color: transparent;\n\t \t}\n\t\t";
        var rule1 = "\n\t\t\t.resize:hover, .resize:active {\n\t\t\tbackground-color: orange;\n\t\t";
        var rules = [rule0, rule1];
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.append(style);
        for (var i = 0; i < rules.length; i++) {
            style.sheet.insertRule(rules[i], i);
        }
    };
    return Resizer;
}());
exports.Resizer = Resizer;
