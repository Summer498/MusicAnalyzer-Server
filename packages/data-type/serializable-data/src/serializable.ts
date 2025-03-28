const getRecoveryURL = (url: string) => {
  const src_url = new URL(url);
  src_url.searchParams.append("update", "1");
  return src_url.toString();
};

interface ISerializable<T extends ISerializable<T>> {
  fromJSON<J>(json: J): ISerializable<T>
}

// eslint-disable-next-line no-use-before-define
export abstract class Serializable<T extends Serializable<T>> 
  implements ISerializable<T> {
  toJSON() { return this; }
  serialize() { return JSON.stringify(this.toJSON()); }
  fromJSON<J>(json: J): Serializable<T> {
    console.error(`reserved:`);
    console.error(json);
    throw Error("Not Implemented. Please override fromJSON.");
  }
  static deserialize<J, T extends Serializable<T>>(
    this: Serializable<T>,
    json: string
  ) {
    return this.fromJSON(JSON.parse(json) as J);
  }
  static tryAndRetry<T extends Serializable<T>>(
    deserializeAfterFetch: (url: string) => Promise<T | undefined>,
    url: string,
  ) {
    return deserializeAfterFetch(url)
      .catch(_ => deserializeAfterFetch(getRecoveryURL(url)));
  }
}
