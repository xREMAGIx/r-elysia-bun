type OptionOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = OptionOmit<T, K> &
  Partial<Pick<T, K>>;
