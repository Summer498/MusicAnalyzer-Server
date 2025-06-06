import { createSerializable, tryAndRetry } from "./serializable";
import { xml_parser } from "./XMLParser";

const keyLength = (obj: object) => Object.keys(obj).length;
const removeEmpty = <O extends object>(obj: O) => keyLength(obj) ? obj : undefined;

export interface XMLSerializable<T> {
  toJSON(): unknown
  serialize(): string
  fromJSON<J>(json: J): T
  getJSONfromXML(url: string): Promise<T | undefined>
}

export const createXMLSerializable = <T>(ops: {
  toJSON(): unknown
  fromJSON<J>(json: J): T
}): XMLSerializable<T> => {
  const base = createSerializable<T>(ops);
  return {
    ...base,
    getJSONfromXML(url: string) {
      const deserializeAfterFetch = (u: string) =>
        fetch(u)
          .then(res => res.text())
          .then(xml => removeEmpty(xml_parser.parse(xml) as T));
      return tryAndRetry(deserializeAfterFetch, url);
    },
  };
};
