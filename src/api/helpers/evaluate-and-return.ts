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

// TODO: Remove this wrapper and use page.evaluate directly at all call sites
export async function evaluateAndReturn<T extends EvaluateFn>(
  page: Page,
  pageFunction: T,
  ...args: SerializableOrJSHandle[]
): Promise<
  EvaluateFnReturnType<T> extends PromiseLike<infer U>
    ? U
    : EvaluateFnReturnType<T>
> {
  return page.evaluate(pageFunction as any, ...args) as any;
}
