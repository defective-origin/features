export type Base = number | bigint | boolean | string | symbol | object
export type Replace<V, T, U> = V extends T ? Exclude<V, T> | U : V
export type Func = (...args: any) => any
export type Digits = 0  | 1  | 2 | 3 | 4  | 5 | 6 | 7  | 8  | 9 | '0'  | '1'  | '2' | '3' | '4'  | '5' | '6' | '7'  | '8'  | '9'
export type NotExistedProperty = 'NOT_EXISTED_PROPERTY'
export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
