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

import { Page } from 'puppeteer';

import {
  EvaluateFn,
  EvaluateFnReturnType,
  SerializableOrJSHandle,
} from '../../types/Evaluate';

//EvaluateFn, EvaluateFnReturnType, SerializableOrJSHandle //

export async function evaluateAndReturn<T extends EvaluateFn>(
  page: Page,
  pageFunction: T,
  ...args: SerializableOrJSHandle[]
): Promise<
  EvaluateFnReturnType<T> extends PromiseLike<infer U>
    ? U
    : EvaluateFnReturnType<T>
> {
  // See https://github.com/puppeteer/puppeteer/blob/41f23beb0da2433cf9103e5d8fc22a03b1820336/src/common/ExecutionContext.ts#L196

  let functionText = pageFunction.toString();
  try {
    new Function('(' + functionText + ')');
  } catch (error) {
    // This means we might have a function shorthand. Try another
    // time prefixing 'function '.
    if (functionText.startsWith('async ')) {
      functionText =
        'async function ' + functionText.substring('async '.length);
    } else {
      functionText = 'function ' + functionText;
    }
    try {
      new Function('(' + functionText + ')');
    } catch (error) {
      // We tried hard to serialize, but there's a weird beast here.
      throw new Error('Passed function is not well-serializable!');
    }
  }

  /**
   * Polyfill async/await and promise converter
   * See https://github.com/basarat/typescript-book/blob/master/docs/async-await.md
   */
  const func = new Function(`
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
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
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
      var _this; // for arrow function

      return new Promise(async (resolve) => {
        try {
          return resolve(await (${functionText}).apply(this, arguments));
        } catch (error) {
          return resolve({
            __error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
          });
        }
      });`);

  const result = (await page.evaluate(func as any, ...args)) as any;

  if (result !== null && typeof result === 'object' && '__error' in result) {
    const errorMessage =
      result.__error.message || JSON.stringify(result.__error);

    const error = new Error(errorMessage);

    Object.assign(error, result.__error);

    let jsStack = error.stack;
    Error.captureStackTrace(error);
    if (jsStack) {
      error.stack = `${
        error.stack || ''
      }\nJS Stack: ${jsStack}\nFunction: ${functionText}`;
    }

    throw error;
  }

  return result;
}
