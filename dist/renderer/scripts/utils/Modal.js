"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Modal = /** @class */ (function () {
    function Modal(store) {
        this.store = store;
        this.createBackdrop();
        this.modal = null;
        this.confirm = null;
        this.close = null;
    }
    Modal.prototype.open = function (title, body, cb) {
        var _this = this;
        this.createModal(title, body);
        this.close.addEventListener("click", function () {
            _this.destroyModal();
        });
        if (cb) {
            this.confirm.addEventListener("click", function () {
                cb();
                _this.destroyModal();
            });
            this.confirm.style.display = "inline-block";
        }
        setTimeout(function () {
            _this.modal.style.transform = "translateY(10vh)";
        }, 10);
        this.backdrop.style.visibility = "visible";
        this.backdrop.style.opacity = "1";
        this.store.setState("isModalUp", true);
        return true;
    };
    Modal.prototype.destroyModal = function () {
        var _this = this;
        this.modal.style.transform = "translateY(-10vh)";
        setTimeout(function () {
            _this.confirm.remove();
            _this.close.remove();
            _this.modal.remove();
            _this.modal = null;
            _this.confirm = null;
            _this.close = null;
            _this.backdrop.style.visibility = "hidden";
            _this.store.setState("isModalUp", false);
            _this.backdrop.style.color = "0";
        }, 100);
        return false;
    };
    Modal.prototype.createModal = function (title, body) {
        var html = "<div id=\"modal\" class=\"card\"><div class=\"card-header\"><h5 class=\"card-title mb-0\">" + title + "</h5>\n\t\t\t\t\t\t</div><div class=\"card-body\">" + body + "</div>\n\t\t\t\t\t\t<div class=\"card-footer\">\n\t\t\t\t\t\t\t<button class=\"btn btn-secondary\" id=\"modalClose\">Zatvori</button>\n\t\t\t\t\t\t\t<button class=\"btn btn-primary\" id=\"modalConfirm\">Potvrdi</button>\n\t\t\t\t\t\t</div></div>";
        this.backdrop.innerHTML += html;
        this.modal = document.querySelector("#modal");
        this.confirm = document.querySelector("#modalConfirm");
        this.close = document.querySelector("#modalClose");
    };
    Modal.prototype.createBackdrop = function () {
        var rule0 = "\n\t\t\t#backdrop {\n\t\t\t  visibility: hidden;\n\t\t\t  position: absolute;\n\t\t\t  height: 100vh;\n\t\t\t  width: 100vw;\n\t\t\t  opacity: 1;\n\t\t\t  background-color: rgba(0, 0, 0, 0.4);\n\t\t\t  z-index: 2000;\n\t\t\t}";
        var rule1 = "#backdrop #modal {\n\t\t\t  -webkit-transition: 200ms -webkit-transform;\n\t\t\t  transition: 200ms -webkit-transform;\n\t\t\t  transition: 200ms transform;\n\t\t\t  transition: 200ms transform, 200ms -webkit-transform;\n\t\t\t  width: 600px;\n\t\t\t  height: 300px;\n\t\t\t  margin: 20vh auto;\n\t\t\t}";
        var rule2 = "#backdrop #modal .card-body {\n\t\t\t  overflow-y: scroll;\n\t\t\t}";
        var rule3 = "#backdrop #modal .card-footer {\n\t\t\t  text-align: right;\n\t\t\t}";
        var rule4 = "#backdrop #modal #modalConfirm {\n\t\t\t  display: none;\n\t\t\t}";
        var rules = [rule0, rule1, rule2, rule3, rule4];
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        for (var i = 0; i < rules.length; i++) {
            style.sheet.insertRule(rules[i], i);
        }
        var bd = document.createElement("div");
        bd.id = "backdrop";
        document.body.appendChild(bd);
        this.backdrop = bd;
    };
    return Modal;
}());
exports.Modal = Modal;
