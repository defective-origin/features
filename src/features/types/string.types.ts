type LowerToUpperToLowerCaseMapper = {
  a: 'A'
  b: 'B'
  c: 'C'
  d: 'D'
  e: 'E'
  f: 'F'
  g: 'G'
  h: 'H'
  i: 'I'
  j: 'J'
  k: 'K'
  l: 'L'
  m: 'M'
  n: 'N'
  o: 'O'
  p: 'P'
  q: 'Q'
  r: 'R'
  s: 'S'
  t: 'T'
  u: 'U'
  v: 'V'
  w: 'W'
  x: 'X'
  y: 'Y'
  z: 'Z'
}

type UpperToLowerCaseMapper = {
  A: 'a'
  B: 'b'
  C: 'c'
  D: 'd'
  E: 'e'
  F: 'f'
  G: 'g'
  H: 'h'
  I: 'i'
  J: 'j'
  K: 'k'
  L: 'l'
  M: 'm'
  N: 'n'
  O: 'o'
  P: 'p'
  Q: 'q'
  R: 'r'
  S: 's'
  T: 't'
  U: 'u'
  V: 'v'
  W: 'w'
  X: 'x'
  Y: 'y'
  Z: 'z'
}

export type LowerLetters = UpperToLowerCaseMapper[keyof UpperToLowerCaseMapper]
export type UpperLetters = LowerToUpperToLowerCaseMapper[keyof LowerToUpperToLowerCaseMapper]
export type  Letters  = LowerLetters | UpperLetters

export type FirstLetter<T> = T extends `${infer FirstLetter}${infer _Rest}` ? FirstLetter : never
export type TailLetters<T> = T extends `${infer _FirstLetter}${infer Rest}` ? Rest : never

export type LetterToUpper<T> = T extends `${infer FirstLetter}${infer _Rest}`
  ? FirstLetter extends LowerLetters
    ? LowerToUpperToLowerCaseMapper[FirstLetter]
    : FirstLetter
  : T

export type LetterToLower<T> = T extends `${infer FirstLetter}${infer _Rest}`
  ? FirstLetter extends UpperLetters
    ? UpperToLowerCaseMapper[FirstLetter]
    : FirstLetter
  : T

export type ToLowerCase<T> = T extends ''
  ? T
  : `${LetterToLower<FirstLetter<T>>}${ToLowerCase<TailLetters<T>>}`

// First letter is upper rest is lower
export type ToSentenceCase<T> = `${LetterToUpper<FirstLetter<T>>}${ToLowerCase<TailLetters<T>>}`

export type ToPascalCase<T> = T extends ``
  ? T
  : T extends `${infer FirstWord}_${infer RestLetters}`
  ? `${ToSentenceCase<FirstWord>}${ToPascalCase<RestLetters>}`
  : ToSentenceCase<T>

export type UpperCaseToCamelCase<T> = `${ToLowerCase<FirstLetter<T>>}${TailLetters<ToPascalCase<T>>}`

export type Prefix<T, P extends string> = T extends string | number ? `${P}${T}` : never
export type Postfix<T, P extends string> = T extends string | number ? `${T}${P}` : never
export type AroundText<T, Prefix extends string, Postfix extends string> = T extends string | number ? `${Prefix}${T}${Postfix}` : never
