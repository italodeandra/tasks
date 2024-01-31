"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationWindowCloseProtection = void 0;
var react_query_1 = require("@tanstack/react-query");
var useBeforeUnload_1 = __importDefault(require("./useBeforeUnload"));
function useMutationWindowCloseProtection() {
    var isMutating = (0, react_query_1.useIsMutating)();
    (0, useBeforeUnload_1.default)(isMutating
        ? "Mutation in progress. Are you sure you want to leave this page?"
        : false);
}
exports.default = useMutationWindowCloseProtection;
// noinspection JSUnusedGlobalSymbols
function MutationWindowCloseProtection() {
    useMutationWindowCloseProtection();
    return null;
}
exports.MutationWindowCloseProtection = MutationWindowCloseProtection;
