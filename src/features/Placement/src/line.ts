import { compareAndSelectBy, eqBy, geBy, gtBy, leBy, ltBy } from './common'
import { Vector } from './vector'

export class Line {
  public v1: Vector
  public v2: Vector

  public constructor(v1: number | Vector, v2: number | Vector) {
    this.v1 = new Vector(v1)
    this.v2 = new Vector(v2)
  }

  public get length() {
    return Math.sqrt(Math.pow(this.v2.x - this.v1.x, 2) + Math.pow(this.v2.y - this.v1.y, 2))
  }
}

// ---------------------- COMPARISON ----------------------

/**
 * Compare two objects and return true if two lines are equal by line length line otherwise false.
 *
 * @param { Line } a Object with Line
 * @param { Line } b Object with Line
 * @returns { boolean } Return true if two lines are equal by line length line otherwise false.
 */
export const eqByLength = (a: Line, b: Line): boolean => eqBy(a, b, 'length')

/**
  * Compare two objects and return true if line a less then b by line length line otherwise false.
  *
  * @param { Line } a Object with Line
  * @param { Line } b Object with Line
  * @returns { boolean } Return true if line a less then b by line length line otherwise false.
  */
export const ltByLength = (a: Line, b: Line): boolean => ltBy(a, b, 'length')

/**
  * Compare two objects and return true if line a great then b by line length line otherwise false.
  *
  * @param { Line } a Object with Line
  * @param { Line } b Object with Line
  * @returns { boolean } Return true if line a great then b by line length line otherwise false.
  */
export const gtByLength = (a: Line, b: Line): boolean => gtBy(a, b, 'length')

/**
  * Compare two objects and return true if line a less then b or equal by line length line otherwise false.
  *
  * @param { Line } a Object with Line
  * @param { Line } b Object with Line
  * @returns { boolean } Return true if line a less then b or equal by line length line otherwise false.
  */
export const leByLength = (a: Line, b: Line): boolean => leBy(a, b, 'length')

/**
  * Compare two objects and return true if line a great then b or equal by line length line otherwise false.
  *
  * @param { Line } a Object with Line
  * @param { Line } b Object with Line
  * @returns { boolean } Return true if line a great then b or equal by line length line otherwise false.
  */
export const geByLength = (a: Line, b: Line): boolean => geBy(a, b, 'length')

/**
 * Return true if lines are crossed otherwise false.
 *
 * @param { Line[] } a Line
 * @param { Line[] } b Line
 * @returns { Line } Return true if line is crossed otherwise false.
 */
export const crossByLine = (a: Line, b: Line): boolean => {
  const det = (a.v2.x - a.v1.x) * (b.v2.y - b.v1.y) - (b.v2.x - b.v1.x) * (a.v2.y - a.v1.y);
  if (det === 0) {
    return false;
  }

  const lambda = ((b.v2.y - b.v1.y) * (b.v2.x - a.v1.x) + (b.v1.x - b.v2.x) * (b.v2.y - a.v1.y)) / det;
  const gamma = ((a.v1.y - a.v2.y) * (b.v2.x - a.v1.x) + (a.v2.x - a.v1.x) * (b.v2.y - a.v1.y)) / det;

  return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
};

// ---------------------- SELECTION ----------------------

/**
 * Return Line with maximal length.
 *
 * @param { Line[] } items Line items
 * @returns { Line } Return maximal Line
 */
export const maxByLength = (items: Line[]): Line | null => compareAndSelectBy(items, gtByLength)

/**
 * Return Line with minimal length.
 *
 * @param { Line[] } items Line items
 * @returns { Line } Return minimal Line
 */
export const minByLength = (items: Line[]): Line | null => compareAndSelectBy(items, ltByLength)
