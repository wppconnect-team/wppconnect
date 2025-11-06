import { Page } from 'puppeteer';
import { EvaluateFn, EvaluateFnReturnType, SerializableOrJSHandle } from '../../types/Evaluate';
export declare function evaluateAndReturn<T extends EvaluateFn>(page: Page, pageFunction: T, ...args: SerializableOrJSHandle[]): Promise<EvaluateFnReturnType<T> extends PromiseLike<infer U> ? U : EvaluateFnReturnType<T>>;
