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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForm = exports.createFormState = void 0;
var valtio_1 = require("valtio");
var react_1 = require("react");
var lodash_1 = require("lodash");
var react_use_1 = require("react-use");
function createFormState(options) {
    var defaultValues = (0, lodash_1.cloneDeep)(options.defaultValues);
    var valuesState = (0, valtio_1.proxy)(defaultValues);
    var errorsState = (0, valtio_1.proxy)({});
    var formState = (0, valtio_1.proxy)({
        options: options,
        values: valuesState,
        setValue: function (name, value) {
            (0, lodash_1.unset)(errorsState, name);
            (0, lodash_1.set)(valuesState, name, value);
        },
        errors: errorsState,
        registeredFields: (0, valtio_1.ref)({
            value: [],
        }),
        reset: function (values) {
            var update = (0, lodash_1.merge)((0, lodash_1.cloneDeep)(defaultValues), (0, lodash_1.cloneDeep)(values));
            for (var key in formState.values) {
                delete formState.values[key];
            }
            for (var key in update) {
                var typedKey = key;
                formState.setValue(typedKey, update[key]);
            }
        },
    });
    return formState;
}
exports.createFormState = createFormState;
function useForm(state, options) {
    var snapshot = (0, valtio_1.useSnapshot)(state, {
        sync: true,
    });
    (0, react_use_1.useUnmount)(function () {
        if (options === null || options === void 0 ? void 0 : options.resetOnUnmount) {
            snapshot.reset();
        }
    });
    return __assign(__assign({}, snapshot), { onSubmit: function (e) {
            var e_1, _a;
            var _b;
            e.preventDefault();
            var fields = Array.from(e.currentTarget.querySelectorAll("[name],[data-input-name]")).map(function (f) { return f.getAttribute("name") || f.getAttribute("data-input-name"); });
            try {
                for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                    var field = fields_1_1.value;
                    var nameWithoutIndexes = field
                        .split(".")
                        .filter(function (n) { return isNaN(+n); })
                        .join(".");
                    var validation = (0, lodash_1.get)(snapshot.options.validation, nameWithoutIndexes);
                    var value = (0, lodash_1.get)(snapshot.values, field);
                    if ((validation === null || validation === void 0 ? void 0 : validation.required) &&
                        (Array.isArray(value) ? !value.length : !value)) {
                        (0, lodash_1.set)(state.errors, field, { message: validation.required });
                    }
                    else if (!(0, lodash_1.isNil)(validation === null || validation === void 0 ? void 0 : validation.min) &&
                        value.length < (validation === null || validation === void 0 ? void 0 : validation.min[0])) {
                        (0, lodash_1.set)(state.errors, field, { message: validation === null || validation === void 0 ? void 0 : validation.min[1] });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (Object.keys(state.errors).length === 0) {
                (_b = options === null || options === void 0 ? void 0 : options.onSubmit) === null || _b === void 0 ? void 0 : _b.call(options, snapshot.values);
            }
            else {
                console.error(state.errors);
            }
        }, register: (0, react_1.useCallback)(function (name, handler) {
            var _a, _b;
            if (!state.registeredFields.value.includes(name)) {
                state.registeredFields.value.push(name);
            }
            var nameWithoutIndexes = name
                .split(".")
                .filter(function (n) { return isNaN(+n); })
                .join(".");
            var value = (0, lodash_1.get)(snapshot.values, name);
            var props = __assign({ name: name, value: !(0, lodash_1.isNil)(value) ? value : "", error: !!(0, lodash_1.get)(snapshot.errors, name), 
                // @ts-expect-error the type is correct
                helpText: (_a = (0, lodash_1.get)(snapshot.errors, name)) === null || _a === void 0 ? void 0 : _a.message, required: !!((_b = (0, lodash_1.get)(snapshot.options.validation, nameWithoutIndexes)) === null || _b === void 0 ? void 0 : _b.required) }, ((handler === null || handler === void 0 ? void 0 : handler.onChange) || !(handler === null || handler === void 0 ? void 0 : handler.onValueChange)
                ? {
                    onChange: function (event) {
                        snapshot.setValue(name, ((handler === null || handler === void 0 ? void 0 : handler.onChange)
                            ? handler === null || handler === void 0 ? void 0 : handler.onChange(event)
                            : event.target.value));
                    },
                }
                : {
                    onValueChange: function (value) {
                        snapshot.setValue(name, handler.onValueChange(value));
                    },
                }));
            if (!props.helpText) {
                delete props.helpText;
            }
            return props;
        }, 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [snapshot]) });
}
exports.useForm = useForm;
