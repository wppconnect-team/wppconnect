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

import {
  EvaluateFn,
  EvaluateFnReturnType,
  Page,
  SerializableOrJSHandle,
} from 'puppeteer';

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

  console.log(functionText);

  // functionText = 'function() {return arguments;}';

  const func = new Function(`
      return Promise.resolve(
        (${functionText}).apply(this, arguments)
      ).catch((error) => ({
        __error: error,
      }));`);

  const result = (await page.evaluate(func as any, ...args)) as any;

  if (typeof result === 'object' && '__error' in result) {
    throw result.__error;
  }

  return result;
}
