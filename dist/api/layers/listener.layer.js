"use strict";
/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerLayer = void 0;
var events_1 = require("events");
var helpers_1 = require("../helpers");
var exposed_enum_1 = require("../helpers/exposed.enum");
var profile_layer_1 = require("./profile.layer");
var ListenerLayer = /** @class */ (function (_super) {
    __extends(ListenerLayer, _super);
    function ListenerLayer(page, session, options) {
        var _this = _super.call(this, page, session, options) || this;
        _this.page = page;
        _this.listenerEmitter = new events_1.EventEmitter({
            captureRejections: true,
        });
        _this.listenerEmitter.setMaxListeners(0);
        _this.listenerEmitter.on(exposed_enum_1.ExposedFn.onInterfaceChange, function (state) {
            _this.log('http', "Current state: ".concat(state.mode, " (").concat(state.displayInfo, ")"));
        });
        _this.listenerEmitter[events_1.captureRejectionSymbol] = function (reason, event) {
            var message = "Unhandled Rejection in a ".concat(event, " event: ");
            if (reason instanceof Error) {
                if (reason.stack) {
                    message += reason.stack;
                }
                else {
                    message += reason.toString();
                }
            }
            else {
                message += JSON.stringify(reason);
            }
            _this.log('error', reason);
        };
        return _this;
    }
    ListenerLayer.prototype.afterPageScriptInjected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var functions, _loop_1, this_1, _i, functions_1, func;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.afterPageScriptInjected.call(this)];
                    case 1:
                        _a.sent();
                        functions = __spreadArray(__spreadArray([], Object.values(exposed_enum_1.ExposedFn), true), [
                            'onAddedToGroup',
                            'onIncomingCall',
                            'onRevokedMessage',
                            'onReactionMessage',
                            'onPollResponse',
                            'onUpdateLabel',
                            'onOrderStatusUpdate',
                        ], false);
                        _loop_1 = function (func) {
                            var has;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this_1.page
                                            .evaluate(function (func) { return typeof window[func] === 'function'; }, func)
                                            .catch(function () { return false; })];
                                    case 1:
                                        has = _b.sent();
                                        if (!!has) return [3 /*break*/, 3];
                                        this_1.log('debug', "Exposing ".concat(func, " function"));
                                        return [4 /*yield*/, this_1.page
                                                .exposeFunction(func, function () {
                                                var args = [];
                                                for (var _i = 0; _i < arguments.length; _i++) {
                                                    args[_i] = arguments[_i];
                                                }
                                                Promise.resolve().then(function () {
                                                    var _a;
                                                    var count = _this.listenerEmitter.listenerCount(func);
                                                    if (count > 0) {
                                                        _this.log('debug', "Emitting ".concat(func, " event (").concat(count, " registered)"));
                                                    }
                                                    (_a = _this.listenerEmitter).emit.apply(_a, __spreadArray([func], args, false));
                                                });
                                            })
                                                .catch(function () { })];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, functions_1 = functions;
                        _a.label = 2;
                    case 2:
                        if (!(_i < functions_1.length)) return [3 /*break*/, 5];
                        func = functions_1[_i];
                        return [5 /*yield**/, _loop_1(func)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.page
                            .evaluate(function () {
                            try {
                                if (!window['onMessage'].exposed) {
                                    WPP.on('chat.new_message', function (msg) {
                                        if (msg.isSentByMe || msg.isStatusV3) {
                                            return;
                                        }
                                        var serialized = WAPI.processMessageObj(msg, false, false);
                                        if (serialized) {
                                            window['onMessage'](serialized);
                                        }
                                    });
                                    window['onMessage'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onAck'].exposed) {
                                    window.WAPI.waitNewAcknowledgements(window['onAck']);
                                    window['onAck'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onMessageEdit'].exposed) {
                                    WPP.on('chat.msg_edited', function (data) {
                                        var eventData = {
                                            chat: data.chat,
                                            id: data.id,
                                            msg: WAPI.processMessageObj(data.msg, true, false),
                                        };
                                        window['onMessageEdit'](eventData);
                                    });
                                    window['onMessageEdit'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onAnyMessage'].exposed) {
                                    WPP.on('chat.new_message', function (msg) {
                                        var serialized = WAPI.processMessageObj(msg, true, false);
                                        if (serialized) {
                                            window['onAnyMessage'](serialized);
                                        }
                                    });
                                    window['onAnyMessage'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onStateChange'].exposed) {
                                    window.WAPI.onStateChange(window['onStateChange']);
                                    window['onStateChange'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onStreamChange'].exposed) {
                                    window.WAPI.onStreamChange(window['onStreamChange']);
                                    window['onStreamChange'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onAddedToGroup'].exposed) {
                                    window.WAPI.onAddedToGroup(window['onAddedToGroup']);
                                    window['onAddedToGroup'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onIncomingCall'].exposed) {
                                    window.WAPI.onIncomingCall(window['onIncomingCall']);
                                    window['onIncomingCall'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onInterfaceChange'].exposed) {
                                    window.WAPI.onInterfaceChange(window['onInterfaceChange']);
                                    window['onInterfaceChange'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onNotificationMessage'].exposed) {
                                    window.WAPI.onNotificationMessage(window['onNotificationMessage']);
                                    window['onNotificationMessage'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onPresenceChanged'].exposed) {
                                    WPP.on('chat.presence_change', window['onPresenceChanged']);
                                    window['onPresenceChanged'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onLiveLocation'].exposed) {
                                    window.WAPI.onLiveLocation(window['onLiveLocation']);
                                    window['onLiveLocation'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onRevokedMessage'].exposed) {
                                    WPP.on('chat.msg_revoke', function (data) {
                                        var eventData = {
                                            author: data.author,
                                            from: data.from,
                                            to: data.to,
                                            id: data.id._serialized,
                                            refId: data.refId._serialized,
                                        };
                                        window['onRevokedMessage'](eventData);
                                    });
                                    window['onRevokedMessage'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onReactionMessage'].exposed) {
                                    WPP.on('chat.new_reaction', function (data) {
                                        var eventData = {
                                            id: data.id,
                                            msgId: data.msgId,
                                            reactionText: data.reactionText,
                                            read: data.read,
                                            orphan: data.orphan,
                                            orphanReason: data.orphanReason,
                                            timestamp: data.timestamp,
                                        };
                                        window['onReactionMessage'](eventData);
                                    });
                                    window['onReactionMessage'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onPollResponse'].exposed) {
                                    WPP.on('chat.poll_response', function (data) {
                                        var eventData = {
                                            msgId: data.msgId,
                                            chatId: data.chatId,
                                            selectedOptions: data.selectedOptions,
                                            timestamp: data.timestamp,
                                            sender: data.sender,
                                        };
                                        window['onPollResponse'](eventData);
                                    });
                                    window['onPollResponse'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onUpdateLabel'].exposed) {
                                    WPP.on('chat.update_label', function (data) {
                                        var eventData = {
                                            chat: data.chat,
                                            ids: data.ids,
                                            labels: data.labels,
                                            type: data.type,
                                        };
                                        window['onUpdateLabel'](eventData);
                                    });
                                    window['onUpdateLabel'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onOrderStatusUpdate'].exposed) {
                                    WPP.on('order.payment_status', function (data) {
                                        var eventData = {
                                            method: data.method,
                                            timestamp: data.timestamp,
                                            reference_id: data.reference_id,
                                            msgId: data.msgId,
                                        };
                                        window['onOrderStatusUpdate'](eventData);
                                    });
                                    window['onOrderStatusUpdate'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                            try {
                                if (!window['onParticipantsChanged'].exposed) {
                                    WPP.on('group.participant_changed', function (participantChangedEvent) {
                                        window['onParticipantsChanged'](participantChangedEvent);
                                    });
                                    window['onParticipantsChanged'].exposed = true;
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                        })
                            .catch(function () { })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Register the event and create a disposable object to stop the listening
     * @param event Name of event
     * @param listener The function to execute
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.registerEvent = function (event, listener) {
        var _this = this;
        this.log('debug', "Registering ".concat(event.toString(), " event"));
        this.listenerEmitter.on(event, listener);
        return {
            dispose: function () {
                _this.listenerEmitter.off(event, listener);
            },
        };
    };
    /**
     * @event Listens to all new messages received only.
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onMessage = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.OnMessage, callback);
    };
    /**
     * @event Listens to all new messages, sent and received.
     * @param to callback
     * @fires Message
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onAnyMessage = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.OnAnyMessage, callback);
    };
    /**
     * @event Listens to all notification messages, like group changes, join, leave
     * @param to callback
     * @fires Message
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onNotificationMessage = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.onNotificationMessage, callback);
    };
    /**
     * @event Listens List of mobile states
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onStateChange = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.onStateChange, callback);
    };
    /**
     * @event Returns the current state of the connection
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onStreamChange = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.onStreamChange, callback);
    };
    /**
     * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onInterfaceChange = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.onInterfaceChange, callback);
    };
    /**
     * @event Listens to message acknowledgement changes
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onAck = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.onAck, callback);
    };
    /**
     * @event Listens to message edited changes
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onMessageEdit = function (callback) {
        return this.registerEvent(exposed_enum_1.ExposedFn.onMessageEdit, callback);
    };
    ListenerLayer.prototype.onLiveLocation = function (id, callback) {
        var ids = [];
        if (typeof id === 'function') {
            callback = id;
        }
        else if (Array.isArray(id)) {
            ids.push.apply(ids, id);
        }
        else {
            ids.push(id);
        }
        return this.registerEvent(exposed_enum_1.ExposedFn.onLiveLocation, function (event) {
            // Only group events
            if (ids.length && !ids.includes(event.id)) {
                return;
            }
            callback(event);
        });
    };
    ListenerLayer.prototype.onParticipantsChanged = function (groupId, callback) {
        if (typeof groupId === 'function') {
            callback = groupId;
            groupId = null;
        }
        return this.registerEvent(exposed_enum_1.ExposedFn.onParticipantsChanged, function (evData) {
            if (groupId && groupId !== evData.groupId) {
                return;
            }
            callback({
                by: evData.author,
                byPushName: evData.authorPushName,
                groupId: evData.groupId,
                action: evData.action,
                operation: evData.operation,
                who: evData.participants,
            });
        });
    };
    /**
     * @event Fires callback with Chat object every time the host phone is added to a group.
     * @param to callback
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onAddedToGroup = function (callback) {
        return this.registerEvent('onAddedToGroup', callback);
    };
    /**
     * @event Listen for incoming calls, whether audio or video (pending a reaction).
     * To reject the call, simply call `rejectCall` {@link rejectCall}
     * @returns Disposable object to stop listening
     */
    ListenerLayer.prototype.onIncomingCall = function (callback) {
        return this.registerEvent('onIncomingCall', callback);
    };
    ListenerLayer.prototype.onPresenceChanged = function (id, callback) {
        var ids = [];
        if (typeof id === 'function') {
            callback = id;
        }
        else if (Array.isArray(id)) {
            ids.push.apply(ids, id);
        }
        else {
            ids.push(id);
        }
        if (ids.length) {
            this.subscribePresence(ids);
        }
        return this.registerEvent(exposed_enum_1.ExposedFn.onPresenceChanged, function (presence) {
            // Only group events
            if (ids.length && !ids.includes(presence.id)) {
                return;
            }
            callback(presence);
        });
    };
    /**
     * Subscribe presence of a contact or group to use in onPresenceChanged (see {@link onPresenceChanged})
     *
     * ```typescript
     * // subcribe all contacts
     * const contacts = await client.getAllContacts();
     * await client.subscribePresence(contacts.map((c) => c.id._serialized));
     *
     * // subcribe all groups participants
     * const chats = await client.getAllGroups(false);
     * for (const c of chats) {
     *   const ids = c.groupMetadata.participants.map((p) => p.id._serialized);
     *   await client.subscribePresence(ids);
     * }
     * ```
     *
     * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
     * @returns number of subscribed
     */
    ListenerLayer.prototype.subscribePresence = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (id) { return WAPI.subscribePresence(id); }, id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Unsubscribe presence of a contact or group to use in onPresenceChanged (see {@link onPresenceChanged})
     * @param id contact id (xxxxx@c.us) or group id: xxxxx-yyyy@g.us
     * @returns number of unsubscribed
     */
    ListenerLayer.prototype.unsubscribePresence = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.evaluateAndReturn)(this.page, function (id) { return WAPI.unsubscribePresence(id); }, id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @event Listens to message revocation
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onRevokedMessage = function (callback) {
        return this.registerEvent('onRevokedMessage', callback);
    };
    /**
     * @event Listens to message reactions
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onReactionMessage = function (callback) {
        return this.registerEvent('onReactionMessage', callback);
    };
    /**
     * @event Listens to poll response messages
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onPollResponse = function (callback) {
        return this.registerEvent('onPollResponse', callback);
    };
    /**
     * @event Listens to update label
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onUpdateLabel = function (callback) {
        return this.registerEvent('onUpdateLabel', callback);
    };
    /**
     * @event Listens to update order status
     * @returns Disposable object to stop the listening
     */
    ListenerLayer.prototype.onOrderStatusUpdate = function (callback) {
        return this.registerEvent('onOrderStatusUpdate', callback);
    };
    return ListenerLayer;
}(profile_layer_1.ProfileLayer));
exports.ListenerLayer = ListenerLayer;
