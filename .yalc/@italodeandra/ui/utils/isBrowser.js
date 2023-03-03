"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* istanbul ignore file */
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_iOS = exports.isTouchDevice = exports.isBrowser = void 0;
/**
 * Tells if the current scope is a browser.
 */
exports.isBrowser = typeof window !== "undefined";
/**
 * Tells if the current scope is a touch device.
 */
exports.isTouchDevice = exports.isBrowser &&
    (!!(typeof window !== "undefined" &&
        ("ontouchstart" in window ||
            // @ts-ignore: "DocumentTouch" exists on touch devices only
            (window.DocumentTouch &&
                typeof document !== "undefined" &&
                // @ts-ignore: "DocumentTouch" exists on touch devices only
                document instanceof window.DocumentTouch))) ||
        !!(typeof navigator !== "undefined" &&
            // @ts-ignore: "maxTouchPoints" exists on touch devices only
            (navigator.maxTouchPoints || navigator.msMaxTouchPoints)));
/**
 * Tells if the current scope is a iOS device.
 */
exports.is_iOS = typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
