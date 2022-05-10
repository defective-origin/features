export function isTypedArray<TItem>(arr: any[], type: string): arr is TItem[] {
  return arr.every((item) => typeof item === type)
}

export function isStringArray(arr: any[]): arr is string[] {
  return isTypedArray(arr, 'string')
}

export function isNumberArray(arr: any[]): arr is number[] {
  return isTypedArray(arr, 'number')
}

export function isBooleanArray(arr: any[]): arr is boolean[] {
  return isTypedArray(arr, 'boolean')
}

export function isObjectArray(arr: any[]): arr is object[] {
  return isTypedArray(arr, 'object')
}

export function isSymbolArray(arr: any[]): arr is symbol[] {
  return isTypedArray(arr, 'symbol')
}

export default function task<
  TParam extends number[] | string[],
  >(...params: TParam): TParam extends number[] ? number : string {
  if (isNumberArray(params)) {
    return params.reduce((sum, num) => sum + num, 0)
  }

  return params.join(' | ')
}

const result1 = task(1, 2)
const result2 = task('1','2')
const result3 = task(1,'2')
