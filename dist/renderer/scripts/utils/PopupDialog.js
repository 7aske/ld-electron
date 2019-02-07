"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var PopupDialog = /** @class */ (function () {
    function PopupDialog(store) {
        this.store = store;
        this.initStates();
        this.initStyleSheet();
        this.backdrop = utils_1.initBackdrop("popup-backdrop");
        this.popup = null;
        this.confirm = null;
        this.close = null;
    }
    PopupDialog.prototype.open = function (title, body, cb) {
        var _this = this;
        this.createPopup(title, body);
        this.close.addEventListener("click", function () {
            _this.destroyPopup();
        });
        if (cb) {
            this.confirm.addEventListener("click", function () {
                cb();
                _this.destroyPopup();
            });
            this.confirm.style.display = "inline-block";
        }
        setTimeout(function () {
            _this.popup.style.transform = "translateY(10vh)";
        }, 10);
        this.backdrop.style.visibility = "visible";
        this.backdrop.style.opacity = "1";
        this.store.setState("isPopUp", true);
    };
    PopupDialog.prototype.destroyPopup = function () {
        var _this = this;
        this.popup.style.transform = "translateY(-10vh)";
        setTimeout(function () {
            _this.confirm.remove();
            _this.close.remove();
            _this.popup.remove();
            _this.popup = null;
            _this.confirm = null;
            _this.close = null;
            _this.backdrop.style.visibility = "hidden";
            _this.store.setState("isPopUp", false);
            _this.backdrop.style.color = "0";
        }, 100);
    };
    PopupDialog.prototype.createPopup = function (title, body) {
        var html = "<div id=\"popup\" class=\"card\"><div class=\"card-header\"><h5 class=\"card-title mb-0\">" + title + "</h5>\n\t\t\t\t\t\t</div><div class=\"card-body\">" + body + "</div>\n\t\t\t\t\t\t<div class=\"card-footer\">\n\t\t\t\t\t\t\t<button class=\"btn btn-secondary\" id=\"popupClose\">Zatvori</button>\n\t\t\t\t\t\t\t<button class=\"btn btn-primary\" id=\"popupConfirm\">Potvrdi</button>\n\t\t\t\t\t\t</div></div>";
        this.backdrop.innerHTML += html;
        this.popup = document.querySelector("#popup");
        this.confirm = document.querySelector("#popupConfirm");
        this.close = document.querySelector("#popupClose");
    };
    PopupDialog.prototype.initStyleSheet = function () {
        var rule0 = "\n\t\t\t#popup-backdrop {\n\t\t\t  visibility: hidden;\n\t\t\t  position: absolute;\n\t\t\t  height: 100vh;\n\t\t\t  width: 100vw;\n\t\t\t  opacity: 1;\n\t\t\t  background-color: rgba(0, 0, 0, 0.4);\n\t\t\t  z-index: 2000;\n\t\t\t}";
        var rule1 = "#popup-backdrop #popup {\n\t\t\t  -webkit-transition: 200ms -webkit-transform;\n\t\t\t  transition: 200ms -webkit-transform;\n\t\t\t  transition: 200ms transform;\n\t\t\t  transition: 200ms transform, 200ms -webkit-transform;\n\t\t\t  width: 600px;\n\t\t\t  height: 300px;\n\t\t\t  margin: 20vh auto;\n\t\t\t}";
        var rule2 = "#popup-backdrop #popup .card-body {\n\t\t\t  overflow-y: scroll;\n\t\t\t}";
        var rule3 = "#popup-backdrop #popup .card-footer {\n\t\t\t  text-align: right;\n\t\t\t}";
        var rule4 = "#popup-backdrop #popup #modalConfirm {\n\t\t\t  display: none;\n\t\t\t}";
        var rules = [rule0, rule1, rule2, rule3, rule4];
        utils_1.addStyleSheet(rules);
    };
    PopupDialog.prototype.initStates = function () {
        this.store.registerState("isPopUp", false);
    };
    PopupDialog.prototype.getBackdrop = function () {
        return this.backdrop;
    };
    return PopupDialog;
}());
exports.PopupDialog = PopupDialog;
