/**
 * Compare two objects and return true if two objects are equal by one parameter otherwise false.
 *
 * @param { object } a Object
 * @param { object } b Object
 * @param { string } selector Key from object
 * @returns { boolean } Return true if two objects are equal by one parameter otherwise false.
 */
export const eqBy = <T>(a: T, b: T, selector: keyof T): boolean => a[selector] === b[selector]

/**
 * Compare two objects and return true if object a less then object b otherwise false.
 *
 * @param { object } a Object
 * @param { object } b Object
 * @param { string } selector Key from object
 * @returns { boolean } Return true if object a less then object b otherwise false.
 */
export const ltBy = <T>(a: T, b: T, selector: keyof T): boolean => a[selector] < b[selector]

/**
 * Compare two objects and return true if object a great then object b otherwise false.
 *
 * @param { object } a Object
 * @param { object } b Object
 * @param { string } selector Key from object
 * @returns { boolean } Return true if object a great then object b otherwise false.
 */
export const gtBy = <T>(a: T, b: T, selector: keyof T): boolean => a[selector] > b[selector]

/**
  * Compare two objects and return true if object a less then b or equal otherwise false.
  *
  * @param { object } a Object
  * @param { object } b Object
  * @param { string } selector Key from object
  * @returns { boolean } Return true if object a less then b or equal otherwise false.
  */
export const leBy = <T>(a: T, b: T, selector: keyof T): boolean => ltBy(a, b, selector) || eqBy(a, b, selector)

/**
   * Compare two objects and return true if object a great then b or equal otherwise false.
   *
   * @param { object } a Object
   * @param { object } b Object
   * @param { string } selector Key from object
   * @returns { boolean } Return true if object a great then b or equal otherwise false.
   */
export const geBy = <T>(a: T, b: T, selector: keyof T): boolean => gtBy(a, b, selector) || eqBy(a, b, selector)

export const isNumber = (value: any): value is number => typeof value === 'number'

/**
 * Compare items and return item which is compared and return true.
 *
 * @param { Array<Vector> } items Items
 * @returns { Vector } Return selected item
 */
export const compareAndSelectBy = <T>(items: Array<T>, compare: (a: T, b: T) => boolean): T | null => {
  if (!items.length) {
    return null
  }

  let line: T = items[0]

  for (const item of items) {
    if (compare(item, line)) {
      line = item
    }
  }

  return line
}
