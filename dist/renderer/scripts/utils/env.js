"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
window.process = process || {};
exports.ENV = window.process.type == "renderer" ? "electron" : "web";
exports.url = exports.ENV == "electron" ? null : "http://localhost:3000";
