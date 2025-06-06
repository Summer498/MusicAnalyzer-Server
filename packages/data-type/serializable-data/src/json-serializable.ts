import { createSerializable, tryAndRetry } from "./serializable";

export interface JSONSerializable<T> {
  toJSON(): unknown
  serialize(): string
  fromJSON<J>(json: J): T
  getJSON<J>(url: string): Promise<T | undefined>
}

export const createJSONSerializable = <T>(ops: {
  toJSON(): unknown
  fromJSON<J>(json: J): T
}): JSONSerializable<T> => {
  const base = createSerializable<T>(ops);
  return {
    ...base,
    getJSON<J>(url: string) {
      const deserializeAfterFetch = (u: string) =>
        fetch(u)
          .then(res => res.json() as Promise<J>)
          .then(json => ops.fromJSON(json));
      return tryAndRetry(deserializeAfterFetch, url);
    },
  };
};
