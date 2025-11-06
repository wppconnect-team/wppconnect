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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposedFn = void 0;
var ExposedFn;
(function (ExposedFn) {
    ExposedFn["OnMessage"] = "onMessage";
    ExposedFn["OnAnyMessage"] = "onAnyMessage";
    ExposedFn["onAck"] = "onAck";
    ExposedFn["onMessageEdit"] = "onMessageEdit";
    ExposedFn["onNotificationMessage"] = "onNotificationMessage";
    ExposedFn["onParticipantsChanged"] = "onParticipantsChanged";
    ExposedFn["onStateChange"] = "onStateChange";
    ExposedFn["onStreamChange"] = "onStreamChange";
    ExposedFn["onIncomingCall"] = "onIncomingCall";
    ExposedFn["onInterfaceChange"] = "onInterfaceChange";
    ExposedFn["onPresenceChanged"] = "onPresenceChanged";
    ExposedFn["onLiveLocation"] = "onLiveLocation";
})(ExposedFn || (exports.ExposedFn = ExposedFn = {}));
