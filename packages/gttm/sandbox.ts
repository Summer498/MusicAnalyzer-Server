import { X2jOptions, validationOptions } from "fast-xml-parser";
import { XMLParser, } from "fast-xml-parser";
// import { do_re_mi_grp_xml } from "./src/sample.grp";
// import { do_re_mi_mtr_xml } from "./src/sample.mtr";
// import { do_re_mi_tsr_xml } from "./src/sample.tsr";

export const options: X2jOptions = {
  preserveOrder: false,
  attributeNamePrefix: "",
  attributesGroupName: false,
  textNodeName: "#text",
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
const validationOptions: validationOptions = {
  allowBooleanAttributes: false,
  unpairedTags: [],
};


/*
const main = (argv: string[]) => {
  // const grp = do_re_mi_grp_xml;
  // const mtr = do_re_mi_mtr_xml;
  // const tsr = do_re_mi_tsr_xml;

  const parser = new XMLParser(options);
  // const data = parser.parse(grp);
  console.log(JSON.stringify(data, undefined, "  "));
};
main(process.argv);
*/