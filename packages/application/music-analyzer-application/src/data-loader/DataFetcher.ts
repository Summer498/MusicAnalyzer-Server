import { xml_parser } from "./facade";

export const keyLength = (obj: object) => Object.keys(obj).length;
export const getJSON = <T extends object>(url: string) => {
  return fetch(url)
    .then(res => res.json() as Promise<T>)
    .catch(e => { console.error(e); return undefined; });
};
export const getJSONfromXML = <T extends object>(url: string) => {
  return fetch(url)
    .then(res => res.text())
    .then(e => {
      const parsed = xml_parser.parse(e) as T;
      return keyLength(parsed) ? parsed : undefined;
    })
    .catch(e => { console.error(e); return undefined; });
};
