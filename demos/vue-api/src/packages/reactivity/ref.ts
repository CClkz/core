declare const RefSymbol: unique symbol

export interface Ref<T = any, S = T> {
  get value(): S
  set value(_: T)

  [RefSymbol]: boolean
}

export const ref = {
  isRef: true,
}
