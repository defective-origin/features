import { NotExistedProperty, Replace } from "../types/general.types"
import { ObjectToMap } from "../types/object.types"


export type Recursive<
  O extends object,
  V extends any = NotExistedProperty,
  TResult = {
    [P in keyof O]:
      O[P] extends object ? Recursive<O[P], V> :
      V extends NotExistedProperty ? O[P] : V
  }
> = TResult

export type RecursiveWriteable<
  O extends object,
  TResult = { -readonly [P in keyof O]: O[P] extends object ? RecursiveWriteable<O[P]> : O[P] }
> = TResult

export type RecursivePartial<
  O extends object,
  TResult = { [P in keyof O]?: O[P] extends object ? RecursivePartial<O[P]> : O[P] }
> = TResult

export type RecursiveRequired<
  O extends object,
  TResult = { [P in keyof O]-?: O[P] extends object ? RecursiveRequired<O[P]> : O[P] }
> = TResult

export type RecursiveReadonly<
  O extends object,
  TResult = { readonly [P in keyof O]: O[P] extends object ? RecursiveReadonly<O[P]> : O[P] }
> = TResult

export type RecursiveRecord<
  O extends object,
  K extends keyof any,
  T,
  TResult = { [P in keyof O]: O[P] extends object ? RecursiveRecord<O[P], K, T> : Record<K, T> }
> = TResult

export type RecursiveExclude<
  O extends object,
  U,
  TResult = { [P in keyof O]: O[P] extends object ? RecursiveExclude<O[P], U> : Exclude<O[P], U> }
> = TResult

export type RecursiveExtract<
  O extends object,
  U,
  TResult = { [P in keyof O]: O[P] extends object ? RecursiveExtract<O[P], U> : Extract<O[P], U> }
> = TResult

export type RecursiveNonNullable<
  O extends object,
  TResult = { [P in keyof O]: O[P] extends object ? RecursiveNonNullable<O[P]> : NonNullable<O[P]> }
> = TResult

export type RecursiveReplace<
  O extends object,
  T,
  U,
  TResult = { [P in keyof O]: O[P] extends object ? RecursiveReplace<O[P], T, U> : Replace<O[P], T, U> }
> = TResult

export type RecursiveObjectToMap<
  O extends object,
  V extends any = NotExistedProperty,
  T0 = ObjectToMap<O>,
  T1 = {
    [P in keyof T0]:
      T0[P] extends object ? RecursiveObjectToMap<T0[P], V> :
      V extends NotExistedProperty ? T0[P] : V
  },
> = T1

// TODO: RecursiveUppercaseKey + func = AAA_AAA.BBB.CCC
// TODO: RecursiveLowercaseKey + func = aaa_aaa.bbb.ccc
// TODO: RecursiveCapitalizeKey + func = AaaAaa.Bbb.Ccc
// TODO: RecursiveUncapitalizeKey + func = aaaAaa.bBB.cCC