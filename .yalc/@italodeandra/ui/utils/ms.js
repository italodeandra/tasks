"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms = void 0;
var ms_1 = __importDefault(require("ms"));
var locale = (_a = {},
    _a["en"] = {
        days: "days",
        hours: "hours",
        minutes: "minutes",
        seconds: "seconds",
    },
    _a["pt-BR"] = {
        days: "dias",
        hours: "horas",
        minutes: "minutos",
        seconds: "segundos",
    },
    _a["undefined"] = {
        days: "days",
        hours: "hours",
        seconds: "seconds",
        minutes: "minutes",
    },
    _a);
function ms(value, options) {
    if (typeof value === "number") {
        return (0, ms_1.default)(value, options)
            .replace("days", locale[String(options === null || options === void 0 ? void 0 : options.locale)].days)
            .replace("hours", locale[String(options === null || options === void 0 ? void 0 : options.locale)].hours)
            .replace("minutes", locale[String(options === null || options === void 0 ? void 0 : options.locale)].minutes)
            .replace("seconds", locale[String(options === null || options === void 0 ? void 0 : options.locale)].seconds);
    }
    return (0, ms_1.default)(value);
}
exports.ms = ms;
