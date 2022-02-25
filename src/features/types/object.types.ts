import { Digits, Func, NotExistedProperty } from "./general.types"
import { Prefix } from "./string.types"

// Select keys which values have or have no types
export type TypedKeys<O extends object, T> = { [P in keyof O]: O[P] extends T ? P : never }[keyof O]
export type ObjectKeys<O extends object> = TypedKeys<O, object>
export type ArrayKeys<O extends object> = TypedKeys<O, any[]>
export type StringKeys<O extends object> = TypedKeys<O, string>
export type BooleanKeys<O extends object> = TypedKeys<O, boolean>
export type NumberKeys<O extends object> = TypedKeys<O, number>
export type OptionalKeys<O extends object> = TypedKeys<O, undefined>
export type NullableKeys<O extends object> = TypedKeys<O, null>
export type FunctionKeys<O extends object> = TypedKeys<O, Func>

export type NotTypedKeys<O extends object, T> = { [P in keyof O]: O[P] extends T ? never : P }[keyof O]
export type NotObjectKeys<O extends object> = NotTypedKeys<O, object>
export type NotArrayKeys<O extends object> = NotTypedKeys<O, any[]>
export type NotStringKeys<O extends object> = NotTypedKeys<O, string>
export type NotBooleanKeys<O extends object> = NotTypedKeys<O, boolean>
export type NotNumberKeys<O extends object> = NotTypedKeys<O, number>
export type NotOptionalKeys<O extends object> = NotTypedKeys<O, undefined>
export type NotNullableKeys<O extends object> = NotTypedKeys<O, null>
export type NotFunctionKeys<O extends object> = NotTypedKeys<O, Func>


// Pick and Omit fields which has special types
export type PickValue<O extends object, T> = { [P in keyof Pick<O, TypedKeys<O, T>>]: O[P] }
export type PickObjects<O extends object> = PickValue<O, object>
export type PickArrays<O extends object> = PickValue<O, any[]>
export type PickStrings<O extends object> = PickValue<O, string>
export type PickBooleans<O extends object> = PickValue<O, boolean>
export type PickNumbers<O extends object> = PickValue<O, number>
export type PickOptionals<O extends object> = PickValue<O, undefined>
export type PickNullables<O extends object> = PickValue<O, null>
export type PickFunctions<O extends object> = PickValue<O, Func>

export type OmitValue<O extends object, T> = { [P in keyof Pick<O, NotTypedKeys<O, T>>]: O[P] }
export type OmitObjects<O extends object> = OmitValue<O, object>
export type OmitArrays<O extends object> = OmitValue<O, any[]>
export type OmitStrings<O extends object> = OmitValue<O, string>
export type OmitBooleans<O extends object> = OmitValue<O, boolean>
export type OmitNumbers<O extends object> = OmitValue<O, number>
export type OmitOptionals<O extends object> = OmitValue<O, undefined>
export type OmitNullables<O extends object> = OmitValue<O, null>
export type OmitFunctions<O extends object> = OmitValue<O, Func>



// apply snake case into objects
export type Cast<T, U> = T extends U ? T : U
export type GetObjValues<T> = T extends Record<any, infer V> ? V : never

export type SwitchKeyValue<
  T, // example: { [K in keyof T]: NewKeyName<K> },
  T1 extends Record<string, any> = {
    [K in keyof T]: { key: K; value: T[K] }
  },
  T2 = {
    [K in GetObjValues<T1>['value']]: Extract<GetObjValues<T1>, { value: K }>['key']
  }
> = T2


type MapKey<
  K extends string | number | symbol,
  TPrefix extends string = '_',
> = K extends Digits ? Prefix<K, TPrefix> : K


// TODO: remove rest UNDEFINED field from array Omit<O, O['length']>
export type ObjectToMap<
  T extends Record<string | number, any>,
  TP = { [P in NotTypedKeys<T, NotExistedProperty>]: T[P] },
  T0 = { [K in keyof TP]: MapKey<K> },
  T1 = SwitchKeyValue<T0>,
  T2 = { [K in keyof T1]: T[Cast<T1[K], string>] }
> = T2

export type Maybe<O extends object> = O | null
export type Writeable<O extends object> = { -readonly [P in keyof O]: O[P] }



// type p1 = PickNumbers<[1, 'a',true, [1,2,3], () => 56]>
// type o1 = OmitNumbers<[1, 'a',true, [1,2,3], () => 56]>
// type p2 = PickStrings<[1, 'a',true, [1,2,3], () => 56]>
// type o2 = OmitStrings<[1, 'a',true, [1,2,3], () => 56]>
// type p3 = PickBooleans<[1, 'a',true, [1,2,3], () => 56]>
// type o3 = OmitBooleans<[1, 'a',true, [1,2,3], () => 56]>
// type p4 = PickArrays<[1, 'a',true, [1,2,3], () => 56]>
// type o4 = OmitArrays<[1, 'a',true, [1,2,3], () => 56]>
// type p5 = PickFunctions<[1, 'a',true, [1,2,3], () => 56]>
// type o5 = OmitFunctions<[1, 'a',true, [1,2,3], () => 56]>


// type _p1 = PickNumbers<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _o1 = OmitNumbers<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _p2 = PickStrings<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _o2 = OmitStrings<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _p3 = PickBooleans<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _o3 = OmitBooleans<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _p4 = PickArrays<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _o4 = OmitArrays<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _p5 = PickFunctions<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>
// type _o5 = OmitFunctions<{ a: 5, b: string, c: true, d: [1,2,3], e : () => 56 }>



// TODO: UppercaseKey + func = AAA_AAA.BBB.CCC
// TODO: LowercaseKey + func = aaa_aaa.bbb.ccc
// TODO: CapitalizeKey + func = AaaAaa.Bbb.Ccc
// TODO: UncapitalizeKey + func = aaaAaa.bBB.cCC


