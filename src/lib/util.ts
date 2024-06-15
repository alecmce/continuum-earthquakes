export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>
}

/**
 * Casts an object by downcasting the input parameter, then upcasting to the given generic type. This is intended
 * for use in testing, rather than production code!
 */
export function coerce<T>(object: unknown): T {
  return object as T
}
