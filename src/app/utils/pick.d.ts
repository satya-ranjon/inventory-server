declare const pick: <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
) => Partial<T>;

export default pick;
