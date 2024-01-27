"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRefValue = exports.formatDate = exports.parseDate = void 0;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var pt_BR_1 = __importDefault(require("date-fns/locale/pt-BR"));
function parseDate(value) {
    try {
        // noinspection SpellCheckingInspection
        return (0, date_fns_1.parse)(value, "yyyy-MM-dd'T'HH:mm", new Date(), {
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
        // noinspection SpellCheckingInspection
        return (0, date_fns_1.format)(new Date(value), "yyyy-MM-dd'T'HH:mm", {
            locale: pt_BR_1.default,
        });
    }
    catch (e) {
        return value;
    }
}
exports.formatDate = formatDate;
function useRefValue(ref) {
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
    return realRef;
}
exports.useRefValue = useRefValue;
