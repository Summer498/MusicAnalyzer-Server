import { X2jOptions } from "fast-xml-parser";
import { XMLParser } from "fast-xml-parser";

export const xml_options: X2jOptions = {
  preserveOrder: false,
  attributeNamePrefix: "",
  attributesGroupName: false,
  textNodeName: "text",
  ignoreAttributes: false,
  removeNSPrefix: false,
  allowBooleanAttributes: true,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataPropName: false,
  commentPropName: false,
  numberParseOptions: {
    hex: false,
    leadingZeros: false,
    skipLike: /.^/,  // /.^/ matches nothing
    eNotation: false,
  },
  stopNodes: [],
  unpairedTags: [],
  alwaysCreateTextNode: false,
  processEntities: true,
  htmlEntities: false,
  ignoreDeclaration: true,
  ignorePiTags: false,
  transformTagName: false,
  transformAttributeName: false,
};
export const xml_parser = new XMLParser(xml_options);