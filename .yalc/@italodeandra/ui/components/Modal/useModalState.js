"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useModalState() {
    var _a = __read((0, react_1.useState)(false), 2), modalOpen = _a[0], setModalOpen = _a[1];
    var handleModalToggle = (0, react_1.useCallback)(function () { return setModalOpen(function (open) { return !open; }); }, []);
    var handleModalOpen = (0, react_1.useCallback)(function () { return setModalOpen(true); }, []);
    var handleModalClose = (0, react_1.useCallback)(function () { return setModalOpen(false); }, []);
    return (0, react_1.useMemo)(function () {
        return [
            modalOpen,
            {
                setModalOpen: setModalOpen,
                openModal: handleModalOpen,
                closeModal: handleModalClose,
                toggleModal: handleModalToggle,
            },
        ];
    }, [handleModalClose, handleModalOpen, handleModalToggle, modalOpen]);
}
exports.default = useModalState;
