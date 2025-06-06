const getRecoveryURL = (url: string) => {
  const src_url = new URL(url);
  src_url.searchParams.append("update", "1");
  return src_url.toString();
};

export interface Serializable<T> {
  toJSON(): unknown
  serialize(): string
  fromJSON<J>(json: J): T
}

export const createSerializable = <T>(ops: {
  toJSON(): unknown
  fromJSON<J>(json: J): T
}): Serializable<T> => ({
  toJSON: ops.toJSON,
  serialize: () => JSON.stringify(ops.toJSON()),
  fromJSON: ops.fromJSON,
});

export const deserialize = <J, T>(fromJSON: (json: J) => T, json: string) =>
  fromJSON(JSON.parse(json) as J);

export const tryAndRetry = <T>(
  deserializeAfterFetch: (url: string) => Promise<T | undefined>,
  url: string,
) => deserializeAfterFetch(url)
  .catch(() => deserializeAfterFetch(getRecoveryURL(url)));
