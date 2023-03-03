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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotification = exports.showNotification = void 0;
var valtio_1 = require("valtio");
var isomorphicObjectId_1 = __importDefault(require("@italodeandra/next/utils/isomorphicObjectId"));
var ms_1 = __importDefault(require("ms"));
var notificationsState = (0, valtio_1.proxy)({
    rendered: false,
    setRendered: function (rendered) {
        notificationsState.rendered = rendered;
    },
    notifications: [],
    add: function (_a) {
        var _b = _a._id, _id = _b === void 0 ? (0, isomorphicObjectId_1.default)().toString() : _b, _c = _a.dismissable, dismissable = _c === void 0 ? true : _c, timeout = _a.timeout, notification = __rest(_a, ["_id", "dismissable", "timeout"]);
        if (!notificationsState.rendered) {
            console.error("<Notifications /> is not rendered. The notification will be ignored.");
        }
        notificationsState.notifications.push((0, valtio_1.ref)(__assign(__assign({}, notification), { dismissable: dismissable, _id: _id })));
        if (timeout) {
            setTimeout(function () {
                notificationsState.remove(_id);
            }, typeof timeout === "string" ? (0, ms_1.default)(timeout) : timeout);
        }
    },
    remove: function (_id) {
        notificationsState.notifications.splice(notificationsState.notifications.findIndex(function (n) { return n._id === _id; }), 1);
    },
});
function showNotification(notification) {
    var notificationObject = typeof notification === "string" ? { message: notification } : notification;
    if (notificationObject.supress &&
        notificationsState.notifications.find(function (n) {
            return n.message === notificationObject.message &&
                n.title === notificationObject.title;
        })) {
        return;
    }
    notificationsState.add(notificationObject);
}
exports.showNotification = showNotification;
function removeNotification(_id) {
    notificationsState.remove(_id);
}
exports.removeNotification = removeNotification;
exports.default = notificationsState;
