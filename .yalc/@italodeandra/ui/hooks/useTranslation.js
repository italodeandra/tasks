"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lodash_1 = require("lodash");
function useTranslation(intl) {
    return (0, react_1.useCallback)(function (sentence, path) {
        return ((0, lodash_1.get)(intl, [path, sentence].filter(Boolean).join(".")) ||
            sentence);
    }, [intl]);
}
exports.default = useTranslation;
