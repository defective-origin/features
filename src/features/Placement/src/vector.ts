import { compareAndSelectBy, eqBy, geBy, gtBy, isNumber, leBy, ltBy } from './common'

export class Vector {
  public x: number
  public y: number

  public constructor(point: number | Vector)
  public constructor(x: number, y: number)
  public constructor(x_or_point: any, y?: any) {
    if (isNumber(y)) {
      this.x = x_or_point
      this.y = y
    } else if (isNumber(x_or_point)) {
      this.x = x_or_point
      this.y = x_or_point
    } else {
      this.x = x_or_point.x
      this.y = x_or_point.y
    }
  }
}

export const ZeroVector = new Vector(0, 0)
export const MinimalVector = new Vector(-Infinity)
export const MaximalVector = new Vector(Infinity)

export type VectorKeys = keyof Vector

// ---------------------- MOVING ----------------------

/**
 * Move vector like object by given delta.
 *
 * @param { Vector } item Object with Vector
 * @param { Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const moveByX = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    x: item.x + deltaVector.x,
  }
}

/**
 * Move vector like object by given delta.
 *
 * @param { Vector } item Object with Vector
 * @param { Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const moveByY = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    y: item.y + deltaVector.y,
  }
}

/**
 * Move vector like object by given delta.
 *
 * @param { Vector } item Object with Vector
 * @param { Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const moveByXY = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    x: item.x + deltaVector.x,
    y: item.y + deltaVector.y,
  }
}

/**
 * Move vector like object by given delta. Alias for move().
 *
 * @param { Vector } item Object with Vector
 * @param { Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const addByX = <
  T extends Vector
>(item: T, delta: number | Vector): T => moveByX(item, delta)

/**
 * Move vector like object by given delta. Alias for move().
 *
 * @param { Vector } item Object with Vector
 * @param { Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const addByY = <
  T extends Vector
>(item: T, delta: number | Vector): T => moveByY(item, delta)

/**
 * Move vector like object by given delta. Alias for move().
 *
 * @param { Vector } item Object with Vector
 * @param { Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const addByXY = <
  T extends Vector
>(item: T, delta: number | Vector): T => moveByXY(item, delta)

/**
 * Move vector like object back by given delta.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const subtractByX = <
  T extends Vector
>(item: T, delta: number | Vector): T => moveByX(item, multiplyByXY(new Vector(delta), -1))

/**
 * Move vector like object back by given delta.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const subtractByY = <
  T extends Vector
>(item: T, delta: number | Vector): T => moveByY(item, multiplyByXY(new Vector(delta), -1))

/**
 * Move vector like object back by given delta.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const subtractByXY = <
  T extends Vector
>(item: T, delta: number | Vector): T => moveByXY(item, multiplyByXY(new Vector(delta), -1))

/**
 * Shifts vector forward like object several times.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const multiplyByX = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    x: item.x * deltaVector.x,
  }
}

/**
 * Shifts vector forward like object several times.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const multiplyByY = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    y: item.y * deltaVector.y,
  }
}

/**
 * Shifts vector forward like object several times.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const multiplyByXY = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    x: item.x * deltaVector.x,
    y: item.y * deltaVector.y,
  }
}

/**
 * Shifts vector back like object several times.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const divideByX = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    x: deltaVector.x ? item.x / deltaVector.x : item.x,
  }
}

/**
 * Shifts vector back like object several times.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const divideByY = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    y: deltaVector.y ? item.y / deltaVector.y : item.y,
  }
}

/**
 * Shifts vector back like object several times.
 *
 * @param { Vector } item Object with Vector
 * @param { number | Vector } delta Offset vector
 * @returns { Vector } Return new vector object based on moved object
 */
export const divideByXY = <
  T extends Vector
>(item: T, delta: number | Vector): T => {
  const deltaVector = new Vector(delta)
  
  return {
    ...item,
    x: deltaVector.x ? item.x / deltaVector.x : item.x,
    y: deltaVector.y ? item.y / deltaVector.y : item.y,
  }
}

// ---------------------- COMPARISON ----------------------

/**
 * Compare two objects and return true if two vectors are equal by x vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if two vectors are equal by x vector otherwise false.
 */
export const eqByX = (a: Vector, b: Vector): boolean => eqBy(a, b, 'x')

/**
 * Compare two objects and return true if two vectors are equal by y vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if two vectors are equal by y vector otherwise false.
 */
export const eqByY = (a: Vector, b: Vector): boolean => eqBy(a, b, 'y')

/**
 * Compare two objects and return true if two vectors are equal otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if two vectors are equal otherwise false.
 */
export const eqByXY = (a: Vector, b: Vector): boolean => eqByX(a, b) && eqByY(a, b)

/**
 * Compare two objects and return true if vector a less then b by x vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a less then b by x vector otherwise false.
 */
export const ltByX = (a: Vector, b: Vector): boolean => ltBy(a, b, 'x')

/**
 * Compare two objects and return true if vector a less then b by y vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a less then b by y vector otherwise false.
 */
export const ltByY = (a: Vector, b: Vector): boolean => ltBy(a, b, 'y')

/**
 * Compare two objects and return true if vector a less then b otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a less then b otherwise false.
 */
export const ltByXY = (a: Vector, b: Vector): boolean => ltByX(a, b) && ltByY(a, b)

/**
 * Compare two objects and return true if vector a great then b by x vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a great then b by x vector otherwise false.
 */
export const gtByX = (a: Vector, b: Vector): boolean => gtBy(a, b, 'x')

/**
 * Compare two objects and return true if vector a great then b by y vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a great then b by y vector otherwise false.
 */
export const gtByY = (a: Vector, b: Vector): boolean => gtBy(a, b, 'y')

/**
 * Compare two objects and return true if vector a great then b otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a great then b otherwise false.
 */
export const gtByXY = (a: Vector, b: Vector): boolean => gtByX(a, b) && gtByY(a, b)

/**
 * Compare two objects and return true if vector a less then b or equal by x vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a less then b or equal by x vector otherwise false.
 */
export const leByX = (a: Vector, b: Vector): boolean => leBy(a, b, 'x')

/**
 * Compare two objects and return true if vector a less then b or equal by y vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a less then b or equal by y vector otherwise false.
 */
export const leByY = (a: Vector, b: Vector): boolean => leBy(a, b, 'y')

/**
 * Compare two objects and return true if vector a less then b or equal otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a less then b or equal otherwise false.
 */
export const leByXY = (a: Vector, b: Vector): boolean => ltByXY(a, b) && eqByXY(a, b)

/**
 * Compare two objects and return true if vector a great then b or equal by x vector otherwise false.
 *
 * @param { Vector } a Object with Vector
 * @param { Vector } b Object with Vector
 * @returns { boolean } Return true if vector a great then b or equal by x vector otherwise false.
 */
export const geByX = (a: Vector, b: Vector): boolean => geBy(a, b, 'x')

/**
  * Compare two objects and return true if vector a great then b or equal by y vector otherwise false.
  *
  * @param { Vector } a Object with Vector
  * @param { Vector } b Object with Vector
  * @returns { boolean } Return true if vector a great then b or equal by y vector otherwise false.
  */
export const geByY = (a: Vector, b: Vector): boolean => geBy(a, b, 'y')

/**
  * Compare two objects and return true if vector a great then b or equal otherwise false.
  *
  * @param { Vector } a Object with Vector
  * @param { Vector } b Object with Vector
  * @returns { boolean } Return true if vector a great then b or equal otherwise false.
  */
export const geByXY = (a: Vector, b: Vector): boolean => gtByXY(a, b) && eqByXY(a, b)


// ---------------------- SELECTION ----------------------

/**
 * Return maximal Vector by x.
 *
 * @param { Vector[] } items Vector items
 * @returns { Vector } Return maximal Vector by x
 */
export const maxByX = (items: Vector[]): Vector | null => compareAndSelectBy(items, gtByX)

/**
 * Return maximal Vector by y.
 *
 * @param { Vector[] } items Vector items
 * @returns { Vector } Return maximal Vector by y
 */
export const maxByY = (items: Vector[]): Vector | null => compareAndSelectBy(items, gtByY)

/**
 * Return maximal Vector.
 *
 * @param { Vector[] } items Vector items
 * @returns { Vector } Return maximal Vector
 */
export const maxByXY = (items: Vector[]): Vector | null => {
  if (!items.length) {
    return null
  }

  return {
    x: (maxByX(items) as Vector).x,
    y: (maxByY(items) as Vector).y,
  }
}

/**
 * Return minimal Vector by x.
 *
 * @param { Vector[] } items Vector items
 * @returns { Vector } Return minimal Vector by x
 */
export const minByX = (items: Vector[]): Vector | null => compareAndSelectBy(items, ltByX)

/**
* Return minimal Vector by y.
*
* @param { Vector[] } items Vector items
* @returns { Vector } Return minimal Vector by y
*/
export const minByY = (items: Vector[]): Vector | null => compareAndSelectBy(items, ltByY)

/**
 * Return minimal Vector.
 *
 * @param { Vector[] } items Vector items
 * @returns { Vector } Return minimal Vector
 */
export const minByXY = (items: Vector[]): Vector | null => {
  if (!items.length) {
    return null
  }
  
  return {
    x: (minByX(items) as Vector).x,
    y: (minByY(items) as Vector).y,
  }
}

/**
 * Return Vector in the middle of all points.
 *
 * @param { Vector[] } items Vector items
 * @returns { Vector } Return Vector in the middle of all points.
 */
export const avgByXY = (items: Vector[]): Vector | null => {
  if (!items.length) {
    return null
  }

  const maxVector = maxByXY(items) as Vector
  const minVector = minByXY(items) as Vector

  return {
    x: minVector.x + (maxVector.x - minVector.x) / 2,
    y: minVector.y + (maxVector.y - minVector.y) / 2,
  }
}

/**
 * Return Vectors which have the same x.
 *
 * @param { Vector[] } items Vector items
 * @param { Vector } item Vector item
 * @returns { Vector } Return Vectors which have the same x.
 */
export const sameByX = <
  T extends Vector
>(items: T[] = [], item: Vector): T[] => items.filter((i) => eqByX(item, i))

/**
 * Return Vectors which have the same y.
 *
 * @param { Vector[] } items Vector items
 * @param { Vector } item Vector item
 * @returns { Vector } Return Vectors which have the same y.
 */
export const sameByY = <
  T extends Vector
>(items: T[] = [], item: Vector): T[] => items.filter((i) => eqByY(item, i))

/**
 * Return same Vectors.
 *
 * @param { Vector[] } items Vector items
 * @param { Vector } item Vector item
 * @returns { Vector } Return same Vectors.
 */
export const sameByXY = <
  T extends Vector
>(items: T[] = [], item: Vector): T[] => items.filter((i) => eqByXY(item, i))
