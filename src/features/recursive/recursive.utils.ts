import { concat, reduce, isPlainObject, set, isArray, get, toPath, isNil, isFunction, PropertyPath, isNumber, includes, overSome, clone, defaults, stubObject, last, defaultTo } from 'lodash'
import { Base } from '../types/general.types'
import { ObjectToMap, PickObjects } from '../types/object.types'
import { Postfix } from '../types/string.types'
import { Recursive, RecursiveNonNullable, RecursiveObjectToMap } from './recursive.types'

// TODO: CHANGE DOCUMENTATION for all functions
export const enum RecursiveTreeNode {
  leaf = 'leaf',
  branch = 'branch',
  both = 'both',
}

export type RecursiveOptions<R extends object, TSelector extends any = any> = {
  /* Set which node values and keys should be updated */
  mutate?: RecursiveTreeNode
  /* Function which returns new value */
  nodeSelector?: RecursiveNodeSelector<R, TSelector>
  /* Function which returns new key */
  keySelector?: RecursiveKeySelector<R>
  /* Function which returns tuple with new [key, value] */
  mutator?: RecursiveMutator<R, TSelector>
  /* Function which returns new key for origin nested object */
  nestedKeySelector?: RecursiveKeySelector<R>
  /* Function which returns new nested object */
  initObject?: RecursiveInitObject<R>
  /* Function which return true if object should be nested otherwise false */
  shouldBeNested?: RecursiveShouldBeNested<R>
  /* Function which return true if item should be mutated otherwise false */
  shouldBeMutated?: RecursiveShouldBeMutated<R>
}

const isMarkedAsMutable: RecursiveIsMutable = overSome([
  (isNestedItem, mutate) => isNestedItem && includes([RecursiveTreeNode.branch, RecursiveTreeNode.both], mutate),
  (isNestedItem, mutate) => !isNestedItem && includes([RecursiveTreeNode.leaf, RecursiveTreeNode.both], mutate),
])

const DEFAULT_RECURSIVE_OPTIONS: Required<RecursiveOptions<object>> = {
  mutate: RecursiveTreeNode.leaf,
  nestedKeySelector: (options) => options.key,
  nodeSelector: (options) => options.node,
  keySelector: (options) => options.key,
  mutator: function (options) { return [this.keySelector(options), this.nodeSelector(options)] },
  initObject: (options) => isArray(options.node) ? [] : {},
  shouldBeNested: (options) => isPlainObject(options.node) || isArray(options.node),
  shouldBeMutated: (options) => !!options.isMutable,
}

// TODO: change type if leaf, branch, both
export type RecursiveItemOptions<R extends any> = {
  node: RecursiveValueType<R>,
  key: number | string,
  path: string[],
  resource: R,
  isNestable?: boolean,
  isMutable?: boolean,
}
export type RecursiveSimpleValueType<R extends any> = R extends object ? RecursiveSimpleValueType<R[keyof R]> : R
export type RecursiveObjectValueType<R extends any> = R extends object ? RecursiveValueType<R[keyof R]> | R : never
export type RecursiveValueType<R extends any> = RecursiveSimpleValueType<R> | RecursiveObjectValueType<R>
export type RecursiveHandlerFunc<R extends any, TResult extends any = any> = (options: RecursiveItemOptions<R>) => TResult
export type RecursiveKeySelector<R extends any = any> = RecursiveHandlerFunc<R, number | string | any>
export type RecursiveNodeSelector<R extends any, TResult extends any = any> = RecursiveHandlerFunc<R, TResult>
export type RecursiveInitObject<R extends any> = RecursiveHandlerFunc<R, object>
export type RecursiveShouldBeNested<R extends any> = RecursiveHandlerFunc<R, boolean>
export type RecursiveShouldBeMutated<R extends any> = RecursiveHandlerFunc<R, boolean>
export type RecursiveMutator<R extends any = any, TSelector extends any = any> = RecursiveHandlerFunc<R, [ReturnType<RecursiveKeySelector<R>>, ReturnType<RecursiveNodeSelector<R, TSelector>>]>
export type RecursiveIsMutable = (isNestedItem: boolean, mutate: RecursiveTreeNode) => boolean


/**
 * Convert recursively values into result of callback
 * @example
 * const TEST_OBJECT = {
 *   KEY_1: 'TEST_STRING',
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
 * const GlobalLocalePathMap = recursive(TEST_OBJECT, { valueSelector: () => TEST_REPLACE_VALUE })
 * {
 *   KEY_1: TEST_REPLACE_VALUE,
 *   KEY_2: {
 *     KEY_3: TEST_REPLACE_VALUE,
 *     KEY_4: TEST_REPLACE_VALUE
 *   },
 *   KEY_5: [
 *     TEST_REPLACE_VALUE,
 *     {
 *       KEY_6: TEST_REPLACE_VALUE,
 *       KEY_7: TEST_REPLACE_VALUE,
 *     }
 *   ]
 * }
 * 
 * 
 * OPTIONS:
 * Set which node values and keys should be updated
 * mutate?: RecursiveTreeNode
 * 
 * Function which returns new value
 * valueSelector?: RecursiveValueSelector<R>
 * 
 * Function which returns new key
 * keySelector?: RecursiveKeySelector<R>
 * 
 * Function which returns tuple with new [key, value]
 * mutator?: RecursiveMutator<R>
 * 
 * Function which returns new key for origin nested object
 * nestedKeySelector?: RecursiveKeySelector<R>
 * 
 * Function which returns new nested object
 * initObject?: RecursiveInitObject<R>
 * 
 * Function which return true if object should be nested otherwise false
 * shouldBeNested?: RecursiveShouldBeNested<R>
 * 
 * Function which return true if item should be mutated otherwise false
 * shouldBeMutated?: ShouldBeMutated<R>
 * 
 * 
 * 
 * P.S. Array works correctly only if object is const
 * 
 * @param resource Any object. Map can be nested.
 * @param options Config options.
 * @param path Starting path. By default empty.
 * @returns Map with path values.
 */
export function recursive<R extends object, TSelector extends any = any>(
  resource: R,
  options: RecursiveOptions<R> = {},
  path?: PropertyPath,
): Recursive<R, ReturnType<RecursiveNodeSelector<R, TSelector>>> {
  const _options = defaults(options, DEFAULT_RECURSIVE_OPTIONS)
  const _path = toPath(path)
  const objectOptions: RecursiveItemOptions<R> = {
    node: _path.length ? get(resource, _path) : resource,
    key: defaultTo(last(_path), ''),
    path: _path,
    resource,
  }

  return reduce(objectOptions.node as object, (acc, node, key) => {
    const itemOptions: RecursiveItemOptions<R> = { node, key, resource, path: concat(_path, key) }
    itemOptions.isNestable = _options.shouldBeNested(itemOptions)
    itemOptions.isMutable = isMarkedAsMutable(itemOptions.isNestable, _options.mutate)

    if (itemOptions.isNestable) {
      set(acc, _options.nestedKeySelector(itemOptions), recursive(resource, options, itemOptions.path))
    }

    if (_options.shouldBeMutated(itemOptions)) {
      const [newKey, newValue] = _options.mutator(itemOptions)
      set(acc, newKey, newValue)
    }

    return acc
  }, _options.initObject(objectOptions)) as any
}



export type LeafPathMap<
  O extends object,
  T0 extends object = ObjectToMap<O>,
  T1 = { [P in keyof T0]: T0[P] extends object ? LeafPathMap<T0[P]> : string },
> = T1

export type FullPathMap<
  O extends object,
  T0 extends object = ObjectToMap<O>,
  T1 = Record<Postfix<keyof T0, '$'>, string>,
  T2 = PickObjects<T0>,
  T3 = T1 & T2,
  T4 = { [P in keyof T3]: T3[P] extends object ? FullPathMap<T3[P]> : T3[P] },
> = T4

export function buildKey(path: string[], separator?: '.'): string {
  return path.join(separator)
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
 * 
 * // Convert only leaf and branch nodes
 * const FullPathMap = toPathMap(LOCALE_MAP, true)
 * // {
 * //   KEY_1$: 'KEY_1',
 * //   KEY_2$: 'KEY_2',
 * //   KEY_2: {
 * //     KEY_3$: 'KEY_2.KEY_3',
 * //     KEY_4$: 'KEY_2.KEY_4',
 * //   },
 * //   KEY_5$: 'KEY_5',
 * //   KEY_5: {
 * //     '_0$': 'KEY_5.0',
 * //     '_1$': 'KEY_5.1',
 * //     '_1': {
 * //       KEY_6$: 'KEY_5.1.KEY_6',
 * //       KEY_7$: 'KEY_5.1.KEY_7',
 * //     },
 * //   },
 * // }
 *
 * FullPathMap.KEY_5._1$
 * // 'KEY_5.1'
 * FullPathMap.KEY_5._1.KEY_6$
 * // 'KEY_5.1.KEY_6'
 * 
 * P.S. Array works correctly only if object is const
 * 
 * @param resource Any object. Map can be nested.
 * @param fullMap True if map should have nested object paths otherwise false.
 * @returns Map with path values.
 */
export function toPathMap<R extends object, F extends boolean>(resource: R, fullMap?: F): F extends true ? FullPathMap<R> : LeafPathMap<R> {
  const valueSelector: RecursiveNodeSelector<R, string> = (options) => buildKey(options.path)

  return recursiveToMap(resource, { valueSelector, fullMap }) as any
}



/**
 * Convert recursively null or undefined values into default values
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
 * const GlobalLocalePathMap1 = recursiveDefault(TEST_OBJECT, 'DEFAULT')
 * const GlobalLocalePathMap2 = recursiveDefault(TEST_OBJECT, (value, path, resource) => 'DEFAULT')
 * // {
 * //   KEY_1: 'TEST_STRING',
 * //   KEY_2: {
 * //     KEY_3: TEST_DEFAULT_VALUE,
 * //     KEY_4: true,
 * //   },
 * //   KEY_5: [
 * //     TEST_DEFAULT_VALUE,
 * //     {
 * //       KEY_6: 3,
 * //       KEY_7: false,
 * //     },
 * //   ]
 * // }
 * 
 * P.S. Array works correctly only if object is const
 * 
 * @param resource Any object. Map can be nested.
 * @param selectorOrValue Function which convert value or value.
 * @returns Map with path values.
 */
export function recursiveDefault<R extends object, D extends RecursiveNodeSelector<R> | Base>(resource: R, selectorOrValue: D): RecursiveNonNullable<R> {
  const valueSelector: RecursiveNodeSelector<R> = (options) => {
    if (isNil(options.node)) {
      return isFunction(selectorOrValue) ? selectorOrValue(options) : clone(selectorOrValue as Base)
    }

    return options.node
  }

  return recursive(resource, { nodeSelector: valueSelector }) as any
}



export const DEFAULT_RECURSIVE_MAP_OPTIONS: Required<RecursiveMapOptions<object>> = {
  fullMap: false,
  postfix: '$',
  valueSelector: (options) => options.node
}

export type RecursiveMapOptions<R extends object, TSelector extends any = any> = {
  fullMap?: boolean
  postfix?: string
  /* Function which returns new value */
  valueSelector?: RecursiveNodeSelector<R, TSelector>
}

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
 * @param options Config options.
 * @returns Object map.
 */
export function recursiveToMap<R extends object, TSelector extends any = any>(
  resource: R,
  options: RecursiveMapOptions<R, TSelector> = {},
): RecursiveObjectToMap<R, ReturnType<NonNullable<typeof options['valueSelector']>>> {
  const _options = defaults(options, DEFAULT_RECURSIVE_MAP_OPTIONS)
  const _postfix = _options.fullMap ? _options.postfix : ''
  const mutate = _options.fullMap ? RecursiveTreeNode.both : RecursiveTreeNode.leaf

  const nestedKeySelector: RecursiveKeySelector<R> = (options) => {
    const prefix = isNumber(options.key) || !isNaN(parseFloat(options.key)) ? '_' : ''
    return `${prefix}${options.key}`
  }

  const mutator: RecursiveMutator<R> = (options) => {
    return [`${nestedKeySelector(options)}${_postfix}`, _options.valueSelector(options)]
  }

  return recursive(resource, { mutator, initObject: stubObject, nestedKeySelector, mutate }) as any
}
