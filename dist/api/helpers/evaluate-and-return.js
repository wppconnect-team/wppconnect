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
exports.evaluateAndReturn = evaluateAndReturn;
//EvaluateFn, EvaluateFnReturnType, SerializableOrJSHandle //
function evaluateAndReturn(page, pageFunction) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var functionText, func, result, errorMessage, error, jsStack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    functionText = pageFunction.toString();
                    try {
                        new Function('(' + functionText + ')');
                    }
                    catch (error) {
                        // This means we might have a function shorthand. Try another
                        // time prefixing 'function '.
                        if (functionText.startsWith('async ')) {
                            functionText =
                                'async function ' + functionText.substring('async '.length);
                        }
                        else {
                            functionText = 'function ' + functionText;
                        }
                        try {
                            new Function('(' + functionText + ')');
                        }
                        catch (error) {
                            // We tried hard to serialize, but there's a weird beast here.
                            throw new Error('Passed function is not well-serializable!');
                        }
                    }
                    func = new Function("\n      var __assign = (this && this.__assign) || function () {\n        __assign = Object.assign || function(t) {\n            for (var s, i = 1, n = arguments.length; i < n; i++) {\n                s = arguments[i];\n                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                    t[p] = s[p];\n            }\n            return t;\n        };\n        return __assign.apply(this, arguments);\n      };\n\n      var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n        return new (P || (P = Promise))(function (resolve, reject) {\n            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n            function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n            step((generator = generator.apply(thisArg, _arguments || [])).next());\n        });\n      };\n      var __generator = (this && this.__generator) || function (thisArg, body) {\n        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n        return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n        function verb(n) { return function (v) { return step([n, v]); }; }\n        function step(op) {\n            if (f) throw new TypeError(\"Generator is already executing.\");\n            while (_) try {\n                if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n                if (y = 0, t) op = [op[0] & 2, t.value];\n                switch (op[0]) {\n                    case 0: case 1: t = op; break;\n                    case 4: _.label++; return { value: op[1], done: false };\n                    case 5: _.label++; y = op[1]; op = [0]; continue;\n                    case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                    default:\n                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                        if (t[2]) _.ops.pop();\n                        _.trys.pop(); continue;\n                }\n                op = body.call(thisArg, _);\n            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n        }\n      };\n      var _this; // for arrow function\n\n      return new Promise(async (resolve) => {\n        try {\n          return resolve(await (".concat(functionText, ").apply(this, arguments));\n        } catch (error) {\n          return resolve({\n            __error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),\n          });\n        }\n      });"));
                    return [4 /*yield*/, page.evaluate.apply(page, __spreadArray([func], args, false))];
                case 1:
                    result = (_a.sent());
                    if (result !== null && typeof result === 'object' && '__error' in result) {
                        errorMessage = result.__error.message || JSON.stringify(result.__error);
                        error = new Error(errorMessage);
                        Object.assign(error, result.__error);
                        jsStack = error.stack;
                        Error.captureStackTrace(error);
                        if (jsStack) {
                            error.stack = "".concat(error.stack || '', "\nJS Stack: ").concat(jsStack, "\nFunction: ").concat(functionText);
                        }
                        throw error;
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
