import { xml_parser } from "./src/XMLParser";

export const keyLength = (obj: object) => Object.keys(obj).length;

const getRecoveryURL = (url: string) => {
  const src_url = new URL(url);
  src_url.searchParams.append("update", "1");
  return src_url.toString();
};

interface ISerializable<T extends ISerializable<T>> {
  fromJSON<J>(json: J): ISerializable<T>
}

// eslint-disable-next-line no-use-before-define
export abstract class Serializable<T extends Serializable<T>> implements ISerializable<T> {
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

const removeEmpty = <O extends object>(obj: O) => keyLength(obj) ? obj : undefined;
// eslint-disable-next-line no-use-before-define
export abstract class XMLSerializable<T extends XMLSerializable<T>> extends Serializable<T> {
  static getJSONfromXML<T extends XMLSerializable<T>>(
    this: XMLSerializable<T>,
    url: string
  ) {
    const deserializeAfterFetch = (url: string) => fetch(url)
      .then(res => res.text())
      .then(xml => removeEmpty(xml_parser.parse(xml) as T));
    return XMLSerializable.tryAndRetry(deserializeAfterFetch, url);
  }
}