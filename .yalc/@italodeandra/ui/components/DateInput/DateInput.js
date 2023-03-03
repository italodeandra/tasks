"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.parseDate = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var pt_BR_1 = __importDefault(require("date-fns/locale/pt-BR"));
var Input_1 = __importDefault(require("../Input/Input"));
var solid_1 = require("@heroicons/react/20/solid");
function parseDate(value) {
    try {
        return (0, date_fns_1.parse)(value, "yyyy-MM-dd", new Date(), {
            locale: pt_BR_1.default,
        }).toISOString();
    }
    catch (e) {
        return value;
    }
}
exports.parseDate = parseDate;
function formatDate(value) {
    try {
        return (0, date_fns_1.format)(new Date(value), "yyyy-MM-dd", {
            locale: pt_BR_1.default,
        });
    }
    catch (e) {
        return value;
    }
}
exports.formatDate = formatDate;
function DateInput(props, ref) {
    var realRef = (0, react_1.useRef)(null);
    var innerRef = (0, react_1.useRef)({
        get value() {
            var _a;
            return parseDate(((_a = realRef.current) === null || _a === void 0 ? void 0 : _a.value) || "");
        },
        set value(value) {
            if (realRef.current) {
                realRef.current.value = formatDate(value);
            }
        },
    });
    (0, react_1.useEffect)(function () {
        if (ref) {
            if (typeof ref === "function") {
                ref(innerRef.current);
            }
            else {
                ref.current = innerRef.current;
            }
        }
    }, [ref]);
    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, props, { ref: realRef, type: "date", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}", trailing: (0, jsx_runtime_1.jsx)(solid_1.CalendarIcon, { className: "w-5" }), inputClassName: "!pr-3" })));
}
exports.default = (0, react_1.forwardRef)(DateInput);
