import { X2jOptions, XMLParser, validationOptions } from "fast-xml-parser";
import fs from "fs";

const options: X2jOptions = {
  preserveOrder: false,
  attributeNamePrefix: "@_",
  attributesGroupName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  removeNSPrefix: false,
  allowBooleanAttributes: false,
  parseTagValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataPropName: false,
  commentPropName: false,
  numberParseOptions: {
    hex: false,
    leadingZeros: false,
    skipLike: /.^/,
    eNotation: false,
  },
  stopNodes: [],
  unpairedTags: [],
  alwaysCreateTextNode: false,
  processEntities: true,
  htmlEntities: false,
  ignoreDeclaration: false,
  ignorePiTags: false,
  transformTagName: false,
  transformAttributeName: false,
};
const validationOptions: validationOptions = {
  allowBooleanAttributes: false,
  unpairedTags: [],
};

const main = (argv: string[]) => {
  //  fs;

  const parser = new XMLParser(options);
  const data = parser.parse("", validationOptions);
  console.log(JSON.stringify(data, undefined, "  "));
};
main(process.argv);
