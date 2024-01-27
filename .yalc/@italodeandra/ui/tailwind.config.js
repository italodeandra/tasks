"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var colors = require("tailwindcss/colors");
var defaultTheme = require("tailwindcss/defaultTheme");
var plugin = require("tailwindcss/plugin");
/** @type {import("tailwindcss").Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./node_modules/@italodeandra/ui/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@italodeandra/auth/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.sky,
                onPrimary: colors.white,
                success: colors.green,
                error: colors.red,
                warn: colors.yellow,
                current: "currentColor",
            },
            fontFamily: {
                sans: __spreadArray(["Inter Variable"], __read(defaultTheme.fontFamily.sans), false),
            },
            fontWeight: {
                inherit: "inherit",
            },
            scale: {
                flip: "-1",
            },
            keyframes: {
                slideDownAndFade: {
                    from: { opacity: 0, transform: "translateY(-2px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                slideLeftAndFade: {
                    from: { opacity: 0, transform: "translateX(2px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                },
                slideUpAndFade: {
                    from: { opacity: 0, transform: "translateY(2px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                slideRightAndFade: {
                    from: { opacity: 0, transform: "translateX(-2px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                },
                fadeOut: {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
            },
            animation: {
                slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                fadeOut: "fadeOut 300ms ease-in",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
        plugin(function (_a) {
            var addVariant = _a.addVariant;
            addVariant("scrolled", "html.scrolled &");
            addVariant("not-scrolled", "html:not(.scrolled) &");
            addVariant("not-dark", "html:not(.dark) &");
        }),
    ],
};
