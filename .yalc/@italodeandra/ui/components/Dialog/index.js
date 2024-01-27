"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialogsState = void 0;
var Dialogs_1 = __importDefault(require("./Dialogs"));
__exportStar(require("./Dialogs"), exports);
exports.default = Dialogs_1.default;
// noinspection JSUnusedGlobalSymbols
var dialogs_state_1 = require("./dialogs.state");
Object.defineProperty(exports, "dialogsState", { enumerable: true, get: function () { return __importDefault(dialogs_state_1).default; } });
__exportStar(require("./dialogs.state"), exports);
