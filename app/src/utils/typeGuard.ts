export function nonNullable<T>(
  thing: T | null | undefined,
): thing is NonNullable<T> {
  return thing != null;
}
