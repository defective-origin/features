import { StringMap, TFunctionResult, TOptions } from "i18next";
import { DefaultNamespace, Namespace, TFuncKey, TFuncReturn, useTranslation } from "react-i18next";
import { buildKey, RecursiveNodeSelector, recursiveToMap } from "../recursive/recursive.utils";

// it is override of react-i18next\ts4.1\index.d.ts line 217
export interface TFunction<N extends Namespace = DefaultNamespace, TKPrefix = undefined> {
  <
    TKeys extends TFuncKey<N, TKPrefix> | TemplateStringsArray extends infer A ? A : never,
    TDefaultResult extends TFunctionResult = string,
    TInterpolationMap extends object = StringMap
  >(
    options?: TOptions<TInterpolationMap> | string,
  ): TFuncReturn<N, TKeys, TDefaultResult, TKPrefix>;
  <
    TKeys extends TFuncKey<N, TKPrefix> | TemplateStringsArray extends infer A ? A : never,
    TDefaultResult extends TFunctionResult = string,
    TInterpolationMap extends object = StringMap
  >(
    defaultValue?: string,
    options?: TOptions<TInterpolationMap> | string,
  ): TFuncReturn<N, TKeys, TDefaultResult, TKPrefix>;
}

/**
 * Build translation hook with Structure pattern of translation map and namespace.
 * @example
 * const NAMESPACE = {
 *  COMMON: 'COMMON'
 * }
 * const EN_LOCALE = {
 *   "Button":  {
 *     "submit": "Submit",
 *     "cancel": "Cancel"
 *   },
 *   "Menu": {
 *     "home": "Home",
 *     "about": "About us",
 *     "Delivery": "Delivery"
 *   },
 *   "title": "Delivery distance {{ distance }} km"
 * }
 * 
 * const useCommonTranslation = buildTranslationHook(EN_LOCALE, NAMESPACE.COMMON)
 * 
 * 
 * function SomeComponent(props) {
 *  const { tm } = useCommonTranslation()
 * 
 *  return (
 *    <div>
 *      <h1>{tm.title({ distance: props.distance })}</h1>
 *      <ul>
 *        <li>{tm.Menu.home()}</li>
 *        <li>{tm.Menu.about()}</li>
 *        <li>{tm.Menu.Delivery()}</li>
 *      </ul>
 *    </div>
 *  )
 * }
 * 
 * @param template Structure pattern of translation map.
 * @param ns Namespace of translation map.
 * @param options Translation options.
 * @returns Built hook.
 */
export function buildTranslationHook<R extends object>(template: R, ...args: Parameters<typeof useTranslation>) {
  return function useTranslationHook() {
    const trans = useTranslation(...args)
    const valueSelector: RecursiveNodeSelector<R, TFunction> = (options) => {
      const path = buildKey(options.path)
      return (...tArgs: any) => trans.t(path, ...tArgs)
    }
    const tm = recursiveToMap(template, { valueSelector })

    return  { ...trans, tm }
  }
}
