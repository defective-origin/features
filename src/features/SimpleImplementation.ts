import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { RecursiveObjectToMap } from "./recursive/recursive.types"
import { buildKey } from "./recursive/recursive.utils"

export type RecursiveValueSelector<R extends any, TResult extends any = any> = (item: any, path: string[], resource: R) => TResult
/**
 * Convert all objects to maps with selection values
 * @example
 * const TEST_OBJECT = {
 *   KEY_1: 'TRANSLATE TEST_STRING',
 *   KEY_2: {
 *     KEY_3: null,
 *     KEY_4: true,
 *   },
 *   KEY_5: [
 *     undefined,
 *     {
 *       KEY_6: 3,
 *       KEY_7: false,
 *     },
 *   ]
 * } as const
 *
 * const map = recursiveToMap(TEST_OBJECT)
 * // {
 * //   KEY_1: 'KEY_1',
 * //   KEY_2: {
 * //     KEY_3: 'KEY_2.KEY_3',
 * //     KEY_4: 'KEY_2.KEY_4',
 * //   },
 * //   KEY_5: {
 * //     '_0': 'KEY_5.0',
 * //     '_1': {
 * //       KEY_6: 'KEY_5.1.KEY_6',
 * //       KEY_7: 'KEY_5.1.KEY_7',
 * //     },
 * //   }
 * // }
 * 
 * P.S. Array works correctly only if object is const
 * 
 * @param resource Any object. Map can be nested.
 * @param valueSelector Function which returns new value.
 * @returns Object map.
 */
export function recursiveToMap<R extends object, F extends RecursiveValueSelector<R>>(resource: R, valueSelector: F, path: string[] = []): RecursiveObjectToMap<R, ReturnType<F>> {
  return Object.entries(resource).reduce(
    (acc, [key, item]) => {
      const _path = path.concat(key)
      const _key = Array.isArray(item) ? `_${key}` : key

      if (typeof item === 'object' && item !== null) {
        acc[_key] = recursiveToMap(item, valueSelector, _path)
      } else {
        acc[_key] = valueSelector(item, _path, resource)
      }
  
      return acc
    },
    {} as any
  )
}

/**
 * Convert recursively values into path values
 * @example
 * const LOCALE_MAP = {
 *   KEY_1: 'TRANSLATE STRING',
 *   KEY_2: {
 *     KEY_3: null,
 *     KEY_4: true,
 *   },
 *   KEY_5: [
 *     undefined,
 *     {
 *       KEY_6: 3,
 *       KEY_7: false,
 *     },
 *   ]
 * } as const
 *
 * // Convert only leaf nodes
 * const LeafPathMap = toPathMap(LOCALE_MAP)
 * // {
 * //   KEY_1: 'KEY_1',
 * //   KEY_2: {
 * //     KEY_3: 'KEY_2.KEY_3',
 * //     KEY_4: 'KEY_2.KEY_4',
 * //   },
 * //   KEY_5: {
 * //     _0: 'KEY_5.0',
 * //     _1: {
 * //       KEY_6: 'KEY_5.1.KEY_6',
 * //       KEY_7: 'KEY_5.1.KEY_7',
 * //     }
 * //   }
 * // }
 *
 * LeafPathMap.KEY_5._1.KEY_6
 * // 'KEY_5.1.KEY_6'
 * 
 * P.S. Array works correctly only if object is const
 * 
 * @param resource Any object. Map can be nested.
 * @returns Map with path values.
 */
export function toPathMap<R extends Record<string | number, any>>(resource: R): RecursiveObjectToMap<R, string> {
  const valueSelector: RecursiveValueSelector<R, string> = (_, path) => buildKey(path)
  return recursiveToMap(resource, valueSelector)
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
    const valueSelector: RecursiveValueSelector<R, TFunction> = (_, path) => {
      const _path = buildKey(path)
      return (...tArgs: any) => trans.t(_path, ...tArgs)
    }
    const tm = recursiveToMap(template, valueSelector)

    return  { ...trans, tm }
  }
}
