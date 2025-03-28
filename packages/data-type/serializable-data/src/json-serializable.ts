import { Serializable } from "./serializable";

// eslint-disable-next-line no-use-before-define
export abstract class JSONSerializable<T extends JSONSerializable<T>> extends Serializable<T> {
  static getJSON<J, T extends JSONSerializable<T>>(
    this: JSONSerializable<T>,
    url: string
  ) {
    const deserializeAfterFetch = (url: string) => fetch(url)
      .then(res => res.json() as Promise<J>)
      .then(json => this.fromJSON(json));
    return JSONSerializable.tryAndRetry(deserializeAfterFetch, url);
  }
}
