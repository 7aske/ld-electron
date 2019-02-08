"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var Modal = /** @class */ (function () {
    function Modal(store) {
        this.store = store;
        this.initStyleSheets();
        this.initStates();
        this.modal = document.createElement("section");
        this.backdrop = utils_1.initBackdrop("modal-backdrop");
        this.close = null;
    }
    Modal.prototype.createModal = function (header, body) {
        var html = "<div id=\"modal\" class=\"card\"><div class=\"card-header\"><h5 class=\"card-title mb-0\">" + (header ? header : "") + "</h5>\n\t\t\t\t\t\t</div><div class=\"card-body\">" + (body ? body : "") + "</div>\n\t\t\t\t\t\t<div class=\"card-footer\">\n\t\t\t\t\t\t\t<button class=\"btn btn-secondary\" id=\"modalClose\">Zatvori</button>\n\t\t\t\t\t\t</div></div>";
        this.backdrop.innerHTML = html;
        this.close = document.querySelector("#modalClose");
        this.modal = document.querySelector("#modal");
    };
    Modal.prototype.open = function (header, body) {
        var _this = this;
        this.createModal(header, body);
        this.close.addEventListener("click", function () {
            _this.destroyModal();
        });
        setTimeout(function () {
            _this.modal.style.transform = "translateY(10vh)";
        }, 10);
        this.backdrop.style.visibility = "visible";
        this.backdrop.style.opacity = "1";
        this.store.setState("isModalUp", true);
    };
    Modal.prototype.destroyModal = function () {
        var _this = this;
        this.modal.style.transform = "translateY(-10vh)";
        this.backdrop.style.backgroundColor = "background-color: rgba(0, 0, 0, 0)";
        setTimeout(function () {
            _this.close.remove();
            _this.modal.remove();
            _this.modal = null;
            _this.close = null;
            _this.backdrop.style.visibility = "hidden";
            _this.store.setState("isModalUp", false);
            _this.backdrop.style.color = "0";
        }, 100);
    };
    Modal.prototype.runScripts = function (src) {
        var script = document.createElement("script");
        script.src = src;
        this.backdrop.appendChild(script);
    };
    Modal.prototype.initStates = function () {
        this.store.registerState("isModalUp", false);
    };
    Modal.prototype.initStyleSheets = function () {
        var rule0 = "#modal-backdrop {\n\t\t\ttransition: 100ms all;\n\t\t\tvisibility: hidden;\n\t\t\tposition: absolute;\n\t\t\theight: 100vh;\n\t\t\twidth: 100vw;\n\t\t\topacity: 1;\n\t\t\tbackground-color: rgba(0, 0, 0, 0.4);\n\t\t\tz-index: 3000;\n\t\t\tpadding: 20px;\n\t\t}";
        var rule1 = "#modal-backdrop #modal {\n\t\t\t-webkit-transition: 200ms -webkit-transform;\n\t\t\ttransition: 200ms -webkit-transform;\n\t\t\ttransition: 200ms transform;\n\t\t\ttransition: 200ms transform, 200ms -webkit-transform;\n\t\t\tmargin-top: -10vh;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t}";
        utils_1.addStyleSheet([rule0, rule1]);
    };
    Modal.prototype.getBackdrop = function () {
        return this.backdrop;
    };
    return Modal;
}());
exports.Modal = Modal;
