import { Serializable } from "./serializable";
import { xml_parser } from "./XMLParser";

const keyLength = (obj: object) => Object.keys(obj).length;
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