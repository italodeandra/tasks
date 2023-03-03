"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateNavigationDrawerState = void 0;
var valtio_1 = require("valtio");
var createStateHydration_1 = __importDefault(require("../../utils/createStateHydration"));
var navigationDrawerState = (0, valtio_1.proxy)({
    isOpen: false,
    open: function () {
        navigationDrawerState.isOpen = true;
    },
    close: function () {
        navigationDrawerState.isOpen = false;
    },
    setOpen: function (open) {
        navigationDrawerState.isOpen = open;
    },
    toggle: function () {
        navigationDrawerState.isOpen = !navigationDrawerState.isOpen;
    },
});
exports.hydrateNavigationDrawerState = (0, createStateHydration_1.default)("navigationDrawerState", navigationDrawerState);
exports.default = navigationDrawerState;
