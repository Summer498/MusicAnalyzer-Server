import { Path } from "../common/path";

export type Pred = { readonly temp: 0 | "-inf" | Path };
export type Succ = { readonly temp: 0 | "+inf" | Path };
