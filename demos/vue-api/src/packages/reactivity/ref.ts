declare const RefSymbol: unique symbol

export interface Ref<T = any, S = T> {
  get value(): S
  set value(_: T)

  [RefSymbol]: boolean
}

export function ref<T = any, S = T>(value?: T): Ref<T, S>
export function ref<T = any, S = T>(obj: T): Ref<T, S>
