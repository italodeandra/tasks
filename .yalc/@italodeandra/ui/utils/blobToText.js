"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function blobToText(file, encoding) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
        reader.onload = function (e) {
            var _a;
            var contents = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            resolve(contents);
        };
        reader.onerror = function (e) {
            var _a;
            reject((_a = e.target) === null || _a === void 0 ? void 0 : _a.error);
        };
        reader.readAsText(file, encoding);
    });
}
exports.default = blobToText;
