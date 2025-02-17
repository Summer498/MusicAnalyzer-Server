export type TimeAnd = { readonly begin: number, readonly end: number }
export interface TimeAndItem<T> extends TimeAnd { readonly item: T }
