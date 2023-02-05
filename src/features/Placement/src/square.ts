import { Line } from './line'
import { maxByXY, minByXY, Vector } from './vector'

export class Square {
  public v1: Vector
  public v2: Vector

  constructor(v1: number | Vector, v2: number | Vector)
  constructor(v1: number | Vector, width: number, height: number)
  constructor(v1: any, v2_or_width: any, height?: any) {
    this.v1 = new Vector(v1)

    if (height) {
      this.v2 = new Vector(this.v1.x + v2_or_width, this.v1.y + height)
    } else {
      this.v2 = new Vector(v2_or_width)
    }
  }

  public get width() {
    return Math.abs(this.v1.x - this.v2.x)
  }

  public get height() {
    return Math.abs(this.v1.y - this.v2.y)
  }

  /**
   * Return object size offset Vector.
   *
   * @param { Square } item Square object
   * @returns { Vector } Return object start Vector.
   */
  public get size() {
    return new Vector(this.width, this.height)
  }
}

// ---------------------- COMPARISON ----------------------

export const pointInSquare = (a: Square, b: Vector): boolean =>
  a.v1.x <= b.x && b.x <= a.v2.x &&
  a.v1.y <= b.y && b.y <= a.v2.y

export const inSquare = (a: Square, b: Square): boolean =>
  squareCornerPoints(b).every((corner) => pointInSquare(a, corner))

export const outSquare = (a: Square, b: Square): boolean =>
  squareCornerPoints(b).every((corner) => !pointInSquare(a, corner))

export const crossSquare = (a: Square, b: Square): boolean =>
  !inSquare(a, b) && !outSquare(a, b)

// ---------------------- SELECTION ----------------------

export type LineVector = 'start' | 'center' | 'end'

const LineVectorHandler: Record<LineVector, (pos: number, length: number) => number> = {
  start: (pos, length) => pos,
  center: (pos, length) => pos + (length / 2),
  end: (pos, length) => pos + length,
}

/**
 * Return object Vector related to orientation.
 *
 * ------------------
 * |s-s   c-s   e-s |
 * |s-c   c-c   e-c |
 * |s-e   c-e   e-e |
 * ------------------
 * 
 * @param { Square } item Square object
 * @param { LineVector } x Orientation type
 * @param { LineVector } y Orientation type
 * @returns { Vector } Return oriented Vector.
 */
export const bySquarePoint = (item: Square, x: LineVector, y: LineVector): Vector => ({
  x: LineVectorHandler[x](item.v1.x, item.width),
  y: LineVectorHandler[y](item.v1.y, item.height),
})

/**
 * Create object bounding box.
 *
 * @param { Square[] } items Square items
 * @returns { Vector } Return bounding box
 */
export const outline = (items: Square[]): Square | null => {
  if (!items.length) {
    return null
  }

  const endCorner = maxByXY(items.map((item) => bySquarePoint(item, 'end', 'end'))) as Vector
  const startCorner = minByXY(items.map((item) => bySquarePoint(item, 'start', 'start'))) as Vector

  return new Square(startCorner, endCorner)
}

/**
 * Return all main lines in square.
 *
 * @param { Square[] } items Square items
 * @returns { Vector } Return all main lines in square.
 */
export const squareLines = (item: Square) => ({
  vertical: [
    new Line(bySquarePoint(item, 'start', 'start'), bySquarePoint(item, 'start', 'end')),
    new Line(bySquarePoint(item, 'center', 'start'), bySquarePoint(item, 'center', 'end')),
    new Line(bySquarePoint(item, 'end', 'start'), bySquarePoint(item, 'end', 'end')),
  ],
  horizontal: [
    new Line(bySquarePoint(item, 'start', 'start'), bySquarePoint(item, 'end', 'start')),
    new Line(bySquarePoint(item, 'start', 'center'), bySquarePoint(item, 'end', 'center')),
    new Line(bySquarePoint(item, 'start', 'end'), bySquarePoint(item, 'end', 'end')),
  ],
  diagonal: [
    new Line(bySquarePoint(item, 'start', 'start'), bySquarePoint(item, 'end', 'end')),
    new Line(bySquarePoint(item, 'end', 'start'), bySquarePoint(item, 'start', 'end')),
  ],
})

/**
 * Return all main points in square.
 *
 * @param { Square[] } items Square items
 * @returns { Vector } Return all main points in square.
 */
export const squarePoints = (item: Square): Vector[] => [
  bySquarePoint(item, 'start', 'start'),
  bySquarePoint(item, 'start', 'center'),
  bySquarePoint(item, 'start', 'end'),
  bySquarePoint(item, 'center', 'start'),
  bySquarePoint(item, 'center', 'center'),
  bySquarePoint(item, 'center', 'end'),
  bySquarePoint(item, 'end', 'start'),
  bySquarePoint(item, 'end', 'center'),
  bySquarePoint(item, 'end', 'end'),
]

/**
 * Return all main points in square.
 *
 * @param { Square[] } items Square items
 * @returns { Vector } Return all main points in square.
 */
export const squareCornerPoints = (item: Square): Vector[] => [
  bySquarePoint(item, 'start', 'start'),
  bySquarePoint(item, 'start', 'end'),
  bySquarePoint(item, 'end', 'start'),
  bySquarePoint(item, 'end', 'end'),
]
