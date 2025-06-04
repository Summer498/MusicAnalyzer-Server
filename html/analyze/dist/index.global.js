"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod4) => function __require() {
    return mod4 || (0, cb[__getOwnPropNames(cb)[0]])((mod4 = { exports: {} }).exports, mod4), mod4.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod4, isNodeMode, target) => (target = mod4 != null ? __create(__getProtoOf(mod4)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod4 || !mod4.__esModule ? __defProp(target, "default", { value: mod4, enumerable: true }) : target,
    mod4
  ));

  // ../../node_modules/fast-xml-parser/src/util.js
  var require_util = __commonJS({
    "../../node_modules/fast-xml-parser/src/util.js"(exports) {
      "use strict";
      var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
      var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
      var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
      var regexName = new RegExp("^" + nameRegexp + "$");
      var getAllMatches = function(string, regex) {
        const matches = [];
        let match = regex.exec(string);
        while (match) {
          const allmatches = [];
          allmatches.startIndex = regex.lastIndex - match[0].length;
          const len = match.length;
          for (let index3 = 0; index3 < len; index3++) {
            allmatches.push(match[index3]);
          }
          matches.push(allmatches);
          match = regex.exec(string);
        }
        return matches;
      };
      var isName = function(string) {
        const match = regexName.exec(string);
        return !(match === null || typeof match === "undefined");
      };
      exports.isExist = function(v3) {
        return typeof v3 !== "undefined";
      };
      exports.isEmptyObject = function(obj) {
        return Object.keys(obj).length === 0;
      };
      exports.merge = function(target, a, arrayMode) {
        if (a) {
          const keys = Object.keys(a);
          const len = keys.length;
          for (let i = 0; i < len; i++) {
            if (arrayMode === "strict") {
              target[keys[i]] = [a[keys[i]]];
            } else {
              target[keys[i]] = a[keys[i]];
            }
          }
        }
      };
      exports.getValue = function(v3) {
        if (exports.isExist(v3)) {
          return v3;
        } else {
          return "";
        }
      };
      exports.isName = isName;
      exports.getAllMatches = getAllMatches;
      exports.nameRegexp = nameRegexp;
    }
  });

  // ../../node_modules/fast-xml-parser/src/validator.js
  var require_validator = __commonJS({
    "../../node_modules/fast-xml-parser/src/validator.js"(exports) {
      "use strict";
      var util = require_util();
      var defaultOptions = {
        allowBooleanAttributes: false,
        //A tag can have attributes without any value
        unpairedTags: []
      };
      exports.validate = function(xmlData, options) {
        options = Object.assign({}, defaultOptions, options);
        const tags = [];
        let tagFound = false;
        let reachedRoot = false;
        if (xmlData[0] === "\uFEFF") {
          xmlData = xmlData.substr(1);
        }
        for (let i = 0; i < xmlData.length; i++) {
          if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
            i += 2;
            i = readPI(xmlData, i);
            if (i.err) return i;
          } else if (xmlData[i] === "<") {
            let tagStartPos = i;
            i++;
            if (xmlData[i] === "!") {
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else {
              let closingTag = false;
              if (xmlData[i] === "/") {
                closingTag = true;
                i++;
              }
              let tagName = "";
              for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
                tagName += xmlData[i];
              }
              tagName = tagName.trim();
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substring(0, tagName.length - 1);
                i--;
              }
              if (!validateTagName(tagName)) {
                let msg;
                if (tagName.trim().length === 0) {
                  msg = "Invalid space after '<'.";
                } else {
                  msg = "Tag '" + tagName + "' is an invalid name.";
                }
                return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
              }
              const result = readAttributeStr(xmlData, i);
              if (result === false) {
                return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
              }
              let attrStr = result.value;
              i = result.index;
              if (attrStr[attrStr.length - 1] === "/") {
                const attrStrStart = i - attrStr.length;
                attrStr = attrStr.substring(0, attrStr.length - 1);
                const isValid = validateAttributeString(attrStr, options);
                if (isValid === true) {
                  tagFound = true;
                } else {
                  return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
                }
              } else if (closingTag) {
                if (!result.tagClosed) {
                  return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
                } else if (attrStr.trim().length > 0) {
                  return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
                } else if (tags.length === 0) {
                  return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
                } else {
                  const otg = tags.pop();
                  if (tagName !== otg.tagName) {
                    let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                    return getErrorObject(
                      "InvalidTag",
                      "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                      getLineNumberForPosition(xmlData, tagStartPos)
                    );
                  }
                  if (tags.length == 0) {
                    reachedRoot = true;
                  }
                }
              } else {
                const isValid = validateAttributeString(attrStr, options);
                if (isValid !== true) {
                  return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
                }
                if (reachedRoot === true) {
                  return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
                } else if (options.unpairedTags.indexOf(tagName) !== -1) {
                } else {
                  tags.push({ tagName, tagStartPos });
                }
                tagFound = true;
              }
              for (i++; i < xmlData.length; i++) {
                if (xmlData[i] === "<") {
                  if (xmlData[i + 1] === "!") {
                    i++;
                    i = readCommentAndCDATA(xmlData, i);
                    continue;
                  } else if (xmlData[i + 1] === "?") {
                    i = readPI(xmlData, ++i);
                    if (i.err) return i;
                  } else {
                    break;
                  }
                } else if (xmlData[i] === "&") {
                  const afterAmp = validateAmpersand(xmlData, i);
                  if (afterAmp == -1)
                    return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                  i = afterAmp;
                } else {
                  if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                    return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
                  }
                }
              }
              if (xmlData[i] === "<") {
                i--;
              }
            }
          } else {
            if (isWhiteSpace(xmlData[i])) {
              continue;
            }
            return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
          }
        }
        if (!tagFound) {
          return getErrorObject("InvalidXml", "Start tag expected.", 1);
        } else if (tags.length == 1) {
          return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
        } else if (tags.length > 0) {
          return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
        }
        return true;
      };
      function isWhiteSpace(char) {
        return char === " " || char === "	" || char === "\n" || char === "\r";
      }
      function readPI(xmlData, i) {
        const start = i;
        for (; i < xmlData.length; i++) {
          if (xmlData[i] == "?" || xmlData[i] == " ") {
            const tagname = xmlData.substr(start, i - start);
            if (i > 5 && tagname === "xml") {
              return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
            } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
              i++;
              break;
            } else {
              continue;
            }
          }
        }
        return i;
      }
      function readCommentAndCDATA(xmlData, i) {
        if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
          for (i += 3; i < xmlData.length; i++) {
            if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
              i += 2;
              break;
            }
          }
        } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
          let angleBracketsCount = 1;
          for (i += 8; i < xmlData.length; i++) {
            if (xmlData[i] === "<") {
              angleBracketsCount++;
            } else if (xmlData[i] === ">") {
              angleBracketsCount--;
              if (angleBracketsCount === 0) {
                break;
              }
            }
          }
        } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
          for (i += 8; i < xmlData.length; i++) {
            if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
              i += 2;
              break;
            }
          }
        }
        return i;
      }
      var doubleQuote = '"';
      var singleQuote = "'";
      function readAttributeStr(xmlData, i) {
        let attrStr = "";
        let startChar = "";
        let tagClosed = false;
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
            if (startChar === "") {
              startChar = xmlData[i];
            } else if (startChar !== xmlData[i]) {
            } else {
              startChar = "";
            }
          } else if (xmlData[i] === ">") {
            if (startChar === "") {
              tagClosed = true;
              break;
            }
          }
          attrStr += xmlData[i];
        }
        if (startChar !== "") {
          return false;
        }
        return {
          value: attrStr,
          index: i,
          tagClosed
        };
      }
      var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
      function validateAttributeString(attrStr, options) {
        const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
        const attrNames = {};
        for (let i = 0; i < matches.length; i++) {
          if (matches[i][1].length === 0) {
            return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
          } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
            return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
          } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
            return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
          }
          const attrName = matches[i][2];
          if (!validateAttrName(attrName)) {
            return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
          }
          if (!attrNames.hasOwnProperty(attrName)) {
            attrNames[attrName] = 1;
          } else {
            return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
          }
        }
        return true;
      }
      function validateNumberAmpersand(xmlData, i) {
        let re = /\d/;
        if (xmlData[i] === "x") {
          i++;
          re = /[\da-fA-F]/;
        }
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === ";")
            return i;
          if (!xmlData[i].match(re))
            break;
        }
        return -1;
      }
      function validateAmpersand(xmlData, i) {
        i++;
        if (xmlData[i] === ";")
          return -1;
        if (xmlData[i] === "#") {
          i++;
          return validateNumberAmpersand(xmlData, i);
        }
        let count = 0;
        for (; i < xmlData.length; i++, count++) {
          if (xmlData[i].match(/\w/) && count < 20)
            continue;
          if (xmlData[i] === ";")
            break;
          return -1;
        }
        return i;
      }
      function getErrorObject(code, message, lineNumber) {
        return {
          err: {
            code,
            msg: message,
            line: lineNumber.line || lineNumber,
            col: lineNumber.col
          }
        };
      }
      function validateAttrName(attrName) {
        return util.isName(attrName);
      }
      function validateTagName(tagname) {
        return util.isName(tagname);
      }
      function getLineNumberForPosition(xmlData, index3) {
        const lines = xmlData.substring(0, index3).split(/\r?\n/);
        return {
          line: lines.length,
          // column number is last line's length + 1, because column numbering starts at 1:
          col: lines[lines.length - 1].length + 1
        };
      }
      function getPositionFromMatch(match) {
        return match.startIndex + match[1].length;
      }
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
  var require_OptionsBuilder = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
      "use strict";
      var defaultOptions = {
        preserveOrder: false,
        attributeNamePrefix: "@_",
        attributesGroupName: false,
        textNodeName: "#text",
        ignoreAttributes: true,
        removeNSPrefix: false,
        // remove NS from tag name or attribute name if true
        allowBooleanAttributes: false,
        //a tag can have attributes without any value
        //ignoreRootElement : false,
        parseTagValue: true,
        parseAttributeValue: false,
        trimValues: true,
        //Trim string values of tag and attributes
        cdataPropName: false,
        numberParseOptions: {
          hex: true,
          leadingZeros: true,
          eNotation: true
        },
        tagValueProcessor: function(tagName, val2) {
          return val2;
        },
        attributeValueProcessor: function(attrName, val2) {
          return val2;
        },
        stopNodes: [],
        //nested tags will not be parsed even for errors
        alwaysCreateTextNode: false,
        isArray: () => false,
        commentPropName: false,
        unpairedTags: [],
        processEntities: true,
        htmlEntities: false,
        ignoreDeclaration: false,
        ignorePiTags: false,
        transformTagName: false,
        transformAttributeName: false,
        updateTag: function(tagName, jPath, attrs) {
          return tagName;
        }
        // skipEmptyListItem: false
      };
      var buildOptions = function(options) {
        return Object.assign({}, defaultOptions, options);
      };
      exports.buildOptions = buildOptions;
      exports.defaultOptions = defaultOptions;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
  var require_xmlNode = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
      "use strict";
      var XmlNode = class {
        constructor(tagname) {
          this.tagname = tagname;
          this.child = [];
          this[":@"] = {};
        }
        add(key, val2) {
          if (key === "__proto__") key = "#__proto__";
          this.child.push({ [key]: val2 });
        }
        addChild(node) {
          if (node.tagname === "__proto__") node.tagname = "#__proto__";
          if (node[":@"] && Object.keys(node[":@"]).length > 0) {
            this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
          } else {
            this.child.push({ [node.tagname]: node.child });
          }
        }
      };
      module.exports = XmlNode;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
  var require_DocTypeReader = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
      "use strict";
      var util = require_util();
      function readDocType(xmlData, i) {
        const entities = {};
        if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
          i = i + 9;
          let angleBracketsCount = 1;
          let hasBody = false, comment = false;
          let exp = "";
          for (; i < xmlData.length; i++) {
            if (xmlData[i] === "<" && !comment) {
              if (hasBody && isEntity(xmlData, i)) {
                i += 7;
                [entityName, val, i] = readEntityExp(xmlData, i + 1);
                if (val.indexOf("&") === -1)
                  entities[validateEntityName(entityName)] = {
                    regx: RegExp(`&${entityName};`, "g"),
                    val
                  };
              } else if (hasBody && isElement(xmlData, i)) i += 8;
              else if (hasBody && isAttlist(xmlData, i)) i += 8;
              else if (hasBody && isNotation(xmlData, i)) i += 9;
              else if (isComment) comment = true;
              else throw new Error("Invalid DOCTYPE");
              angleBracketsCount++;
              exp = "";
            } else if (xmlData[i] === ">") {
              if (comment) {
                if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                  comment = false;
                  angleBracketsCount--;
                }
              } else {
                angleBracketsCount--;
              }
              if (angleBracketsCount === 0) {
                break;
              }
            } else if (xmlData[i] === "[") {
              hasBody = true;
            } else {
              exp += xmlData[i];
            }
          }
          if (angleBracketsCount !== 0) {
            throw new Error(`Unclosed DOCTYPE`);
          }
        } else {
          throw new Error(`Invalid Tag instead of DOCTYPE`);
        }
        return { entities, i };
      }
      function readEntityExp(xmlData, i) {
        let entityName2 = "";
        for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"'); i++) {
          entityName2 += xmlData[i];
        }
        entityName2 = entityName2.trim();
        if (entityName2.indexOf(" ") !== -1) throw new Error("External entites are not supported");
        const startChar = xmlData[i++];
        let val2 = "";
        for (; i < xmlData.length && xmlData[i] !== startChar; i++) {
          val2 += xmlData[i];
        }
        return [entityName2, val2, i];
      }
      function isComment(xmlData, i) {
        if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-") return true;
        return false;
      }
      function isEntity(xmlData, i) {
        if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y") return true;
        return false;
      }
      function isElement(xmlData, i) {
        if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T") return true;
        return false;
      }
      function isAttlist(xmlData, i) {
        if (xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T") return true;
        return false;
      }
      function isNotation(xmlData, i) {
        if (xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N") return true;
        return false;
      }
      function validateEntityName(name) {
        if (util.isName(name))
          return name;
        else
          throw new Error(`Invalid entity name ${name}`);
      }
      module.exports = readDocType;
    }
  });

  // ../../node_modules/strnum/strnum.js
  var require_strnum = __commonJS({
    "../../node_modules/strnum/strnum.js"(exports, module) {
      "use strict";
      var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
      var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
      var consider = {
        hex: true,
        // oct: false,
        leadingZeros: true,
        decimalPoint: ".",
        eNotation: true
        //skipLike: /regex/
      };
      function toNumber(str, options = {}) {
        options = Object.assign({}, consider, options);
        if (!str || typeof str !== "string") return str;
        let trimmedStr = str.trim();
        if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
        else if (str === "0") return 0;
        else if (options.hex && hexRegex.test(trimmedStr)) {
          return parse_int(trimmedStr, 16);
        } else if (trimmedStr.search(/[eE]/) !== -1) {
          const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
          if (notation) {
            if (options.leadingZeros) {
              trimmedStr = (notation[1] || "") + notation[3];
            } else {
              if (notation[2] === "0" && notation[3][0] === ".") {
              } else {
                return str;
              }
            }
            return options.eNotation ? Number(trimmedStr) : str;
          } else {
            return str;
          }
        } else {
          const match = numRegex.exec(trimmedStr);
          if (match) {
            const sign = match[1];
            const leadingZeros = match[2];
            let numTrimmedByZeros = trimZeros(match[3]);
            if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
            else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
            else if (options.leadingZeros && leadingZeros === str) return 0;
            else {
              const num = Number(trimmedStr);
              const numStr = "" + num;
              if (numStr.search(/[eE]/) !== -1) {
                if (options.eNotation) return num;
                else return str;
              } else if (trimmedStr.indexOf(".") !== -1) {
                if (numStr === "0" && numTrimmedByZeros === "") return num;
                else if (numStr === numTrimmedByZeros) return num;
                else if (sign && numStr === "-" + numTrimmedByZeros) return num;
                else return str;
              }
              if (leadingZeros) {
                return numTrimmedByZeros === numStr || sign + numTrimmedByZeros === numStr ? num : str;
              } else {
                return trimmedStr === numStr || trimmedStr === sign + numStr ? num : str;
              }
            }
          } else {
            return str;
          }
        }
      }
      function trimZeros(numStr) {
        if (numStr && numStr.indexOf(".") !== -1) {
          numStr = numStr.replace(/0+$/, "");
          if (numStr === ".") numStr = "0";
          else if (numStr[0] === ".") numStr = "0" + numStr;
          else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
          return numStr;
        }
        return numStr;
      }
      function parse_int(numStr, base) {
        if (parseInt) return parseInt(numStr, base);
        else if (Number.parseInt) return Number.parseInt(numStr, base);
        else if (window && window.parseInt) return window.parseInt(numStr, base);
        else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
      }
      module.exports = toNumber;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
  var require_OrderedObjParser = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
      "use strict";
      var util = require_util();
      var xmlNode = require_xmlNode();
      var readDocType = require_DocTypeReader();
      var toNumber = require_strnum();
      var OrderedObjParser = class {
        constructor(options) {
          this.options = options;
          this.currentNode = null;
          this.tagsNodeStack = [];
          this.docTypeEntities = {};
          this.lastEntities = {
            "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
            "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
            "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
            "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
          };
          this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
          this.htmlEntities = {
            "space": { regex: /&(nbsp|#160);/g, val: " " },
            // "lt" : { regex: /&(lt|#60);/g, val: "<" },
            // "gt" : { regex: /&(gt|#62);/g, val: ">" },
            // "amp" : { regex: /&(amp|#38);/g, val: "&" },
            // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
            // "apos" : { regex: /&(apos|#39);/g, val: "'" },
            "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
            "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
            "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
            "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
            "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
            "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
            "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
            "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => String.fromCharCode(Number.parseInt(str, 10)) },
            "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => String.fromCharCode(Number.parseInt(str, 16)) }
          };
          this.addExternalEntities = addExternalEntities;
          this.parseXml = parseXml;
          this.parseTextData = parseTextData;
          this.resolveNameSpace = resolveNameSpace;
          this.buildAttributesMap = buildAttributesMap;
          this.isItStopNode = isItStopNode;
          this.replaceEntitiesValue = replaceEntitiesValue;
          this.readStopNodeData = readStopNodeData;
          this.saveTextToParentTag = saveTextToParentTag;
          this.addChild = addChild;
        }
      };
      function addExternalEntities(externalEntities) {
        const entKeys = Object.keys(externalEntities);
        for (let i = 0; i < entKeys.length; i++) {
          const ent = entKeys[i];
          this.lastEntities[ent] = {
            regex: new RegExp("&" + ent + ";", "g"),
            val: externalEntities[ent]
          };
        }
      }
      function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
        if (val2 !== void 0) {
          if (this.options.trimValues && !dontTrim) {
            val2 = val2.trim();
          }
          if (val2.length > 0) {
            if (!escapeEntities) val2 = this.replaceEntitiesValue(val2);
            const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
            if (newval === null || newval === void 0) {
              return val2;
            } else if (typeof newval !== typeof val2 || newval !== val2) {
              return newval;
            } else if (this.options.trimValues) {
              return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              const trimmedVal = val2.trim();
              if (trimmedVal === val2) {
                return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
              } else {
                return val2;
              }
            }
          }
        }
      }
      function resolveNameSpace(tagname) {
        if (this.options.removeNSPrefix) {
          const tags = tagname.split(":");
          const prefix = tagname.charAt(0) === "/" ? "/" : "";
          if (tags[0] === "xmlns") {
            return "";
          }
          if (tags.length === 2) {
            tagname = prefix + tags[1];
          }
        }
        return tagname;
      }
      var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
      function buildAttributesMap(attrStr, jPath, tagName) {
        if (!this.options.ignoreAttributes && typeof attrStr === "string") {
          const matches = util.getAllMatches(attrStr, attrsRegx);
          const len = matches.length;
          const attrs = {};
          for (let i = 0; i < len; i++) {
            const attrName = this.resolveNameSpace(matches[i][1]);
            let oldVal = matches[i][4];
            let aName = this.options.attributeNamePrefix + attrName;
            if (attrName.length) {
              if (this.options.transformAttributeName) {
                aName = this.options.transformAttributeName(aName);
              }
              if (aName === "__proto__") aName = "#__proto__";
              if (oldVal !== void 0) {
                if (this.options.trimValues) {
                  oldVal = oldVal.trim();
                }
                oldVal = this.replaceEntitiesValue(oldVal);
                const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
                if (newVal === null || newVal === void 0) {
                  attrs[aName] = oldVal;
                } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                  attrs[aName] = newVal;
                } else {
                  attrs[aName] = parseValue(
                    oldVal,
                    this.options.parseAttributeValue,
                    this.options.numberParseOptions
                  );
                }
              } else if (this.options.allowBooleanAttributes) {
                attrs[aName] = true;
              }
            }
          }
          if (!Object.keys(attrs).length) {
            return;
          }
          if (this.options.attributesGroupName) {
            const attrCollection = {};
            attrCollection[this.options.attributesGroupName] = attrs;
            return attrCollection;
          }
          return attrs;
        }
      }
      var parseXml = function(xmlData) {
        xmlData = xmlData.replace(/\r\n?/g, "\n");
        const xmlObj = new xmlNode("!xml");
        let currentNode = xmlObj;
        let textData = "";
        let jPath = "";
        for (let i = 0; i < xmlData.length; i++) {
          const ch = xmlData[i];
          if (ch === "<") {
            if (xmlData[i + 1] === "/") {
              const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
              let tagName = xmlData.substring(i + 2, closeIndex).trim();
              if (this.options.removeNSPrefix) {
                const colonIndex = tagName.indexOf(":");
                if (colonIndex !== -1) {
                  tagName = tagName.substr(colonIndex + 1);
                }
              }
              if (this.options.transformTagName) {
                tagName = this.options.transformTagName(tagName);
              }
              if (currentNode) {
                textData = this.saveTextToParentTag(textData, currentNode, jPath);
              }
              const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
              if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
                throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
              }
              let propIndex = 0;
              if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
                propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
                this.tagsNodeStack.pop();
              } else {
                propIndex = jPath.lastIndexOf(".");
              }
              jPath = jPath.substring(0, propIndex);
              currentNode = this.tagsNodeStack.pop();
              textData = "";
              i = closeIndex;
            } else if (xmlData[i + 1] === "?") {
              let tagData = readTagExp(xmlData, i, false, "?>");
              if (!tagData) throw new Error("Pi Tag is not closed.");
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
              } else {
                const childNode = new xmlNode(tagData.tagName);
                childNode.add(this.options.textNodeName, "");
                if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
                }
                this.addChild(currentNode, childNode, jPath);
              }
              i = tagData.closeIndex + 1;
            } else if (xmlData.substr(i + 1, 3) === "!--") {
              const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
              if (this.options.commentPropName) {
                const comment = xmlData.substring(i + 4, endIndex - 2);
                textData = this.saveTextToParentTag(textData, currentNode, jPath);
                currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
              }
              i = endIndex;
            } else if (xmlData.substr(i + 1, 2) === "!D") {
              const result = readDocType(xmlData, i);
              this.docTypeEntities = result.entities;
              i = result.i;
            } else if (xmlData.substr(i + 1, 2) === "![") {
              const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
              const tagExp = xmlData.substring(i + 9, closeIndex);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
              if (val2 == void 0) val2 = "";
              if (this.options.cdataPropName) {
                currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
              } else {
                currentNode.add(this.options.textNodeName, val2);
              }
              i = closeIndex + 2;
            } else {
              let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
              let tagName = result.tagName;
              const rawTagName = result.rawTagName;
              let tagExp = result.tagExp;
              let attrExpPresent = result.attrExpPresent;
              let closeIndex = result.closeIndex;
              if (this.options.transformTagName) {
                tagName = this.options.transformTagName(tagName);
              }
              if (currentNode && textData) {
                if (currentNode.tagname !== "!xml") {
                  textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
                }
              }
              const lastTag = currentNode;
              if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
                currentNode = this.tagsNodeStack.pop();
                jPath = jPath.substring(0, jPath.lastIndexOf("."));
              }
              if (tagName !== xmlObj.tagname) {
                jPath += jPath ? "." + tagName : tagName;
              }
              if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
                let tagContent = "";
                if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                  if (tagName[tagName.length - 1] === "/") {
                    tagName = tagName.substr(0, tagName.length - 1);
                    jPath = jPath.substr(0, jPath.length - 1);
                    tagExp = tagName;
                  } else {
                    tagExp = tagExp.substr(0, tagExp.length - 1);
                  }
                  i = result.closeIndex;
                } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                  i = result.closeIndex;
                } else {
                  const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                  if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                  i = result2.i;
                  tagContent = result2.tagContent;
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                if (tagContent) {
                  tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
                }
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
                childNode.add(this.options.textNodeName, tagContent);
                this.addChild(currentNode, childNode, jPath);
              } else {
                if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                  if (tagName[tagName.length - 1] === "/") {
                    tagName = tagName.substr(0, tagName.length - 1);
                    jPath = jPath.substr(0, jPath.length - 1);
                    tagExp = tagName;
                  } else {
                    tagExp = tagExp.substr(0, tagExp.length - 1);
                  }
                  if (this.options.transformTagName) {
                    tagName = this.options.transformTagName(tagName);
                  }
                  const childNode = new xmlNode(tagName);
                  if (tagName !== tagExp && attrExpPresent) {
                    childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                  }
                  this.addChild(currentNode, childNode, jPath);
                  jPath = jPath.substr(0, jPath.lastIndexOf("."));
                } else {
                  const childNode = new xmlNode(tagName);
                  this.tagsNodeStack.push(currentNode);
                  if (tagName !== tagExp && attrExpPresent) {
                    childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                  }
                  this.addChild(currentNode, childNode, jPath);
                  currentNode = childNode;
                }
                textData = "";
                i = closeIndex;
              }
            }
          } else {
            textData += xmlData[i];
          }
        }
        return xmlObj.child;
      };
      function addChild(currentNode, childNode, jPath) {
        const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
        if (result === false) {
        } else if (typeof result === "string") {
          childNode.tagname = result;
          currentNode.addChild(childNode);
        } else {
          currentNode.addChild(childNode);
        }
      }
      var replaceEntitiesValue = function(val2) {
        if (this.options.processEntities) {
          for (let entityName2 in this.docTypeEntities) {
            const entity = this.docTypeEntities[entityName2];
            val2 = val2.replace(entity.regx, entity.val);
          }
          for (let entityName2 in this.lastEntities) {
            const entity = this.lastEntities[entityName2];
            val2 = val2.replace(entity.regex, entity.val);
          }
          if (this.options.htmlEntities) {
            for (let entityName2 in this.htmlEntities) {
              const entity = this.htmlEntities[entityName2];
              val2 = val2.replace(entity.regex, entity.val);
            }
          }
          val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
        }
        return val2;
      };
      function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
        if (textData) {
          if (isLeafNode === void 0) isLeafNode = Object.keys(currentNode.child).length === 0;
          textData = this.parseTextData(
            textData,
            currentNode.tagname,
            jPath,
            false,
            currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
            isLeafNode
          );
          if (textData !== void 0 && textData !== "")
            currentNode.add(this.options.textNodeName, textData);
          textData = "";
        }
        return textData;
      }
      function isItStopNode(stopNodes, jPath, currentTagName) {
        const allNodesExp = "*." + currentTagName;
        for (const stopNodePath in stopNodes) {
          const stopNodeExp = stopNodes[stopNodePath];
          if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
        }
        return false;
      }
      function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
        let attrBoundary;
        let tagExp = "";
        for (let index3 = i; index3 < xmlData.length; index3++) {
          let ch = xmlData[index3];
          if (attrBoundary) {
            if (ch === attrBoundary) attrBoundary = "";
          } else if (ch === '"' || ch === "'") {
            attrBoundary = ch;
          } else if (ch === closingChar[0]) {
            if (closingChar[1]) {
              if (xmlData[index3 + 1] === closingChar[1]) {
                return {
                  data: tagExp,
                  index: index3
                };
              }
            } else {
              return {
                data: tagExp,
                index: index3
              };
            }
          } else if (ch === "	") {
            ch = " ";
          }
          tagExp += ch;
        }
      }
      function findClosingIndex(xmlData, str, i, errMsg) {
        const closingIndex = xmlData.indexOf(str, i);
        if (closingIndex === -1) {
          throw new Error(errMsg);
        } else {
          return closingIndex + str.length - 1;
        }
      }
      function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
        const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
        if (!result) return;
        let tagExp = result.data;
        const closeIndex = result.index;
        const separatorIndex = tagExp.search(/\s/);
        let tagName = tagExp;
        let attrExpPresent = true;
        if (separatorIndex !== -1) {
          tagName = tagExp.substring(0, separatorIndex);
          tagExp = tagExp.substring(separatorIndex + 1).trimStart();
        }
        const rawTagName = tagName;
        if (removeNSPrefix) {
          const colonIndex = tagName.indexOf(":");
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
            attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
          }
        }
        return {
          tagName,
          tagExp,
          closeIndex,
          attrExpPresent,
          rawTagName
        };
      }
      function readStopNodeData(xmlData, tagName, i) {
        const startIndex = i;
        let openTagCount = 1;
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            if (xmlData[i + 1] === "/") {
              const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
              let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
              if (closeTagName === tagName) {
                openTagCount--;
                if (openTagCount === 0) {
                  return {
                    tagContent: xmlData.substring(startIndex, i),
                    i: closeIndex
                  };
                }
              }
              i = closeIndex;
            } else if (xmlData[i + 1] === "?") {
              const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
              i = closeIndex;
            } else if (xmlData.substr(i + 1, 3) === "!--") {
              const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
              i = closeIndex;
            } else if (xmlData.substr(i + 1, 2) === "![") {
              const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
              i = closeIndex;
            } else {
              const tagData = readTagExp(xmlData, i, ">");
              if (tagData) {
                const openTagName = tagData && tagData.tagName;
                if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                  openTagCount++;
                }
                i = tagData.closeIndex;
              }
            }
          }
        }
      }
      function parseValue(val2, shouldParse, options) {
        if (shouldParse && typeof val2 === "string") {
          const newval = val2.trim();
          if (newval === "true") return true;
          else if (newval === "false") return false;
          else return toNumber(val2, options);
        } else {
          if (util.isExist(val2)) {
            return val2;
          } else {
            return "";
          }
        }
      }
      module.exports = OrderedObjParser;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlparser/node2json.js
  var require_node2json = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
      "use strict";
      function prettify(node, options) {
        return compress2(node, options);
      }
      function compress2(arr, options, jPath) {
        let text;
        const compressedObj = {};
        for (let i = 0; i < arr.length; i++) {
          const tagObj = arr[i];
          const property = propName(tagObj);
          let newJpath = "";
          if (jPath === void 0) newJpath = property;
          else newJpath = jPath + "." + property;
          if (property === options.textNodeName) {
            if (text === void 0) text = tagObj[property];
            else text += "" + tagObj[property];
          } else if (property === void 0) {
            continue;
          } else if (tagObj[property]) {
            let val2 = compress2(tagObj[property], options, newJpath);
            const isLeaf = isLeafTag(val2, options);
            if (tagObj[":@"]) {
              assignAttributes(val2, tagObj[":@"], newJpath, options);
            } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
              val2 = val2[options.textNodeName];
            } else if (Object.keys(val2).length === 0) {
              if (options.alwaysCreateTextNode) val2[options.textNodeName] = "";
              else val2 = "";
            }
            if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
              if (!Array.isArray(compressedObj[property])) {
                compressedObj[property] = [compressedObj[property]];
              }
              compressedObj[property].push(val2);
            } else {
              if (options.isArray(property, newJpath, isLeaf)) {
                compressedObj[property] = [val2];
              } else {
                compressedObj[property] = val2;
              }
            }
          }
        }
        if (typeof text === "string") {
          if (text.length > 0) compressedObj[options.textNodeName] = text;
        } else if (text !== void 0) compressedObj[options.textNodeName] = text;
        return compressedObj;
      }
      function propName(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== ":@") return key;
        }
      }
      function assignAttributes(obj, attrMap, jpath, options) {
        if (attrMap) {
          const keys = Object.keys(attrMap);
          const len = keys.length;
          for (let i = 0; i < len; i++) {
            const atrrName = keys[i];
            if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
              obj[atrrName] = [attrMap[atrrName]];
            } else {
              obj[atrrName] = attrMap[atrrName];
            }
          }
        }
      }
      function isLeafTag(obj, options) {
        const { textNodeName } = options;
        const propCount = Object.keys(obj).length;
        if (propCount === 0) {
          return true;
        }
        if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
          return true;
        }
        return false;
      }
      exports.prettify = prettify;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
  var require_XMLParser = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
      "use strict";
      var { buildOptions } = require_OptionsBuilder();
      var OrderedObjParser = require_OrderedObjParser();
      var { prettify } = require_node2json();
      var validator = require_validator();
      var XMLParser2 = class {
        constructor(options) {
          this.externalEntities = {};
          this.options = buildOptions(options);
        }
        /**
         * Parse XML dats to JS object 
         * @param {string|Buffer} xmlData 
         * @param {boolean|Object} validationOption 
         */
        parse(xmlData, validationOption) {
          if (typeof xmlData === "string") {
          } else if (xmlData.toString) {
            xmlData = xmlData.toString();
          } else {
            throw new Error("XML data is accepted in String or Bytes[] form.");
          }
          if (validationOption) {
            if (validationOption === true) validationOption = {};
            const result = validator.validate(xmlData, validationOption);
            if (result !== true) {
              throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
            }
          }
          const orderedObjParser = new OrderedObjParser(this.options);
          orderedObjParser.addExternalEntities(this.externalEntities);
          const orderedResult = orderedObjParser.parseXml(xmlData);
          if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
          else return prettify(orderedResult, this.options);
        }
        /**
         * Add Entity which is not by default supported by this library
         * @param {string} key 
         * @param {string} value 
         */
        addEntity(key, value) {
          if (value.indexOf("&") !== -1) {
            throw new Error("Entity value can't have '&'");
          } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
            throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
          } else if (value === "&") {
            throw new Error("An entity with value '&' is not permitted");
          } else {
            this.externalEntities[key] = value;
          }
        }
      };
      module.exports = XMLParser2;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
  var require_orderedJs2Xml = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
      "use strict";
      var EOL = "\n";
      function toXml(jArray, options) {
        let indentation = "";
        if (options.format && options.indentBy.length > 0) {
          indentation = EOL;
        }
        return arrToStr(jArray, options, "", indentation);
      }
      function arrToStr(arr, options, jPath, indentation) {
        let xmlStr = "";
        let isPreviousElementTag = false;
        for (let i = 0; i < arr.length; i++) {
          const tagObj = arr[i];
          const tagName = propName(tagObj);
          if (tagName === void 0) continue;
          let newJPath = "";
          if (jPath.length === 0) newJPath = tagName;
          else newJPath = `${jPath}.${tagName}`;
          if (tagName === options.textNodeName) {
            let tagText = tagObj[tagName];
            if (!isStopNode(newJPath, options)) {
              tagText = options.tagValueProcessor(tagName, tagText);
              tagText = replaceEntitiesValue(tagText, options);
            }
            if (isPreviousElementTag) {
              xmlStr += indentation;
            }
            xmlStr += tagText;
            isPreviousElementTag = false;
            continue;
          } else if (tagName === options.cdataPropName) {
            if (isPreviousElementTag) {
              xmlStr += indentation;
            }
            xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
            isPreviousElementTag = false;
            continue;
          } else if (tagName === options.commentPropName) {
            xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
            isPreviousElementTag = true;
            continue;
          } else if (tagName[0] === "?") {
            const attStr2 = attr_to_str(tagObj[":@"], options);
            const tempInd = tagName === "?xml" ? "" : indentation;
            let piTextNodeName = tagObj[tagName][0][options.textNodeName];
            piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
            xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
            isPreviousElementTag = true;
            continue;
          }
          let newIdentation = indentation;
          if (newIdentation !== "") {
            newIdentation += options.indentBy;
          }
          const attStr = attr_to_str(tagObj[":@"], options);
          const tagStart = indentation + `<${tagName}${attStr}`;
          const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
          if (options.unpairedTags.indexOf(tagName) !== -1) {
            if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
            else xmlStr += tagStart + "/>";
          } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
            xmlStr += tagStart + "/>";
          } else if (tagValue && tagValue.endsWith(">")) {
            xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
          } else {
            xmlStr += tagStart + ">";
            if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
              xmlStr += indentation + options.indentBy + tagValue + indentation;
            } else {
              xmlStr += tagValue;
            }
            xmlStr += `</${tagName}>`;
          }
          isPreviousElementTag = true;
        }
        return xmlStr;
      }
      function propName(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (!obj.hasOwnProperty(key)) continue;
          if (key !== ":@") return key;
        }
      }
      function attr_to_str(attrMap, options) {
        let attrStr = "";
        if (attrMap && !options.ignoreAttributes) {
          for (let attr in attrMap) {
            if (!attrMap.hasOwnProperty(attr)) continue;
            let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
            attrVal = replaceEntitiesValue(attrVal, options);
            if (attrVal === true && options.suppressBooleanAttributes) {
              attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
            } else {
              attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
            }
          }
        }
        return attrStr;
      }
      function isStopNode(jPath, options) {
        jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
        let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
        for (let index3 in options.stopNodes) {
          if (options.stopNodes[index3] === jPath || options.stopNodes[index3] === "*." + tagName) return true;
        }
        return false;
      }
      function replaceEntitiesValue(textValue, options) {
        if (textValue && textValue.length > 0 && options.processEntities) {
          for (let i = 0; i < options.entities.length; i++) {
            const entity = options.entities[i];
            textValue = textValue.replace(entity.regex, entity.val);
          }
        }
        return textValue;
      }
      module.exports = toXml;
    }
  });

  // ../../node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
  var require_json2xml = __commonJS({
    "../../node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
      "use strict";
      var buildFromOrderedJs = require_orderedJs2Xml();
      var defaultOptions = {
        attributeNamePrefix: "@_",
        attributesGroupName: false,
        textNodeName: "#text",
        ignoreAttributes: true,
        cdataPropName: false,
        format: false,
        indentBy: "  ",
        suppressEmptyNode: false,
        suppressUnpairedNode: true,
        suppressBooleanAttributes: true,
        tagValueProcessor: function(key, a) {
          return a;
        },
        attributeValueProcessor: function(attrName, a) {
          return a;
        },
        preserveOrder: false,
        commentPropName: false,
        unpairedTags: [],
        entities: [
          { regex: new RegExp("&", "g"), val: "&amp;" },
          //it must be on top
          { regex: new RegExp(">", "g"), val: "&gt;" },
          { regex: new RegExp("<", "g"), val: "&lt;" },
          { regex: new RegExp("'", "g"), val: "&apos;" },
          { regex: new RegExp('"', "g"), val: "&quot;" }
        ],
        processEntities: true,
        stopNodes: [],
        // transformTagName: false,
        // transformAttributeName: false,
        oneListGroup: false
      };
      function Builder(options) {
        this.options = Object.assign({}, defaultOptions, options);
        if (this.options.ignoreAttributes || this.options.attributesGroupName) {
          this.isAttribute = function() {
            return false;
          };
        } else {
          this.attrPrefixLen = this.options.attributeNamePrefix.length;
          this.isAttribute = isAttribute;
        }
        this.processTextOrObjNode = processTextOrObjNode;
        if (this.options.format) {
          this.indentate = indentate;
          this.tagEndChar = ">\n";
          this.newLine = "\n";
        } else {
          this.indentate = function() {
            return "";
          };
          this.tagEndChar = ">";
          this.newLine = "";
        }
      }
      Builder.prototype.build = function(jObj) {
        if (this.options.preserveOrder) {
          return buildFromOrderedJs(jObj, this.options);
        } else {
          if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
            jObj = {
              [this.options.arrayNodeName]: jObj
            };
          }
          return this.j2x(jObj, 0).val;
        }
      };
      Builder.prototype.j2x = function(jObj, level) {
        let attrStr = "";
        let val2 = "";
        for (let key in jObj) {
          if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
          if (typeof jObj[key] === "undefined") {
            if (this.isAttribute(key)) {
              val2 += "";
            }
          } else if (jObj[key] === null) {
            if (this.isAttribute(key)) {
              val2 += "";
            } else if (key[0] === "?") {
              val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
            } else {
              val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            }
          } else if (jObj[key] instanceof Date) {
            val2 += this.buildTextValNode(jObj[key], key, "", level);
          } else if (typeof jObj[key] !== "object") {
            const attr = this.isAttribute(key);
            if (attr) {
              attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
            } else {
              if (key === this.options.textNodeName) {
                let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
                val2 += this.replaceEntitiesValue(newval);
              } else {
                val2 += this.buildTextValNode(jObj[key], key, "", level);
              }
            }
          } else if (Array.isArray(jObj[key])) {
            const arrLen = jObj[key].length;
            let listTagVal = "";
            let listTagAttr = "";
            for (let j = 0; j < arrLen; j++) {
              const item = jObj[key][j];
              if (typeof item === "undefined") {
              } else if (item === null) {
                if (key[0] === "?") val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
                else val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
              } else if (typeof item === "object") {
                if (this.options.oneListGroup) {
                  const result = this.j2x(item, level + 1);
                  listTagVal += result.val;
                  if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                    listTagAttr += result.attrStr;
                  }
                } else {
                  listTagVal += this.processTextOrObjNode(item, key, level);
                }
              } else {
                if (this.options.oneListGroup) {
                  let textValue = this.options.tagValueProcessor(key, item);
                  textValue = this.replaceEntitiesValue(textValue);
                  listTagVal += textValue;
                } else {
                  listTagVal += this.buildTextValNode(item, key, "", level);
                }
              }
            }
            if (this.options.oneListGroup) {
              listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
            }
            val2 += listTagVal;
          } else {
            if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
              const Ks = Object.keys(jObj[key]);
              const L = Ks.length;
              for (let j = 0; j < L; j++) {
                attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
              }
            } else {
              val2 += this.processTextOrObjNode(jObj[key], key, level);
            }
          }
        }
        return { attrStr, val: val2 };
      };
      Builder.prototype.buildAttrPairStr = function(attrName, val2) {
        val2 = this.options.attributeValueProcessor(attrName, "" + val2);
        val2 = this.replaceEntitiesValue(val2);
        if (this.options.suppressBooleanAttributes && val2 === "true") {
          return " " + attrName;
        } else return " " + attrName + '="' + val2 + '"';
      };
      function processTextOrObjNode(object, key, level) {
        const result = this.j2x(object, level + 1);
        if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
          return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
        } else {
          return this.buildObjectNode(result.val, key, result.attrStr, level);
        }
      }
      Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
        if (val2 === "") {
          if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
          else {
            return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
          }
        } else {
          let tagEndExp = "</" + key + this.tagEndChar;
          let piClosingChar = "";
          if (key[0] === "?") {
            piClosingChar = "?";
            tagEndExp = "";
          }
          if ((attrStr || attrStr === "") && val2.indexOf("<") === -1) {
            return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
          } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
            return this.indentate(level) + `<!--${val2}-->` + this.newLine;
          } else {
            return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
          }
        }
      };
      Builder.prototype.closeTag = function(key) {
        let closeTag = "";
        if (this.options.unpairedTags.indexOf(key) !== -1) {
          if (!this.options.suppressUnpairedNode) closeTag = "/";
        } else if (this.options.suppressEmptyNode) {
          closeTag = "/";
        } else {
          closeTag = `></${key}`;
        }
        return closeTag;
      };
      Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
        if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
          return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
          return this.indentate(level) + `<!--${val2}-->` + this.newLine;
        } else if (key[0] === "?") {
          return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        } else {
          let textValue = this.options.tagValueProcessor(key, val2);
          textValue = this.replaceEntitiesValue(textValue);
          if (textValue === "") {
            return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
          } else {
            return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
          }
        }
      };
      Builder.prototype.replaceEntitiesValue = function(textValue) {
        if (textValue && textValue.length > 0 && this.options.processEntities) {
          for (let i = 0; i < this.options.entities.length; i++) {
            const entity = this.options.entities[i];
            textValue = textValue.replace(entity.regex, entity.val);
          }
        }
        return textValue;
      };
      function indentate(level) {
        return this.options.indentBy.repeat(level);
      }
      function isAttribute(name) {
        if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
          return name.substr(this.attrPrefixLen);
        } else {
          return false;
        }
      }
      module.exports = Builder;
    }
  });

  // ../../node_modules/fast-xml-parser/src/fxp.js
  var require_fxp = __commonJS({
    "../../node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
      "use strict";
      var validator = require_validator();
      var XMLParser2 = require_XMLParser();
      var XMLBuilder = require_json2xml();
      module.exports = {
        XMLParser: XMLParser2,
        XMLValidator: validator,
        XMLBuilder
      };
    }
  });

  // ../../packages/UI/view-parameters/dist/index.mjs
  var reservation_range = 1 / 15;
  var bracket_height = 2;
  var size = 2;
  var octave_height = size * 84;
  var black_key_height = octave_height / 12;
  var NowAt = class {
    constructor(value) {
      this.value = value;
    }
    static #value = 0;
    static get() {
      return this.#value;
    }
    static set(value) {
      this.#value = value;
    }
  };
  var PianoRollRatio = class {
    constructor(value) {
      this.value = value;
    }
    static #value = 1;
    static get() {
      return this.#value;
    }
    static set(value) {
      this.#value = value;
    }
  };
  var PianoRollTimeLength = class {
    constructor(ratio, length) {
      this.ratio = ratio;
      this.length = length;
    }
    _get() {
      return this.ratio.value * this.length.value;
    }
    static get() {
      return PianoRollRatio.get() * SongLength.get();
    }
  };
  var NoteSize = class {
    constructor(width, length) {
      this.width = width;
      this.length = length;
    }
    _get() {
      return this.width._get() / this.length._get();
    }
    static get() {
      return PianoRollWidth.get() / PianoRollTimeLength.get();
    }
  };
  var transposed = (e) => e - PianoRollBegin.get();
  var scaled = (e) => e * NoteSize.get();
  var negated = (e) => -e;
  var convertToCoordinate = (e) => e * black_key_height;
  var replaceNNasInf = (e) => isNaN(e) ? -99 : e;
  var midi2BlackCoordinate = (arg) => [
    transposed,
    convertToCoordinate,
    negated
  ].reduce((c, f) => f(c), arg);
  var midi2NNBlackCoordinate = (arg) => [
    midi2BlackCoordinate,
    replaceNNasInf
  ].reduce((c, f) => f(c), arg);
  var PianoRollConverter = {
    midi2BlackCoordinate,
    midi2NNBlackCoordinate,
    transposed,
    scaled,
    convertToCoordinate
  };
  var CurrentTimeRatio = class {
    constructor(value) {
      this.value = value;
    }
    static #value = 1 / 4;
    static get() {
      return this.#value;
    }
    static set(value) {
      this.#value = value;
    }
  };
  var CurrentTimeX = class {
    constructor(width, ratio) {
      this.width = width;
      this.ratio = ratio;
    }
    _get() {
      return this.width._get() * this.ratio.value;
    }
    static get() {
      return PianoRollWidth.get() * CurrentTimeRatio.get();
    }
  };
  var OctaveCount = class {
    constructor(end, begin) {
      this.end = end;
      this.begin = begin;
    }
    _get() {
      return Math.ceil(-(this.end.value - this.begin.value) / 12);
    }
    static get() {
      return Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12);
    }
  };
  var PianoRollBegin = class {
    constructor(value) {
      this.value = value;
    }
    static #value = 83;
    static get() {
      return this.#value;
    }
    static set(value) {
      this.#value = value;
    }
  };
  var PianoRollEnd = class {
    constructor(value) {
      this.value = value;
    }
    static #value = 83 + 24;
    static get() {
      return this.#value;
    }
    static set(value) {
      this.#value = value;
    }
  };
  var PianoRollHeight = class {
    constructor(count) {
      this.count = count;
    }
    _get() {
      return octave_height * this.count._get();
    }
    static get() {
      return octave_height * OctaveCount.get();
    }
  };
  var WindowInnerWidth = class {
    _get() {
      return window.innerWidth;
    }
    static get() {
      return window.innerWidth;
    }
  };
  var PianoRollWidth = class {
    _get() {
      return window.innerWidth - 48;
    }
    static get() {
      return WindowInnerWidth.get() - 48;
    }
  };
  var SongLength = class {
    constructor(value) {
      this.value = value;
    }
    static #value = 0;
    static get() {
      return this.#value;
    }
    static set(value) {
      this.#value = value;
    }
  };
  var setCurrentTimeRatio = (e) => {
    CurrentTimeRatio.set(e);
  };
  var setPianoRollParameters = (hierarchical_melody) => {
    const last = (arr) => arr[arr.length - 1];
    const melody = last(hierarchical_melody);
    const song_length = melody.reduce((p, c) => p.time.end > p.time.end ? p : c).time.end * 1.05;
    const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
    const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
    SongLength.set(song_length);
    PianoRollEnd.set(lowest_pitch - 3);
    PianoRollBegin.set(
      [hierarchical_melody.length].map((e) => e * bracket_height).map((e) => e / 12).map((e) => Math.floor(e)).map((e) => e * 12).map((e) => e + highest_pitch).map((e) => e + 12)[0]
    );
  };

  // ../../packages/cognitive-theory-of-music/gttm/dist/index.mjs
  var Head = class {
    chord;
    constructor(head) {
      this.chord = head.chord;
    }
  };
  var ReductionElement = class {
    constructor(id, primary_element, secondary_element) {
      this.primary_element = primary_element;
      this.secondary_element = secondary_element;
      const regexp = /P1-([0-9]+)-([0-9]+)/;
      const match = id.match(regexp);
      if (match) {
        this.measure = Number(match[1]);
        this.note = Number(match[2]);
      } else {
        throw new SyntaxError(`Unexpected id received.
Expected id is: ${regexp}`);
        this.measure = 0;
        this.note = 0;
      }
    }
    measure;
    note;
    forEach(callback) {
      callback(this);
      this.primary_element?.forEach(callback);
      this.secondary_element?.forEach(callback);
    }
    getHeadElement() {
      return this.primary_element ? this.primary_element.getHeadElement() : this;
    }
    getDepthCount() {
      const p_depth = this.primary_element?.getDepthCount() || 0;
      const s_depth = this.secondary_element?.getDepthCount() || 0;
      return 1 + Math.max(p_depth, s_depth);
    }
    id2number() {
      return this.measure * 1024 + this.note;
    }
    getLeftEnd() {
      const primary = this.primary_element;
      const secondary = this.secondary_element;
      if (!primary) {
        return secondary ? secondary.getLeftEnd() : this;
      } else if (!secondary) {
        return primary.getLeftEnd();
      } else {
        const p_id = primary.id2number();
        const s_id = secondary.id2number();
        if (p_id < s_id) {
          return primary.getLeftEnd();
        } else if (p_id >= s_id) {
          return secondary.getLeftEnd();
        } else {
          throw new Error(`Reached unexpected code point`);
        }
      }
    }
    getRightEnd() {
      const primary = this.primary_element;
      const secondary = this.secondary_element;
      if (!primary) {
        return secondary ? secondary.getRightEnd() : this;
      } else if (!secondary) {
        return primary.getRightEnd();
      } else {
        const p_id = primary.id2number();
        const s_id = secondary.id2number();
        if (s_id < p_id) {
          return primary.getRightEnd();
        } else if (s_id >= p_id) {
          return secondary.getRightEnd();
        } else {
          throw new Error(`Reached unexpected code point`);
        }
      }
    }
    _getArrayOfLayer(i, layer) {
      if (layer !== void 0 && i >= layer) {
        return [this];
      }
      if (this.primary_element === void 0 && this.secondary_element === void 0) {
        return [this];
      }
      const p_array = this.primary_element?._getArrayOfLayer(i + 1, layer);
      const s_array = this.secondary_element?._getArrayOfLayer(i + 1, layer);
      if (!p_array) {
        return s_array || [];
      } else if (!s_array) {
        return p_array;
      } else {
        const p_id = p_array[0].id2number();
        const s_id = s_array[0].id2number();
        if (p_id < s_id) {
          return [...p_array, ...s_array];
        } else if (p_id >= s_id) {
          return [...s_array, ...p_array];
        } else {
          throw new Error(`Reached unexpected code point`);
        }
      }
    }
    getArrayOfLayer(layer) {
      return this._getArrayOfLayer(0, layer);
    }
  };
  var Temp = class {
    difference;
    stable;
    pred;
    succ;
    constructor(temp) {
      this.difference = temp.difference;
      this.stable = temp.stable;
      this.pred = temp.pred;
      this.succ = temp.succ;
    }
  };
  var At = class {
    temp;
    constructor(at) {
      this.temp = new Temp(at.temp);
    }
  };
  var TimeSpanTree = class {
    ts;
    constructor(ts_tree) {
      this.ts = new TimeSpan(ts_tree.ts);
    }
  };
  var TimeSpan = class extends ReductionElement {
    timespan;
    leftend;
    rightend;
    head;
    at;
    primary;
    secondary;
    constructor(ts) {
      const primary = ts.primary && new TimeSpanTree(ts.primary);
      const secondary = ts.secondary && new TimeSpanTree(ts.secondary);
      super(ts.head.chord.note.id, primary?.ts, secondary?.ts);
      this.timespan = ts.timespan;
      this.leftend = ts.leftend;
      this.rightend = ts.rightend;
      this.head = new Head(ts.head);
      this.at = new At(ts.at);
      this.primary = primary;
      this.secondary = secondary;
    }
    getMatrixOfLayer(layer) {
      const array = this.getArrayOfLayer(layer);
      const matrix = [[]];
      array?.forEach((e) => {
        if (!matrix[e.measure]) {
          matrix[e.measure] = [];
        }
        matrix[e.measure][e.note] = e;
      });
      return matrix;
    }
  };
  var TimeSpanReduction = class {
    tstree;
    constructor(tsr) {
      this.tstree = new TimeSpanTree(tsr.tstree);
    }
  };
  var ProlongationTree = class {
    pr;
    constructor(p_tree) {
      this.pr = new ProlongationalRegion(p_tree.pr);
    }
  };
  var ProlongationalRegion = class extends ReductionElement {
    head;
    primary;
    secondary;
    constructor(pr) {
      const primary = pr.primary && new ProlongationTree(pr.primary);
      const secondary = pr.secondary && new ProlongationTree(pr.secondary);
      super(pr.head.chord.note.id, primary?.pr, secondary?.pr);
      this.head = pr.head;
      this.primary = primary;
      this.secondary = secondary;
    }
  };
  var ProlongationalReduction = class {
    prtree;
    constructor(pr) {
      this.prtree = new ProlongationTree(pr.prtree);
    }
  };
  var GTTMData = class {
    constructor(grouping, metric, time_span, prolongation) {
      this.grouping = grouping;
      this.metric = metric;
      this.time_span = time_span;
      this.prolongation = prolongation;
    }
  };
  var song_list = [
    { title: "Error", author: "Error" },
    { title: "Waltz in E flat\u201DGrande Valse Brillante\u201DOp.18", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Moments Musicaux", author: "Franz Peter Schubert" },
    { title: "Bagatelle \u201CF\xFCr Elise\u201D WoO.59", author: "Ludwig van Beethoven" },
    { title: "The Preludes Op. 28 No.15", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Turkish March", author: "Ludwig van Beethoven" },
    { title: "Blumenlied Op.39", author: "Gustav Lange" },
    { title: "Nocturne", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Spinnerlied Op.14 No.4", author: "Albert Ellmenreich" },
    { title: "String Quartet in F major Op.3 No.5 Serenade", author: "Franz Peter Schubert" },
    { title: "Wiegenlied", author: "Johannes Brahms" },
    { title: "Solvejgs Lied", author: "Edvard Hagerup Grieg" },
    { title: "Anitras Dans", author: "Edvard Hagerup Grieg" },
    { title: "Traumerei", author: "Robert Alexander Schumann" },
    { title: "Menuett No.2 in G maj", author: "Ludwig van Beethoven" },
    { title: "Aida Fernando Corena", author: "Giuseppe Fortunino Francesco Verdi" },
    { title: "William Tell Overture", author: "Gioachino Antonio Rossini" },
    { title: "Carmen", author: "Georges Bizet" },
    { title: "Andante religioso", author: "Jules Emile Fr\xE9d\xE9ric Massenet" },
    { title: "Tannhauser Overture", author: "Wilhelm Richard Wagner" },
    { title: "La Traviata Brindisi", author: "Giuseppe Fortunino Francesco Verdi" },
    { title: "Plaisir d\u2019Amour", author: "Jean Paul Egide Martini" },
    { title: "Ellens Gesang III Op.52-6 D.839", author: "Franz Peter Schubert" },
    { title: "Die Meistersinger von Nurnberg Prelude", author: "Wilhelm Richard Wagner" },
    { title: "Orphe\xE9 aux Enfers Overture", author: "Jacques Offenbach" },
    { title: "L\u2019arlesienne Suite No.2 Farandole", author: "Georges Bizet" },
    { title: "Overture No.3 BWV.1068 Air on a G string", author: "Johann Sebastian Bach" },
    { title: "Peer Gynt Suite No.1 Op.46 Morgenstemning", author: "Edvard Hagerup Grieg" },
    { title: "Le carnaval des animaux Le Cygne", author: "Charles Camille Saint-Sa\xEBns" },
    { title: "Greensleeves", author: "unknown" },
    { title: "3 Gymnopedies No.1", author: "Erik Alfred Leslie Satie" },
    { title: "Sinfonie Nr.9 d moll Op.125 4.Satz An die Freude", author: "Ludwig van Beethoven" },
    { title: "The Nutcracker Suite Op.71a No.8 Waltz of the Flowers", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Swan Lake Op.20 No.9 Finale", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Water Music in D major HWV 349 No.11 Alla Hornpipe", author: "Georg Friedrich H\xE4ndel" },
    { title: "Ombra mai f\xFC HWV 40", author: "Georg Friedrich H\xE4ndel" },
    { title: "Estudiantina Op.191", author: "\xC9mile Waldteufel" },
    { title: "Sonate f\xFCr Klavier Nr.48 C dur Op.30-1 Mov.1", author: "Franz Joseph Haydn" },
    { title: "Sonate f\xFCr Klavier Nr.15 C dur K.545 Mov.1", author: "Wolfgang Amadeus Mozart" },
    { title: "Andante C dur", author: "Franz Joseph Haydn" },
    { title: "Alpengluhen Op.193", author: "Theodor Oesten" },
    { title: "Children\u2019s Album Op.39-18 Air de Danse napolitaine", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Children\u2019s Album Op.39-9 Valse", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Les Contes d\u2019Hoffmann Barcarolle", author: "Jacques Offenbach" },
    { title: "Rosamunde Prinzessin von Zypern Op.26 D797 Intermezzo No.3", author: "Franz Peter Schubert" },
    { title: "Gianni Schicchi O mio babbino caro", author: "Giacomo Antonio Domenico Michele Secondo Maria Puccini" },
    { title: "Dichterliebe Op.48-1 Im wundersch\xF6nen Monat", author: "Robert Alexander Schumann" },
    { title: "Le Nozze di Figaro \uFF2B\uFF36492 Voi che sapete", author: "Wolfgang Amadeus Mozart" },
    { title: "Rigoletto La donna \xC8 mobile", author: "Giuseppe Fortunino Francesco Verd" },
    { title: "The Planets Op.32 Jupiter, the Bringer of Jollity", author: "Gustav Holst" },
    { title: "Amazing Grace", author: "unknown" },
    { title: "Fantasiest\xFCcke Op.12-2 Aufschwung", author: "Robert Alexander Schumann" },
    { title: "Fantasiest\xFCcke Op.12-7 Traumes Wirren", author: "Robert Alexander Schumann" },
    { title: "Lieder ohne Worte Op.19-3 J\xE4gerlied", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Suite HWV 430 Air mit Variationen Harmonious Blacksmith", author: "Georg Friedrich H\xE4ndel" },
    { title: "Farewell To The Piano WoO.62", author: "Ludwig van Beethoven" },
    { title: "Le Coucou", author: "Louis-Claude Daquin" },
    { title: "Waves of the Danube", author: "Iosif Ivanovici" },
    { title: "Waltzes No.6 Op.64-1 Des dur Valse du Petit Chien", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Schwanengesang No.1 Op.72-4 D.957-4 St\xE4ndchen", author: "Franz Peter Schubert" },
    { title: "M\xE1 Vlast Moldau", author: "Bed\u0159ich Smetana" },
    { title: "Album f\xFCr die Jugend Op.68-10 Frohlicher Landmann", author: "Robert Alexander Schumann" },
    { title: "Doll\u2019s Dreaming and Awakening Op.202", author: "Theodor Oesten" },
    { title: "25 Etudes faciles et progressives, conpos\xE9es et doigt\xE9es express\xE9ment pour l\u2019\xE9tendue des petites mains Op.100-2 Arabesque", author: "Johann Friedrich Franz Burgmuller" },
    { title: "Stimmen aus der Kinderwelt 12 leichte Vortragsst\xFCck Op.78-3 Heider\xF6slein", author: "Gustav Lange" },
    { title: "25 Etudes faciles et progressives, conpos\xE9es et doigt\xE9es express\xE9ment pour l\u2019\xE9tendue des petites mains Op.100-20 Tarentelle", author: "Johann Friedrich Franz Burgmuller" },
    { title: "The Nutcracker Suite Op.71a No.2 March", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Ballade g moll Op.23", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "12 Etudes E dur Op.10-3", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Kanon und Gigue D dur f\xFCr drei Violinen und Basso Continuo Kanon", author: "Johann Pachelbel" },
    { title: "Herz und Mund und Tat und Leben BWV147-6 Wohl mir, da\xDF ich Jesum habe", author: "Johann Sebastian Bach" },
    { title: "Messiah HWV.56 23.Hallelujah", author: "Georg Friedrich H\xE4ndel" },
    { title: "Pr\xE9ludes 1 La fille aux cheveux de lin", author: "Claude Achille Debussy" },
    { title: "Pavane pour une infante d\xE9funte", author: "Joseph-Maurice Ravel" },
    { title: "8 Humoresky Op.101-7 B.187 Ges dur", author: "Anton\xEDn Leopold Dvo\u0159\xE1k" },
    { title: "Sicilienne Op.78", author: "Gabriel Urbain Faur\xE9" },
    { title: "Salut d\u2019amour Op.12", author: "Sir Edward William Elgar" },
    { title: "Violinkonzert e moll Op.64 1.Satz", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Concerti a 4 e 5 Il cimento dell\u2019armonia e dell\u2019inventione Op.8 Le quattro stagioni Concerti Nr.1E dur RV.269 La Primavera", author: "Antonio Lucio Vivaldi" },
    { title: "Eine kleine Nachtmusik G dur K.525 1.Satz", author: "Wolfgang Amadeus Mozart" },
    { title: "Symphonie Nr.40 g moll KV.550 1.Satz", author: "Wolfgang Amadeus Mozart" },
    { title: "Symphony No.9 in E minor Op.95 B.178 From the New World Mov.2 Goin\u2019 Home", author: "Anton\xEDn Leopold Dvo\u0159\xE1k" },
    { title: "An der sch\xF6nen blauen Donau Op.314", author: "Johann Strau\xDF II" },
    { title: "Radetzky-Marsch Op.228", author: "Johann Strau\xDF I" },
    { title: "Toccata und Fuge d moll BWV565", author: "Johann Sebastian Bach" },
    { title: "Tableaux d\u2019une exposition Promenade", author: "Modest Petrovich Mussorgsky" },
    { title: "Pomp and Circumstance Op.39 No.1", author: "Sir Edward William Elgar" },
    { title: "Impromptu cis moll Op.66", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Scherzo b moll Op.31", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "12 Etudes c moll Op.10-12", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Impromptus D 935 Op.142-3 B dur", author: "Franz Peter Schubert" },
    { title: "Rondo D dur K.485", author: "Wolfgang Amadeus Mozart" },
    { title: "Franz\xF6sische Suiten Nr.5 G dur BWV 816 Gavotte", author: "Johann Sebastian Bach" },
    { title: "Sechs Ges\xE4nge Op.34-2 Auf Fl\xFCgeln des Gesanges", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Csikos Post", author: "Hermann Necke" },
    { title: "12 Variationen \xFCber ein franz\xF6sisches Lied \u2018Ah,vous dirai-je, maman\u2019 C dur K.265 K6.300e", author: "Wolfgang Amadeus Mozart" },
    { title: "Lieder ohne Worte Heft 5 Op.62-6 Fr\xFChlingslied", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Les Patineurs Op.183", author: "\xC9mile Waldteufel" },
    { title: "Sonate f\xFCr Klavier Nr.8 c moll Pathetique Op.13 2.Satz", author: "Ludwig van Beethoven" },
    { title: "3 Valses No.7 Op.64-2 cis moll", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Sonate f\xFCr Klavier Nr.11 A dur K.331 K6.300i Mov.1", author: "Wolfgang Amadeus Mozart" },
    { title: "Violinromanze Nr.2 F dur Op.50", author: "Ludwig van Beethoven" },
    { title: "Polonaisen 3 Militaire A dur Op.40-1", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Carmen Habanera", author: "Georges Bizet" },
    { title: "Ein Sommernachtstraum Wedding March Op.61-9", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Beautiful Dreamer", author: "Stephen Collins Foster" },
    { title: "Toy Symphony", author: "Johann Georg Leopold Mozart" },
    { title: "Liebestraume 3 Notturnos S.541 R.211 As dur", author: "Franz Liszt" },
    { title: "Walk\xFCrenritt Ride of the Valkyries", author: "Wilhelm Richard Wagner" },
    { title: "Sonate f\xFCr Klavier und Violine Nr.5 F dur \u201CFr\xFChling\u201D Op.24", author: "Ludwig van Beethoven" },
    { title: "L\u2019Arl\xE9sienne Menuett", author: "Georges Bizet" },
    { title: "The Bridal Chorus from the opera Lohengrin", author: "Wilhelm Richard Wagner" },
    { title: "Madama Butterfly Un bel d\xEC, vedremo", author: "Giacomo Antonio Domenico Michele Secondo MariaPuccini" },
    { title: "Concerto for piano and orchestra No.1 Op.23 Mov.1", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Symphony No.1 Op.68 C major", author: "Johannes Brahms" },
    { title: "L\u2019amico Fritz", author: "Pietro Mascagnit" },
    { title: "Pi\xE8ces de clavecin avec une m\xE9thode sur la m\xE9canique des doigts \u201CTambourin\u201D", author: "Jean-Philippe Rameau" },
    { title: "Symphony No.4 A major Op.90", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Sonatine Op.36-4 F dur 1.Satz", author: "Muzio Filippo Vincenzo Francesco Saverio Clementi" },
    { title: "Son tutta duolo", author: "Alessandro Scarlatti" },
    { title: "What a Friend We Have in Jesus", author: "Charles Crozat Converse" },
    { title: "Sonatine Op.36-5 G dur", author: "Muzio Filippo Vincenzo Francesco Saverio Clementi" },
    { title: "Impromptus D.935 Op.142 B dur", author: "Franz Peter Schubert" },
    { title: "Tre giorni son che Nina", author: "Giovanni Battista Pergolesi" },
    { title: "Rhapsody in Blue", author: "George Gershwin" },
    { title: "Sonatine Op.20-3 F dur", author: "Daniel Friedrich Rudolph Kuhlau" },
    { title: "La traviata Parigi o cara noi lasciaremo", author: "Giuseppe Fortunino Francesco Verdi" },
    { title: "Corrente", author: "Girolamo Frescobaldi" },
    { title: "Sonate f\xFCr Klavier Nr.27 e moll Op.90 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Ungarische Rhapsodie S.244 Nr.2 cis moll", author: "Franz Liszt" },
    { title: "The nutcracker suite Op.71a \u201CTrepak\u201D", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Sonate f\xFCr Klavier N\uFF52.7 D dur Op.10-3 3.Satz", author: "Ludwig van Beethoven" },
    { title: "Musikalisches Zeitvertreib Op.22 Schlag-aria", author: "Johann Valentin Rathgeber" },
    { title: "Sonate f\xFCr Klavier Nr.15 C dur K.545 3.Satz", author: "Wolfgang Amadeus Mozart" },
    { title: "Sonate f\xFCr Klavier N\uFF52.3 C dur Op.2-3 4.Satz", author: "Ludwig van Beethoven" },
    { title: "Peer Gynt Suite No.1 Op.46 \xC5ses D\xF8d", author: "Edvard Hagerup Grieg" },
    { title: "Concerto for Flute & Harp K299 Mov.1", author: "Wolfgang Amadeus Mozart" },
    { title: "Sonate f\xFCr Klavier Nr.19 g moll Op.49-1 2.Satz", author: "Ludwig van Beethoven" },
    { title: "Horn Concerto No.1 D major", author: "Wolfgang Amadeus Mozart" },
    { title: "Les saisons 12 Morceaux caracteristiques Op.37bis No.6 \u201CBarcarolle\u201D", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Symphony No.7 A major Op.92 Mov.4", author: "Ludwig van Beethoven" },
    { title: "Rondo brillante \u201CAufforderung zum Tanz\u201D Op.65", author: "Carl Maria Friedrich Ernst von Weber" },
    { title: "Star vicino", author: "Salvator Rosa" },
    { title: "Flute Concerto La notte RV.439 Op.10 No.2", author: "Antonio Lucio Vivaldi" },
    { title: "Sonatine Op.36-1", author: "Muzio Filippo Vincenzo Francesco Saverio Clementi" },
    { title: "Se florindo e fedele", author: "Alessandro Scarlatti" },
    { title: "5 Mazurka No.5 Op.7-1 B dur", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Vittoria, mio core!", author: "Giacomo Carissimi" },
    { title: "Sonatine Op.20-1 C dur", author: "Daniel Friedrich Rudolph Kuhlau" },
    { title: "Caro mio ben", author: "Giuseppe Giordani" },
    { title: "Adagio", author: "Heinrich Joseph Barmann" },
    { title: "Massa\u2019s in De Cold Ground", author: "Stephen Collins Foster" },
    { title: "Allegretto No.4", author: "Louis A. Saint-Jacome" },
    { title: "La cinquantaine", author: "Gabriel Prosper Marie" },
    { title: "Le Coucou", author: "Louis-Claude Daquin" },
    { title: "Gavotte", author: "Christoph Graupner" },
    { title: "La Gemissante Rondeau", author: "Jean-Fran\xE7ois Dandrieu" },
    { title: "Pi\xE8ces de clavecin avec une m\xE9thode sur la m\xE9canique des doigts \u201CLa joyeuse\u201D", author: "Jean-Philippe Rameau" },
    { title: "Sonatine Op.20 Nr.1", author: "Johann Ladislaus Dussek" },
    { title: "String Quartet No.73 F dur Op.74-2 Hob.III:73 \u201CThe Military Quartet\u201D", author: "Franz Joseph Haydn" },
    { title: "Rigaudon", author: "Georg B\xF6hm" },
    { title: "Sonate f\xFCr Klavier N\uFF52.5 c moll Op.10-1 3.Satz", author: "Ludwig van Beethoven" },
    { title: "Die sch\xF6ne M\xFCllerin Op.25 D.795 Wohin?", author: "Franz Peter Schubert" },
    { title: "Fanfare", author: "Johann Philipp Kirnberger" },
    { title: "A musical snuffbox Op.32", author: "Lyadov, Anatoly Konstantinovich" },
    { title: "Sonate f\xFCr Klavier Nr.20 G dur Op.49-2 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Symphony No.7 A major Op.92 Mov.1", author: "Ludwig van Beethoven" },
    { title: "Divertimento No.1 in B flat major \u201CChorale St. Antoni\u201D Hob.II:46", author: "Franz Joseph Haydn" },
    { title: "Light Cavalry Overture", author: "Franz von Suppe" },
    { title: "Sonate f\xFCr Klavier N\uFF52.5 c moll Op.10-1 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Sonate f\xFCr Klavier Nr.8 c moll \u201CPathetique\u201D Op.13 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Musical Parnassus Euterpe Suite No.6 Chaconne", author: "Johann Caspar Ferdinand Fischer" },
    { title: "Sonata K.531 L.430", author: "Domenico Scarlatti" },
    { title: "Sonatine Op.36-3 C dur", author: "Muzio Filippo Vincenzo Francesco Saverio Clementi" },
    { title: "Winterreise D.911 Op.89 Gute Nacht", author: "Franz Peter Schubert" },
    { title: "Hunting", author: "Louis A. Saint-Jacome" },
    { title: "The little nigar", author: "Claude Achille Debussy" },
    { title: "La sonnambula", author: "Vincenzo Bellini" },
    { title: "Rondo D dur K.485", author: "Wolfgang Amadeus Mozart" },
    { title: "Pizzicato Polka", author: "Johann Baptist Strau\xDF, Josef Strau\xDF" },
    { title: "Symphony No.6 \u201CPateticheskaya\u201D Op.74", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Rondo grazioso No.25", author: "Louis A. Saint-Jacome" },
    { title: "Sonate f\xFCr Klavier N\uFF52.6 F dur Op.10-2 1.Satz", author: "Ludwig van Beethoven" },
    { title: "24 Caprices for Solo Violin No.24 Quasi Presto", author: "Niccol\xF2 Paganinit" },
    { title: "Sonate f\xFCr Klavier Nr.26 Es dur \u201CLebewohl\u201D Op.81a 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Lento cantabile grandioso No.7", author: "Louis A. Saint-Jacome" },
    { title: "Annen-Polka Op.117", author: "Johann Baptist Strau\xDF" },
    { title: "Sonate f\xFCr Klavier N\uFF52.3 C dur Op.2-3 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Sonate f\xFCr Klavier Nr.4 Es dur Op.7 4.Satz", author: "Ludwig van Beethoven" },
    { title: "Petere es a farkas Op.67", author: "Prokof\u2019ev, Sergei Sergeevich" },
    { title: "Menuet en Rondeau C major", author: "Jean-Philippe Rameau" },
    { title: "Winterreise D.911 Op.89 Fr\xFChlingstraum", author: "Franz Peter Schubert" },
    { title: "Le Coq d\u2019Or Hymn to the Sun", author: "Nikolai Andreyevich Rimsky-Korsakov" },
    { title: "Simple aveu Op.25", author: "Francis Thom\xE9" },
    { title: "Romance", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Deux M\xE9lodies Op.3-1 F dur", author: "Rubinstein Anton" },
    { title: "2 Marches caracteristiques D.968 B.886 Op.121 C dur", author: "Franz Peter Schubert" },
    { title: "Die Lorelei", author: "Phillipp Friedrich Silcher" },
    { title: "Music for the Royal Fireworks HWV 351 II bourr\xE9e", author: "Georg Friedrich H\xE4ndel" },
    { title: "La jolie fille de Perth s\xE9r\xE9nade", author: "Georges Bizet" },
    { title: "Gigue", author: "Jean-Baptiste de Lully" },
    { title: "Hornpipe G minor", author: "Henry Purcell" },
    { title: "Pi\xE8ces de clavecin avec une m\xE9thode sur la m\xE9canique des doigts \u201CPremier rigaudon\u201D", author: "Jean-Philippe Rameau" },
    { title: "Quartet for 2 Violins, Viola and Violoncello D major 3 Nocturne", author: "Alexander Porfir\u2019evich Borodin" },
    { title: "Sonate f\xFCr Klavier Nr.4 Es dur Op.7 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Peer Gynt Suite Nr.2 Op.55 I dovregubbens hall", author: "Edvard Hagerup Grieg" },
    { title: "Die Fledermaus Overture Op.367", author: "Johann Baptist Strau\xDF" },
    { title: "Gavotte F major", author: "Jean Paul Egide Martini" },
    { title: "Goldberg-Variationen Aria BWV 988", author: "Johann Sebastian Bach" },
    { title: "Suite No.6 G major La Coquette R.130", author: "Georg Muffat" },
    { title: "La Molinara Nel cor p\xEC\xF9 non mi sento", author: "Giovanni Paisiello" },
    { title: "Sonate f\xFCr Klavier Nr.8 c moll \u201CPathetique\u201D Op.13 3.Satz", author: "Ludwig van Beethoven" },
    { title: "Sleeping Beauty Op.66", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Menuett G dur K.1", author: "Wolfgang Amadeus Mozart" },
    { title: "19 Polish Songs Op.74 No.1 Zyczenie", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Ungarische T\xE4nze Nr.1 WoO.1", author: "Johannes Brahms" },
    { title: "Valse No.10 Op.69-2 h moll", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Valse No.14 Op.posth e moll", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Menuett", author: "Johann Mattheson" },
    { title: "Parthenia Pavana and galiardo,The Earle of Salisbury", author: "William Byrd" },
    { title: "Cos\xEC fan tutte, ossia La scuola degli amanti K.588", author: "Fr\xE9d\xE9ric Fran\xE7oiss Chopin" },
    { title: "Dimmi,amor", author: "Arcangelo del Leuto" },
    { title: "Fantaisie \u201CWandererfantasie\u201D D.760 Op.15", author: "Franz Peter Schubert" },
    { title: "7 Marionnettes No.2 Poupee valsante", author: "Eduard Poldini" },
    { title: "Ungariche T\xE4nze WoO.1 Nr.5 fis moll", author: "Johannes Brahms" },
    { title: "Ein Sommernachtstraum Notturno Op.61-7", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Etude No.23", author: "Louis A. Saint-Jacome" },
    { title: "Don Giovanni K.527", author: "Wolfgang Amadeus Mozart" },
    { title: "Le nouve musichi Amarilli", author: "Giulio Caccini" },
    { title: "Symphony No.1 Op.68 C major", author: "Johannes Brahms" },
    { title: "Scheherazade Op.35", author: "Rimsky-Korsakov, Nikolai Andreevich" },
    { title: "Andantino No.4", author: "Louis A. Saint-Jacome" },
    { title: "Gigue", author: "Georg Philipp Telemann" },
    { title: "Love in Idleness", author: "Allan Macbeth" },
    { title: "Nocturne No.5 H.37", author: "John Field" },
    { title: "2 Polonaises Op.26-1 cis moll", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Suite No.4 B flat major Cantabile R.115", author: "Gottlieb Muffat" },
    { title: "The nutcracker suite Op.71a \u201CDance of the reed-flutes\u201D", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Sonate f\xFCr Klavier Nr.48 C dur Hob.XVI:35 Op.30-1 Mov.1", author: "Franz Joseph Haydn" },
    { title: "L\u2019arlesienne Suite No.1 Prelude", author: "Georges Bizet" },
    { title: "Nocturne \u201CLa s\xE9paration\u201D G. vi, 204", author: "Mikhail Ivanovich Glinka" },
    { title: "Sonate f\xFCr Klavier Nr.11 B dur Op.22 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Symphony No.8 Op.88 Mov.3 Allegretto grazioso", author: "Anton\xEDn Leopold Dvo\u0159\xE1k" },
    { title: "Lieder ohne Worte Heft 1 Op.19 \u201CRegrets\u201D", author: "Jakob Ludwig Felix Mendelssohn Bartholdy" },
    { title: "Musicalische Vorstellung einiger biblischer Historien in sechs Sonaten auf dem Claviere zu spielen \u201CDer Todtkranke und wieder gesunde Hiskias\u201D", author: "Johann Kuhnau" },
    { title: "Madrigale", author: "Achille Simonetti" },
    { title: "Londonderry Air", author: "Louis A. Saint-Jacome" },
    { title: "Sonate f\xFCr Klavier Nr.20 G dur Op.49-2 2.Satz", author: "Ludwig van Beethoven" },
    { title: "Sonate f\xFCr Klavier N\uFF52.7 D dur Op.10-3 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Konzert f\xFCr Klavier und Orchester Nr.5 Es dur Op.73 1.Satz", author: "Ludwig van Beethoven" },
    { title: "Symphony No.39 E flat major K.543", author: "Wolfgang Amadeus Mozart" },
    { title: "Konzert f\xFCr Klavier und Orchester Nr.21 C dur K.467 Mov.1", author: "Wolfgang Amadeus Mozart" },
    { title: "Flute Quartet No.1 D major K.285", author: "Wolfgang Amadeus Mozart" },
    { title: "Easy duet", author: "Louis A. Saint-Jacome" },
    { title: "Fr\xFChling", author: "Wilhelm Friedemann Bach" },
    { title: "Adagio G minor", author: "Tomaso Giovanni Albinoni" },
    { title: "Der Tod und Das M\xE4dchen Op.7-3 D.531 2.Satz", author: "Franz Peter Schubert" },
    { title: "Sonate f\xFCr Klavier Nr.48 C dur Hob.XVI:35 Op.30-1 Mov.3 Finale", author: "Franz Joseph Haydn" },
    { title: "Winterreise D.911 Op.89 Der Lindenbaum", author: "Franz Peter Schubert" },
    { title: "Franz\xF6sische Suiten Nr.5 G dur BWV 816 Gavotte", author: "Johann Sebastian Bach" },
    { title: "Cantabile D dur Op.17 MS.109", author: "Niccol\xF2 Paganini" },
    { title: "Winterreise D.911 Op.89 Wasserflut", author: "Franz Peter Schubert" },
    { title: "Sonate f\xFCr Klavier Nr.12 As dur Op.26 2.Satz", author: "Ludwig van Beethoven" },
    { title: "The nutcracker suite Op.71a \u201CMiniature overture\u201D", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "12 Etudes Op.25-9 \u201CButterfly\u201D Ges dur", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Deux Mazurkas Caracterstiques \u201C2.Le Menetrier\u201D Op.19-2", author: "Henryk Wieniawski" },
    { title: "Grande valse brillante Es dur Op.18 CT207", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Woodland Sketches Op.51-1 To a Wild Rose", author: "Edward Alexander MacDowell" },
    { title: "Menuet in A Minor", author: "Johann Philipp Krieger" },
    { title: "Fuga C dur", author: "Johann Pachelbel" },
    { title: "Siciliana", author: "Henry Purcell" },
    { title: "16 Walzer Op.39-15 As dur", author: "Johannes Brahms" },
    { title: "Serenata Rimpianto", author: "Enrico Toselli" },
    { title: "Fantasia La Traviata", author: "Giuseppe Fortunino Francesco Verdi" },
    { title: "Cavalleria Rusticana Intermezzo", author: "Pietro Mascagni" },
    { title: "Siciliana", author: "Maria Theresa von Paradies" },
    { title: "Serenade No.1 in A major", author: "Franz Drdla" },
    { title: "Nocturne No.21 c moll KK.IVb/8 CT128", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "3 Nocturnes Es dur Op.9-2", author: "Fr\xE9d\xE9ric Fran\xE7ois Chopin" },
    { title: "Violin Concerto in D major Op.35", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Symphonie No.3 F Dur Op.90 Mov.2", author: "Johannes Brahms" },
    { title: "Akademische Festouvert\xFCre Op.80", author: "Johannes Brahms" },
    { title: "Sonate f\xFCr Klavier Nr.8 c moll \u201CPathetique\u201D Op.13 2.Satz", author: "Ludwig van Beethoven" },
    { title: "La Boh\xE8me \u201CQuando me n\u2019vo soletta per la via\u201D", author: "Giacomo Antonio Domenico Michele Secondo MariaPuccini" },
    { title: "Sento nel core", author: "Alessandro Scarlatti" },
    { title: "Caro laccio", author: "Francesco Gasparini" },
    { title: "Six Sonatinas Op.55-1 2.Satz C dur", author: "Friedrich Kuhlau" },
    { title: "6 Progressive Sonatinas Op.36-1 3.Satz C major", author: "Muzio Filippo Vincenzo Francesco Saverio Clementi" },
    { title: "6 Progressive Sonatinas Op.36-6 2.Satz D major", author: "Muzio Filippo Vincenzo Francesco Saverio Clementi" },
    { title: "The Nutcracker Op.71 No.14 Pas de Deux, Variations, and Coda", author: "Pyotr Il\u2019yich Tchaikovsky" },
    { title: "Carmen Prelude", author: "Georges Bizet" },
    { title: "La Gioconda Danza dell\u2019 Ore", author: "Amilcare Ponchielli" },
    { title: "La traviata Prelude", author: "Giuseppe Fortunino Francesco Verdi" },
    { title: "Silvery Waves", author: "Addison Pinneo Wyman" },
    { title: "Das zweiten Notenbuch der Anna Magdalena Bach Menuett G Dur BWVAnh.114", author: "Johann Sebastian Bach" },
    { title: "Turandot Nessun dorma", author: "Giacomo Antonio Domenico Michele Secondo MariaPuccini" },
    { title: "Judas Maccabaeus HWV63 See the conquering hero comes", author: "Georg Friedrich H\xE4ndel" },
    { title: "Etude No.1", author: "Louis A. Saint-Jacome" },
    { title: "Etude No.6", author: "Louis A. Saint-Jacome" },
    { title: "Celebrate duet No.4", author: "Louis A. Saint-Jacome" },
    { title: "Suite\u201DShiki \u201D No.1 Hana", author: "Rentaro Taki" }
  ];
  console.log(song_list.map((e, i) => ({
    ...e,
    no: i,
    family: e.author.split(" ").slice(-1)[0]
  })).sort((a, b) => a.family > b.family ? 1 : a.family < b.family ? -1 : a.title > b.title ? 1 : -1));

  // ../../packages/util/math/dist/index.mjs
  var argmax = (array) => array.map((e, i) => [e, i]).reduce((p, c) => c[0] >= p[0] ? c : p)[1];
  var totalSum = (array) => array.reduce((p, c) => p + c);
  var decimal = (x) => x - Math.floor(x);
  var mod = (x, m) => (x % m + m) % m;
  var Complex = class _Complex {
    constructor(re, im) {
      this.re = re;
      this.im = im;
    }
    add(right) {
      return new _Complex(this.re + right.re, this.im + right.im);
    }
    sub(right) {
      return new _Complex(this.re - right.re, this.im - right.im);
    }
    scale(right) {
      return new _Complex(this.re * right, this.im * right);
    }
    divScaler(right) {
      return new _Complex(this.re / right, this.im / right);
    }
    mlt(right) {
      return new _Complex(
        this.re * right.re - this.im * right.im,
        this.re * right.im + this.im * right.re
      );
    }
    div(right) {
      const D = right.re + right.re + right.im + right.im;
      return new _Complex(
        this.re * right.re + this.im * right.im / D,
        this.re * right.im - this.im * right.re / D
      );
    }
  };
  var fft_core = (seq, root_of_unity2) => {
    const N = seq.length;
    const res = [];
    if (N == 1) {
      return seq;
    }
    const X_evens = fft_core(seq.filter((_, i) => i % 2 === 0), root_of_unity2);
    const X_odds = fft_core(seq.filter((_, i) => i % 2 == 1), root_of_unity2);
    for (let k = 0; k < N / 2; k++) {
      const evens = X_evens[k];
      const rotated_odds = X_odds[k].mlt(root_of_unity2.exponent(k, N));
      res[k] = evens.add(rotated_odds);
      res[k + N / 2] = evens.sub(rotated_odds);
    }
    return res;
  };
  var RootOfUnity = class {
    exponent_cache;
    modulo_cache;
    constructor() {
      this.exponent_cache = [];
      this.modulo_cache = [];
    }
    exponent(k, N) {
      const x = -2 * Math.PI * (k / N);
      this.exponent_cache[N] ||= [];
      this.exponent_cache[N][k] ||= new Complex(Math.cos(x), Math.sin(x));
      return this.exponent_cache[N][k];
    }
    modulo(k, N, modulo) {
      const root = modulo - 1;
      this.modulo_cache[N] ||= [];
      this.modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo;
      return this.exponent_cache[N][k];
    }
  };
  var fft = (seq) => {
    const N = Math.pow(2, Math.ceil(Math.log2(seq.length)));
    while (seq.length < N) {
      seq.push(new Complex(0, 0));
    }
    return fft_core(seq, new RootOfUnity());
  };
  var ifft = (seq) => {
    const ps = fft(seq.map((e) => new Complex(e.im, e.re)));
    return ps.map((e) => new Complex(e.im, e.re).divScaler(ps.length));
  };
  var convolution = (seq1, seq2) => {
    const f_seq1 = fft(seq1);
    const f_seq2 = fft(seq2);
    const mul = f_seq1.map((e, i) => e.mlt(f_seq2[i]));
    return ifft(mul);
  };
  var correlation = (seq1, seq2) => convolution(seq1, seq2.reverse());
  var getZeros = (length) => [...Array(length)].map((e) => 0);
  var getRange = (begin, end, step = 1) => [...Array(Math.abs(end - begin))].map((_, i) => i * step + begin);

  // ../../packages/music-structure/beat/beat-estimation/dist/index.mjs
  var calcTempo = (melodies, romans) => {
    const phase = 0;
    const melody_bpm = [];
    const bpm_range = 90;
    const onsets = getZeros(Math.ceil(melodies[melodies.length - 1].time.end * 100));
    const melody_phase = getRange(0, 90).map((i) => getZeros(90 + i));
    const b = Math.log2(90);
    melodies.forEach((e, i) => {
      if (i + 1 >= melodies.length) {
        return;
      }
      const term = melodies[i + 1].time.begin - melodies[i].time.begin + (Math.random() - 0.5) / 100;
      if (60 / term > 300 * 4) {
        return;
      }
      const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
      const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
      if (isNaN(melody_bpm[bpm])) {
        melody_bpm[bpm] = 0;
      }
      melody_bpm[bpm]++;
      getRange(0, bpm_range).forEach((bpm3) => {
        melody_phase[bpm3][Math.floor(mod(e.time.begin, bpm3 + 90))]++;
      });
      onsets[Math.floor(e.time.begin * 100)] = 1;
    });
    const entropy = melody_phase.map((e) => {
      const sum = totalSum(e);
      const prob = e.map((e2) => e2 / sum);
      return { phase, tempo: totalSum(prob.map((p) => p === 0 ? 0 : -p * Math.log2(p))) };
    });
    onsets.forEach((e, i) => e === 0 && i !== 0 && (onsets[i] = onsets[i - 1] * 0.9));
    const w = (tau) => {
      const tau_0 = 50;
      const sigma_tau = 2;
      const x = Math.log2(tau / tau_0) / sigma_tau;
      return Math.exp(-x * x / 2);
    };
    const complex_onset = onsets.map((e) => new Complex(e, 0));
    const tps = correlation(
      complex_onset,
      complex_onset
    ).map((e, tau) => w(tau) * e.re);
    const roman_bpm = [];
    romans.forEach((_, i) => {
      if (i + 1 >= romans.length) {
        return;
      }
      const term = romans[i + 1].time.begin - romans[i].time.begin;
      const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
      const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
      if (isNaN(roman_bpm[bpm])) {
        roman_bpm[bpm] = 0;
      }
      roman_bpm[bpm]++;
    });
    return { phase, tempo: argmax(tps) };
  };

  // ../../packages/music-structure/analyzed-data-container/dist/index.mjs
  var AnalyzedDataContainer = class {
    constructor(roman, melody, hierarchical_melody) {
      this.roman = roman;
      this.melody = melody;
      this.hierarchical_melody = hierarchical_melody;
      this.d_melodies = melody.map((e) => e);
      this.melody = this.d_melodies.map((e) => e).filter((e, i) => i + 1 >= this.d_melodies.length || 60 / (this.d_melodies[i + 1].time.begin - this.d_melodies[i].time.begin) < 300 * 4);
      this.beat_info = calcTempo(this.melody, this.roman);
    }
    beat_info;
    d_melodies;
  };

  // ../../packages/util/math/src/fft/array/complex.ts
  var mltV2R = (...x) => x[0].map((e) => e * x[1]);
  var addV2VR = (...x) => x[0].map((e, i) => e + x[1][i]);
  var subV2VR = (...x) => x[0].map((e, i) => e - x[1][i]);
  var mltV2VR = (...x) => x[0].map((e, i) => e * x[1][i]);
  var sclV2R = (...x) => [mltV2R(x[0][0], x[1]), mltV2R(x[0][1], x[1])];
  var addV2VC = (...x) => [addV2VR(x[0][0], x[1][0]), addV2VR(x[0][1], x[1][1])];
  var subV2VC = (...x) => [subV2VR(x[0][0], x[1][0]), subV2VR(x[0][1], x[1][1])];
  var mltV2VC = (...x) => [
    subV2VR(mltV2VR(x[0][0], x[1][0]), mltV2VR(x[0][1], x[1][1])),
    addV2VR(mltV2VR(x[0][1], x[1][0]), mltV2VR(x[0][0], x[1][1]))
  ];

  // ../../packages/util/math/src/fft/array/root-of-unity.ts
  var RootOfUnity2 = class {
    exponent_cache;
    modulo_cache;
    constructor() {
      this.exponent_cache = [];
      this.modulo_cache = [];
    }
    exponent(k, N) {
      const x = -2 * Math.PI * (k / N);
      this.exponent_cache[N] ||= [];
      this.exponent_cache[N][k] ||= [Math.cos(x), Math.sin(x)];
      return this.exponent_cache[N][k];
    }
    exponentList(N) {
      return [
        new Float32Array(N).map((e, k) => Math.cos(-2 * Math.PI * (k / N))),
        new Float32Array(N).map((e, k) => Math.sin(-2 * Math.PI * (k / N)))
      ];
    }
    modulo(k, N, modulo) {
      const root = modulo - 1;
      this.modulo_cache[N] ||= [];
      this.modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo;
      return this.modulo_cache[N][k];
    }
  };

  // ../../packages/util/math/src/fft/array/ftt-core.ts
  var root_of_unity = new RootOfUnity2();
  var addAndSub = (x, y) => [
    addV2VC(x, y),
    subV2VC(x, y)
  ];
  var fft_core2 = (...seq) => {
    const N = seq[0].length;
    if (N <= 1) {
      return seq;
    }
    const E = fft_core2(...[
      seq[0].filter((_, i) => i % 2 === 0),
      seq[1].filter((_, i) => i % 2 === 0)
    ]);
    const O = fft_core2(...[
      seq[0].filter((_, i) => i % 2 === 1),
      seq[1].filter((_, i) => i % 2 === 1)
    ]);
    const R = mltV2VC(O, root_of_unity.exponentList(N));
    const add_sub = addAndSub(E, R);
    return [
      new Float32Array([...add_sub[0][0], ...add_sub[1][0]]),
      new Float32Array([...add_sub[0][1], ...add_sub[1][1]])
    ];
  };

  // ../../packages/util/math/src/fft/array/index.ts
  var fft2 = (...seq) => {
    const N = Math.sqrt(seq[0].length);
    return sclV2R(fft_core2(...seq), 1 / N);
  };

  // ../../packages/UI/spectrogram/dist/index.mjs
  var WaveViewer = class {
    constructor(analyser) {
      this.analyser = analyser;
      this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.path.setAttribute("stroke", "blue");
      this.path.setAttribute("fill", "none");
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.appendChild(this.path);
      this.svg.id = "sound-wave";
      this.svg.setAttribute("width", String(800));
      this.svg.setAttribute("height", String(450));
      this.old_wave = [...new Array(analyser.analyser.fftSize)].map((e) => new Complex(0, 0));
    }
    path;
    old_wave;
    svg;
    getDelay(copy) {
      const col = correlation(this.old_wave, copy);
      let delay = 0;
      for (let i = 0; i < col.length / 2; i++) {
        if (col[delay].re < col[i].re) {
          delay = i;
        }
      }
      for (let i = 0; i < copy.length; i++) {
        this.old_wave[i] = copy[(i + delay) % copy.length];
      }
      return delay;
    }
    onAudioUpdate() {
      const wave = this.analyser.getByteTimeDomainData();
      const width = this.svg.clientWidth;
      const height = this.svg.clientHeight;
      let path_data = "";
      const copy = [];
      wave.forEach((e) => {
        copy.push(new Complex(e, 0));
      });
      const delay = this.getDelay(copy);
      for (let i = 0; i < wave.length / 2; i++) {
        if (isNaN(wave[i + delay] * 0)) {
          continue;
        }
        const x = i * 2 / (wave.length - 1) * width;
        const y = wave[i + delay] / 255 * height;
        path_data += `L ${x},${y}`;
      }
      this.path.setAttribute("d", "M" + path_data.slice(1));
    }
  };
  var spectrogramViewer = class {
    constructor(analyser) {
      this.analyser = analyser;
      this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.path.setAttribute("stroke", "red");
      this.path.setAttribute("fill", "none");
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.appendChild(this.path);
      this.svg.id = "spectrum";
      this.svg.setAttribute("width", String(800));
      this.svg.setAttribute("height", String(450));
    }
    path;
    svg;
    onAudioUpdate() {
      const freqData = this.analyser.getFloatFrequencyData();
      const fftSize = freqData.length / 2;
      const width = this.svg.clientWidth;
      const height = this.svg.clientHeight;
      let pathData = "";
      for (let i = 0; i < fftSize; i++) {
        if (isNaN(freqData[i] * 0)) {
          continue;
        }
        const x = i / (fftSize - 1) * width;
        const y = -(freqData[i] / 128) * height;
        pathData += `L ${x},${y}`;
      }
      [pathData].map((e) => e.slice(1)).filter((e) => e.length > 0).map((e) => this.path.setAttribute("d", "M" + e));
    }
  };
  var connect = (...node) => {
    const next = node.slice(1);
    next.forEach((e, i) => node[i].connect(e));
  };
  var getByteFrequencyData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Uint8Array(buffer_length);
    analyser.getByteFrequencyData(buffer);
    return buffer;
  };
  var getByteTimeDomainData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Uint8Array(buffer_length);
    analyser.getByteTimeDomainData(buffer);
    return buffer;
  };
  var getFloatFrequencyData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Float32Array(buffer_length);
    analyser.getFloatFrequencyData(buffer);
    return buffer;
  };
  var getFloatTimeDomainData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Float32Array(buffer_length);
    analyser.getFloatTimeDomainData(buffer);
    return buffer;
  };
  var blackManWindow = (x) => {
    const c = 0.16;
    const a = [(1 - c) / 2, 1 / 2, c / 2];
    const N = x.length;
    return x.map((e, i) => a[0] - a[1] * Math.cos(
      2 * Math.PI * i / N + a[2] * Math.cos(4 * Math.PI * i / N)
    ) * e);
  };
  var getFFT = (analyser) => {
    const buff = blackManWindow(getFloatTimeDomainData(analyser));
    const amplitude = [];
    for (let i = 0; i < buff.length; i++) {
      amplitude.push(buff[i]);
    }
    return fft2(buff, buff.map((e) => 0));
  };
  var resumeAudioCtx = (audioCtx2) => () => {
    audioCtx2.state === "suspended" && audioCtx2.resume();
  };
  var AudioAnalyzer = class {
    audioCtx;
    source;
    analyser;
    constructor(audioElement) {
      this.audioCtx = new AudioContext();
      this.source = this.audioCtx.createMediaElementSource(audioElement);
      this.analyser = this.audioCtx.createAnalyser();
      audioElement.addEventListener("play", resumeAudioCtx(this.audioCtx));
      this.analyser.fftSize = 1024;
      connect(this.source, this.analyser, this.audioCtx.destination);
    }
    getByteTimeDomainData() {
      return getByteTimeDomainData(this.analyser);
    }
    getFloatTimeDomainData() {
      return getFloatTimeDomainData(this.analyser);
    }
    getByteFrequencyData() {
      return getByteFrequencyData(this.analyser);
    }
    getFloatFrequencyData() {
      return getFloatFrequencyData(this.analyser);
    }
    getFFT() {
      return getFFT(this.analyser);
    }
  };
  var FFTViewer = class {
    constructor(analyser) {
      this.analyser = analyser;
      this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.path.setAttribute("stroke", "rgb(192,0,255)");
      this.path.setAttribute("fill", "none");
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.appendChild(this.path);
      this.svg.id = "fft";
      this.svg.setAttribute("width", String(800));
      this.svg.setAttribute("height", String(450));
    }
    path;
    svg;
    onAudioUpdate() {
      const freqData = this.analyser.getFFT();
      const N = freqData[0].length / 2;
      const width = this.svg.clientWidth;
      const height = this.svg.clientHeight;
      let pathData = "";
      const abs = (e) => Math.sqrt(e.re * e.re + e.im * e.im);
      const absV = (...c) => c[0].map((e, i) => Math.sqrt(e * e + c[1][i] * c[1][i]));
      this.path.setAttribute("d", "M" + //      freqData.map(e => abs(e))
      [...Array.from(absV(...freqData))].map((e, i) => {
        if (isNaN(e * 0)) {
          return ``;
        }
        const x = i / (N - 1) * width;
        const y = (1 - Math.log2(1 + e)) * height;
        return `L ${x},${y}`;
      }).join().slice(1));
    }
  };
  var AudioViewer = class {
    constructor(audio_element, audio_registry) {
      this.audio_element = audio_element;
      const analyser = new AudioAnalyzer(this.audio_element);
      this.wave = new WaveViewer(analyser);
      this.spectrogram = new spectrogramViewer(analyser);
      this.fft = new FFTViewer(analyser);
      audio_registry.addListeners(this.onAudioUpdate.bind(this));
    }
    wave;
    spectrogram;
    fft;
    onAudioUpdate() {
      this.wave.onAudioUpdate();
      this.spectrogram.onAudioUpdate();
      this.fft.onAudioUpdate();
    }
  };

  // ../../packages/util/time-and/dist/index.mjs
  var getArgs = (...args) => {
    if (args.length === 1) {
      const [e] = args;
      return [e.begin, e.end];
    } else {
      return args;
    }
  };
  var Time = class _Time {
    begin;
    end;
    get duration() {
      return this.end - this.begin;
    }
    constructor(...args) {
      const [begin, end] = getArgs(...args);
      this.begin = begin;
      this.end = end;
    }
    map(func) {
      return new _Time(func(this.begin), func(this.end));
    }
    has(medium) {
      return this.begin <= medium && medium < this.end;
    }
  };

  // ../../packages/UI/view/dist/index.mjs
  var AudioReflectableRegistry = class _AudioReflectableRegistry {
    static #count = 0;
    constructor() {
      if (_AudioReflectableRegistry.#count >= 1) {
        throw new Error("this constructor should not be called twice (singleton)");
      }
      _AudioReflectableRegistry.#count++;
    }
    listeners = [];
    addListeners(...listeners) {
      this.listeners.push(...listeners);
    }
    onUpdate() {
      this.listeners.forEach((e) => e());
    }
  };
  var WindowReflectableRegistry = class _WindowReflectableRegistry {
    static #count = 0;
    constructor() {
      if (_WindowReflectableRegistry.#count >= 1) {
        throw new Error("this constructor should not be called twice (singleton)");
      }
      _WindowReflectableRegistry.#count++;
    }
    listeners = [];
    addListeners(...listeners) {
      this.listeners.push(...listeners);
    }
    onUpdate() {
      this.listeners.forEach((e) => e());
    }
  };
  var PianoRollTranslateX = class {
    static get() {
      return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
    }
  };

  // ../../packages/UI/synth/dist/index.mjs
  function createGain(ctx, parentNode, gain) {
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    gainNode.connect(parentNode);
    return gainNode;
  }
  function createOscillator(ctx, parentNode, type, frequency, detune) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    osc.connect(parentNode);
    return osc;
  }
  var audioCtx = new AudioContext();
  function play(hzs = [330, 440, 550], begin_sec, length_sec, amplitude = 1) {
    const ctx = audioCtx;
    const parent = audioCtx.destination;
    const peak = amplitude / hzs.length;
    const attack = 0.01;
    const decay = 0.4;
    const sustain = 0.7 * peak;
    const release = 0.05 * length_sec;
    const detune = 0;
    const detune_delta = 1;
    hzs.map((hz, i) => {
      const gain_node = createGain(ctx, parent, 0);
      const osc = createOscillator(
        ctx,
        gain_node,
        "square",
        hz,
        detune + detune_delta * i
      );
      const start = audioCtx.currentTime + begin_sec;
      const delay = Math.random() * 0.1;
      const audioParam = gain_node.gain;
      osc.start(start);
      audioParam.cancelScheduledValues(start);
      audioParam.linearRampToValueAtTime(0, 2e-3 + start + delay);
      audioParam.linearRampToValueAtTime(peak, start + delay + attack);
      audioParam.linearRampToValueAtTime(sustain, start + delay + attack + decay);
      audioParam.linearRampToValueAtTime(sustain, start + delay + length_sec);
      audioParam.exponentialRampToValueAtTime(
        1e-3,
        start + length_sec + release
      );
      osc.stop(start + length_sec + release);
    });
  }

  // ../../packages/UI/piano-roll/beat-view/dist/index.mjs
  var BeatBarModel = class {
    time;
    constructor(beat_info, i) {
      this.time = new Time(
        i * 60 / beat_info.tempo,
        (i + 1) * 60 / beat_info.tempo
      );
    }
  };
  var BeatBarView = class {
    constructor(svg) {
      this.svg = svg;
    }
    updateX(x1, x2) {
      this.svg.setAttribute("x1", String(x1));
      this.svg.setAttribute("x2", String(x2));
    }
    updateY(y1, y2) {
      this.svg.setAttribute("y1", String(y1));
      this.svg.setAttribute("y2", String(y2));
    }
  };
  var BeatBar = class {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.model = model;
      this.view = view;
      this.sound_reserved = false;
      this.#y1 = 0;
      this.#y2 = PianoRollHeight.get();
      this.updateX();
      this.updateY();
    }
    get svg() {
      return this.view.svg;
    }
    #y1;
    #y2;
    sound_reserved;
    updateX() {
      this.view.updateX(
        PianoRollConverter.scaled(this.model.time.begin),
        PianoRollConverter.scaled(this.model.time.begin)
      );
    }
    updateY() {
      this.view.updateY(
        this.#y1,
        this.#y2
      );
    }
    onWindowResized() {
      this.updateX();
    }
    onTimeRangeChanged = this.onWindowResized;
    beepBeat() {
      const model_is_in_range = new Time(0, reservation_range).map((e) => e + NowAt.get()).has(this.model.time.begin);
      if (model_is_in_range) {
        if (this.sound_reserved === false) {
          play([220], this.model.time.begin - NowAt.get(), 0.125);
          this.sound_reserved = true;
          setTimeout(() => {
            this.sound_reserved = false;
          }, reservation_range * 1e3);
        }
      }
    }
    onAudioUpdate() {
    }
  };
  var BeatBarsSeries = class {
    constructor(children) {
      this.children = children;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg.id = "beat-bars";
      children.forEach((e) => svg.appendChild(e.svg));
      this.svg = svg;
      this.children_model = children.map((e) => e.model);
      this.#show = children;
    }
    children_model;
    #show;
    get show() {
      return this.#show;
    }
    svg;
    onAudioUpdate() {
      this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
    }
  };
  var BeatElements = class {
    children;
    beat_bars;
    constructor(beat_info, melodies, controllers) {
      const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
      const seed = [...Array(N)];
      const beat_bar = seed.map((_, i) => {
        const model = new BeatBarModel(beat_info, i);
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
        svg.id = "bar";
        svg.style.stroke = "rgb(0, 0, 0)";
        svg.style.display = "none";
        const view = new BeatBarView(svg);
        return new BeatBar(model, view);
      });
      const beat_bars = new BeatBarsSeries(beat_bar);
      beat_bars.children.map((e) => e.onAudioUpdate.bind(e)).map((f) => controllers.audio.addListeners(f));
      beat_bars.children.map((e) => e.onWindowResized.bind(e)).map((f) => controllers.window.addListeners(f));
      const listeners = beat_bars.children.map((e) => e.onTimeRangeChanged.bind(e));
      controllers.time_range.addListeners(...listeners);
      this.beat_bars = beat_bars.svg;
      this.children = [beat_bars];
    }
  };

  // ../../packages/util/stdlib/dist/index.mjs
  var Assertion = class {
    #assertion;
    constructor(assertion) {
      this.#assertion = assertion;
    }
    onFailed(errorExecution) {
      this.#assertion || errorExecution();
    }
  };
  var getCapitalCase = (str) => str[0].toUpperCase().concat(str.slice(1));
  var getLowerCase = (str) => str.toLowerCase();

  // ../../node_modules/@tonaljs/pitch/dist/index.mjs
  function isNamedPitch(src) {
    return src !== null && typeof src === "object" && "name" in src && typeof src.name === "string" ? true : false;
  }
  function isPitch(pitch2) {
    return pitch2 !== null && typeof pitch2 === "object" && "step" in pitch2 && typeof pitch2.step === "number" && "alt" in pitch2 && typeof pitch2.alt === "number" && !isNaN(pitch2.step) && !isNaN(pitch2.alt) ? true : false;
  }
  var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
  var STEPS_TO_OCTS = FIFTHS.map(
    (fifths) => Math.floor(fifths * 7 / 12)
  );
  function coordinates(pitch2) {
    const { step, alt, oct, dir = 1 } = pitch2;
    const f = FIFTHS[step] + 7 * alt;
    if (oct === void 0) {
      return [dir * f];
    }
    const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
    return [dir * f, dir * o];
  }
  var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
  function pitch(coord) {
    const [f, o, dir] = coord;
    const step = FIFTHS_TO_STEPS[unaltered(f)];
    const alt = Math.floor((f + 1) / 7);
    if (o === void 0) {
      return { step, alt, dir };
    }
    const oct = o + 4 * alt + STEPS_TO_OCTS[step];
    return { step, alt, oct, dir };
  }
  function unaltered(f) {
    const i = (f + 1) % 7;
    return i < 0 ? 7 + i : i;
  }

  // ../../node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX = new RegExp(
    "^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$"
  );
  function tokenizeInterval(str) {
    const m = REGEX.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache = {};
  function interval(src) {
    return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : isPitch(src) ? interval(pitchName(src)) : isNamedPitch(src) ? interval(src.name) : NoInterval;
  }
  var SIZES = [0, 2, 4, 5, 7, 9, 11];
  var TYPES = "PMMPPMM";
  function parse(str) {
    const tokens = tokenizeInterval(str);
    if (tokens[0] === "") {
      return NoInterval;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES[step];
    if (t === "M" && q === "P") {
      return NoInterval;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones2 = dir * (SIZES[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones: semitones2,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval(pitch(ivl));
  }
  function qToAlt(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES[step] === "M" ? "majorable" : "perfectable";
    const name = d + num + altToQ(type, alt);
    return name;
  }
  function altToQ(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr("A", alt);
    } else {
      return fillStr("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // ../../node_modules/@tonaljs/pitch-note/dist/index.mjs
  var fillStr2 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoNote = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });
  var cache2 = /* @__PURE__ */ new Map();
  var stepToLetter = (step) => "CDEFGAB".charAt(step);
  var altToAcc = (alt) => alt < 0 ? fillStr2("b", -alt) : fillStr2("#", alt);
  var accToAlt = (acc) => acc[0] === "b" ? -acc.length : acc.length;
  function note(src) {
    const stringSrc = JSON.stringify(src);
    const cached = cache2.get(stringSrc);
    if (cached) {
      return cached;
    }
    const value = typeof src === "string" ? parse2(src) : isPitch(src) ? note(pitchName2(src)) : isNamedPitch(src) ? note(src.name) : NoNote;
    cache2.set(stringSrc, value);
    return value;
  }
  var REGEX2 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  function tokenizeNote(str) {
    const m = REGEX2.exec(str);
    return m ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]] : ["", "", "", ""];
  }
  function coordToNote(noteCoord) {
    return note(pitch(noteCoord));
  }
  var mod2 = (n, m) => (n % m + m) % m;
  var SEMI = [0, 2, 4, 5, 7, 9, 11];
  function parse2(noteName) {
    const tokens = tokenizeNote(noteName);
    if (tokens[0] === "" || tokens[3] !== "") {
      return NoNote;
    }
    const letter = tokens[0];
    const acc = tokens[1];
    const octStr = tokens[2];
    const step = (letter.charCodeAt(0) + 3) % 7;
    const alt = accToAlt(acc);
    const oct = octStr.length ? +octStr : void 0;
    const coord = coordinates({ step, alt, oct });
    const name = letter + acc + octStr;
    const pc = letter + acc;
    const chroma3 = (SEMI[step] + alt + 120) % 12;
    const height = oct === void 0 ? mod2(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
    const midi = height >= 0 && height <= 127 ? height : null;
    const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
    return {
      empty: false,
      acc,
      alt,
      chroma: chroma3,
      coord,
      freq,
      height,
      letter,
      midi,
      name,
      oct,
      pc,
      step
    };
  }
  function pitchName2(props) {
    const { step, alt, oct } = props;
    const letter = stepToLetter(step);
    if (!letter) {
      return "";
    }
    const pc = letter + altToAcc(alt);
    return oct || oct === 0 ? pc + oct : pc;
  }

  // ../../node_modules/@tonaljs/pitch-distance/dist/index.mjs
  function transpose(noteName, intervalName) {
    const note4 = note(noteName);
    const intervalCoord = Array.isArray(intervalName) ? intervalName : interval(intervalName).coord;
    if (note4.empty || !intervalCoord || intervalCoord.length < 2) {
      return "";
    }
    const noteCoord = note4.coord;
    const tr = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
    return coordToNote(tr).name;
  }
  function distance(fromNote, toNote) {
    const from = note(fromNote);
    const to = note(toNote);
    if (from.empty || to.empty) {
      return "";
    }
    const fcoord = from.coord;
    const tcoord = to.coord;
    const fifths = tcoord[0] - fcoord[0];
    const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
    const forceDescending = to.height === from.height && to.midi !== null && from.midi !== null && from.step > to.step;
    return coordToInterval([fifths, octs], forceDescending).name;
  }

  // ../../node_modules/@tonaljs/core/dist/index.mjs
  function deprecate(original, alternative, fn) {
    return function(...args) {
      console.warn(`${original} is deprecated. Use ${alternative}.`);
      return fn.apply(this, args);
    };
  }
  var isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);

  // ../../node_modules/@tonaljs/collection/dist/index.mjs
  function rotate(times, arr) {
    const len = arr.length;
    const n = (times % len + len) % len;
    return arr.slice(n, len).concat(arr.slice(0, n));
  }

  // ../../node_modules/@tonaljs/pcset/dist/index.mjs
  var EmptyPcset = {
    empty: true,
    name: "",
    setNum: 0,
    chroma: "000000000000",
    normalized: "000000000000",
    intervals: []
  };
  var setNumToChroma = (num2) => Number(num2).toString(2).padStart(12, "0");
  var chromaToNumber = (chroma22) => parseInt(chroma22, 2);
  var REGEX3 = /^[01]{12}$/;
  function isChroma(set) {
    return REGEX3.test(set);
  }
  var isPcsetNum = (set) => typeof set === "number" && set >= 0 && set <= 4095;
  var isPcset = (set) => set && isChroma(set.chroma);
  var cache3 = { [EmptyPcset.chroma]: EmptyPcset };
  function get(src) {
    const chroma22 = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
    return cache3[chroma22] = cache3[chroma22] || chromaToPcset(chroma22);
  }
  var pcset = deprecate("Pcset.pcset", "Pcset.get", get);
  var IVLS = [
    "1P",
    "2m",
    "2M",
    "3m",
    "3M",
    "4P",
    "5d",
    "5P",
    "6m",
    "6M",
    "7m",
    "7M"
  ];
  function chromaToIntervals(chroma22) {
    const intervals2 = [];
    for (let i = 0; i < 12; i++) {
      if (chroma22.charAt(i) === "1")
        intervals2.push(IVLS[i]);
    }
    return intervals2;
  }
  function chromaRotations(chroma22) {
    const binary = chroma22.split("");
    return binary.map((_, i) => rotate(i, binary).join(""));
  }
  function chromaToPcset(chroma22) {
    const setNum = chromaToNumber(chroma22);
    const normalizedNum = chromaRotations(chroma22).map(chromaToNumber).filter((n) => n >= 2048).sort()[0];
    const normalized = setNumToChroma(normalizedNum);
    const intervals2 = chromaToIntervals(chroma22);
    return {
      empty: false,
      name: "",
      setNum,
      chroma: chroma22,
      normalized,
      intervals: intervals2
    };
  }
  function listToChroma(set) {
    if (set.length === 0) {
      return EmptyPcset.chroma;
    }
    let pitch2;
    const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < set.length; i++) {
      pitch2 = note(set[i]);
      if (pitch2.empty)
        pitch2 = interval(set[i]);
      if (!pitch2.empty)
        binary[pitch2.chroma] = 1;
    }
    return binary.join("");
  }

  // ../../node_modules/@tonaljs/chord-type/dist/index.mjs
  var CHORDS = [
    // ==Major==
    ["1P 3M 5P", "major", "M ^  maj"],
    ["1P 3M 5P 7M", "major seventh", "maj7 \u0394 ma7 M7 Maj7 ^7"],
    ["1P 3M 5P 7M 9M", "major ninth", "maj9 \u03949 ^9"],
    ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
    ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
    ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
    ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
    [
      "1P 3M 5P 7M 11A",
      "major seventh sharp eleventh",
      "maj#4 \u0394#4 \u0394#11 M7#11 ^7#11 maj7#11"
    ],
    // ==Minor==
    // '''Normal'''
    ["1P 3m 5P", "minor", "m min -"],
    ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
    [
      "1P 3m 5P 7M",
      "minor/major seventh",
      "m/ma7 m/maj7 mM7 mMaj7 m/M7 -\u03947 m\u0394 -^7 -maj7"
    ],
    ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
    ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
    ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
    ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
    ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
    // '''Diminished'''
    ["1P 3m 5d", "diminished", "dim \xB0 o"],
    ["1P 3m 5d 7d", "diminished seventh", "dim7 \xB07 o7"],
    ["1P 3m 5d 7m", "half-diminished", "m7b5 \xF8 -7b5 h7 h"],
    // ==Dominant/Seventh==
    // '''Normal'''
    ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
    ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
    ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
    ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
    // '''Altered'''
    ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
    ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
    ["1P 3M 7m 9m", "altered", "alt7"],
    // '''Suspended'''
    ["1P 4P 5P", "suspended fourth", "sus4 sus"],
    ["1P 2M 5P", "suspended second", "sus2"],
    ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
    ["1P 5P 7m 9M 11P", "eleventh", "11"],
    [
      "1P 4P 5P 7m 9m",
      "suspended fourth flat ninth",
      "b9sus phryg 7b9sus 7b9sus4"
    ],
    // ==Other==
    ["1P 5P", "fifth", "5"],
    ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
    ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
    ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
    [
      "1P 3M 5P 7M 9M 11A",
      "major sharp eleventh (lydian)",
      "maj9#11 \u03949#11 ^9#11"
    ],
    // ==Legacy==
    ["1P 2M 4P 5P", "", "sus24 sus4add9"],
    ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
    ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
    ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
    ["1P 3M 5A 7m 9M", "", "9#5 9+"],
    ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
    ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
    ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
    ["1P 3M 5A 9A", "", "+add#9"],
    ["1P 3M 5A 9M", "", "M#5add9 +add9"],
    ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
    ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
    ["1P 3M 5P 6M 9M 11A", "", "69#11"],
    ["1P 3m 5P 6M 9M", "", "m69 -69"],
    ["1P 3M 5P 6m 7m", "", "7b6"],
    ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
    ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
    ["1P 3M 5P 7M 9m", "", "M7b9"],
    ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
    ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
    ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
    ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
    ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
    ["1P 3M 5P 7m 9A 13M", "", "13#9"],
    ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
    ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
    ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
    ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
    ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
    ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
    ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
    ["1P 3M 5P 7m 9m 13M", "", "13b9"],
    ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
    ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
    ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
    ["1P 3M 5P 9m", "", "Maddb9"],
    ["1P 3M 5d", "", "Mb5"],
    ["1P 3M 5d 6M 7m 9M", "", "13b5"],
    ["1P 3M 5d 7M", "", "M7b5"],
    ["1P 3M 5d 7M 9M", "", "M9b5"],
    ["1P 3M 5d 7m", "", "7b5"],
    ["1P 3M 5d 7m 9M", "", "9b5"],
    ["1P 3M 7m", "", "7no5"],
    ["1P 3M 7m 13m", "", "7b13"],
    ["1P 3M 7m 9M", "", "9no5"],
    ["1P 3M 7m 9M 13M", "", "13no5"],
    ["1P 3M 7m 9M 13m", "", "9b13"],
    ["1P 3m 4P 5P", "", "madd4"],
    ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
    ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
    ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
    ["1P 3m 5P 9M", "", "madd9"],
    ["1P 3m 5d 6M 7M", "", "o7M7"],
    ["1P 3m 5d 7M", "", "oM7"],
    ["1P 3m 6m 7M", "", "mb6M7"],
    ["1P 3m 6m 7m", "", "m7#5"],
    ["1P 3m 6m 7m 9M", "", "m9#5"],
    ["1P 3m 5A 7m 9M 11P", "", "m11A"],
    ["1P 3m 6m 9m", "", "mb6b9"],
    ["1P 2M 3m 5d 7m", "", "m9b5"],
    ["1P 4P 5A 7M", "", "M7#5sus4"],
    ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
    ["1P 4P 5A 7m", "", "7#5sus4"],
    ["1P 4P 5P 7M", "", "M7sus4"],
    ["1P 4P 5P 7M 9M", "", "M9sus4"],
    ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
    ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
    ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
    ["1P 4P 7m 10m", "", "4 quartal"],
    ["1P 5P 7m 9m 11P", "", "11b9"]
  ];
  var data_default = CHORDS;
  var NoChordType = {
    ...EmptyPcset,
    name: "",
    quality: "Unknown",
    intervals: [],
    aliases: []
  };
  var dictionary = [];
  var index = {};
  function get2(type) {
    return index[type] || NoChordType;
  }
  var chordType = deprecate("ChordType.chordType", "ChordType.get", get2);
  function all() {
    return dictionary.slice();
  }
  var entries = deprecate("ChordType.entries", "ChordType.all", all);
  function add(intervals, aliases, fullName) {
    const quality = getQuality(intervals);
    const chord = {
      ...get(intervals),
      name: fullName || "",
      quality,
      intervals,
      aliases
    };
    dictionary.push(chord);
    if (chord.name) {
      index[chord.name] = chord;
    }
    index[chord.setNum] = chord;
    index[chord.chroma] = chord;
    chord.aliases.forEach((alias) => addAlias(chord, alias));
  }
  function addAlias(chord, alias) {
    index[alias] = chord;
  }
  function getQuality(intervals) {
    const has = (interval4) => intervals.indexOf(interval4) !== -1;
    return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
  }
  data_default.forEach(
    ([ivls, fullName, names2]) => add(ivls.split(" "), names2.split(" "), fullName)
  );
  dictionary.sort((a, b) => a.setNum - b.setNum);

  // ../../node_modules/@tonaljs/chord-detect/dist/index.mjs
  var BITMASK = {
    // 3m 000100000000
    // 3M 000010000000
    anyThirds: 384,
    // 5P 000000010000
    perfectFifth: 16,
    // 5d 000000100000
    // 5A 000000001000
    nonPerfectFifths: 40,
    anySeventh: 3
  };
  var testChromaNumber = (bitmask) => (chromaNumber) => Boolean(chromaNumber & bitmask);
  var hasAnyThird = testChromaNumber(BITMASK.anyThirds);
  var hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth);
  var hasAnySeventh = testChromaNumber(BITMASK.anySeventh);
  var hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths);

  // ../../node_modules/@tonaljs/chord/node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr3 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval2 = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX2 = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX2 = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX4 = new RegExp(
    "^" + INTERVAL_TONAL_REGEX2 + "|" + INTERVAL_SHORTHAND_REGEX2 + "$"
  );
  function tokenizeInterval2(str) {
    const m = REGEX4.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache4 = {};
  function interval2(src) {
    return typeof src === "string" ? cache4[src] || (cache4[src] = parse3(src)) : isPitch(src) ? interval2(pitchName3(src)) : isNamedPitch(src) ? interval2(src.name) : NoInterval2;
  }
  var SIZES2 = [0, 2, 4, 5, 7, 9, 11];
  var TYPES2 = "PMMPPMM";
  function parse3(str) {
    const tokens = tokenizeInterval2(str);
    if (tokens[0] === "") {
      return NoInterval2;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES2[step];
    if (t === "M" && q === "P") {
      return NoInterval2;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt2(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones2 = dir * (SIZES2[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES2[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones: semitones2,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval2(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval2(pitch(ivl));
  }
  function qToAlt2(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName3(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES2[step] === "M" ? "majorable" : "perfectable";
    const name = d + num + altToQ2(type, alt);
    return name;
  }
  function altToQ2(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr3("A", alt);
    } else {
      return fillStr3("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // ../../node_modules/@tonaljs/chord/node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-note/dist/index.mjs
  var NoNote2 = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });

  // ../../node_modules/@tonaljs/chord/node_modules/@tonaljs/interval/dist/index.mjs
  var IQ = "P m M m M P d P m M m M".split(" ");
  var add2 = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
  var subtract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
  function combinator(fn) {
    return (a, b) => {
      const coordA = interval2(a).coord;
      const coordB = interval2(b).coord;
      if (coordA && coordB) {
        const coord = fn(coordA, coordB);
        return coordToInterval2(coord).name;
      }
    };
  }

  // ../../node_modules/@tonaljs/scale-type/dist/index.mjs
  var SCALES = [
    // Basic scales
    ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
    ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
    ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
    // Jazz common scales
    ["1P 2M 3m 3M 5P 6M", "major blues"],
    ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
    ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
    ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
    ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
    ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
    // Modes
    ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
    ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
    ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
    ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
    ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
    // 5-note scales
    ["1P 3M 4P 5P 7M", "ionian pentatonic"],
    ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
    ["1P 2M 4P 5P 6M", "ritusen"],
    ["1P 2M 4P 5P 7m", "egyptian"],
    ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
    ["1P 3m 4P 5P 6m", "vietnamese 1"],
    ["1P 2m 3m 5P 6m", "pelog"],
    ["1P 2m 4P 5P 6m", "kumoijoshi"],
    ["1P 2M 3m 5P 6m", "hirajoshi"],
    ["1P 2m 4P 5d 7m", "iwato"],
    ["1P 2m 4P 5P 7m", "in-sen"],
    ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
    ["1P 3m 4P 6m 7m", "malkos raga"],
    ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
    ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
    ["1P 3m 4P 5P 6M", "minor six pentatonic"],
    ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
    ["1P 2M 3M 5P 6m", "flat six pentatonic"],
    ["1P 2m 3M 5P 6M", "scriabin"],
    ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
    ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
    ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
    ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
    ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
    // 6-note scales
    ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
    ["1P 2A 3M 5P 5A 7M", "augmented"],
    ["1P 2M 4P 5P 6M 7m", "piongio"],
    ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
    ["1P 2M 3M 4A 6M 7m", "prometheus"],
    ["1P 2m 3M 5d 6m 7m", "mystery #1"],
    ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
    ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
    ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
    // 7-note scales
    ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
    ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
    [
      "1P 2m 2A 3M 4A 6m 7m",
      "altered",
      "super locrian",
      "diminished whole tone",
      "pomeroy"
    ],
    ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
    [
      "1P 2M 3M 4P 5P 6m 7m",
      "mixolydian b6",
      "melodic minor fifth mode",
      "hindu"
    ],
    ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
    ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
    [
      "1P 2m 3m 4P 5P 6M 7m",
      "dorian b2",
      "phrygian #6",
      "melodic minor second mode"
    ],
    [
      "1P 2m 3m 4d 5d 6m 7d",
      "ultralocrian",
      "superlocrian bb7",
      "superlocrian diminished"
    ],
    ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
    ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
    // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
    [
      "1P 2M 3m 4A 5P 6M 7m",
      "dorian #4",
      "ukrainian dorian",
      "romanian minor",
      "altered dorian"
    ],
    ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
    ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
    ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
    ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
    ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
    ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
    ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
    ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
    ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
    ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
    ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
    ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
    ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
    ["1P 2m 3M 4P 5d 6m 7M", "persian"],
    ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
    [
      "1P 2M 3M 4P 5A 6M 7M",
      "major augmented",
      "major #5",
      "ionian augmented",
      "ionian #5"
    ],
    ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
    // 8-note scales
    ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
    ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
    ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
    ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
    ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
    ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
    ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
    ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
    ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
    [
      "1P 2m 3m 3M 4A 5P 6M 7m",
      "half-whole diminished",
      "dominant diminished",
      "messiaen's mode #2"
    ],
    ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
    ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
    // 9-note scales
    ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
    ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
    // 10-note scales
    ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
    // 12-note scales
    ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
  ];
  var data_default2 = SCALES;
  var NoScaleType = {
    ...EmptyPcset,
    intervals: [],
    aliases: []
  };
  var dictionary2 = [];
  var index2 = {};
  function get3(type) {
    return index2[type] || NoScaleType;
  }
  var scaleType = deprecate(
    "ScaleDictionary.scaleType",
    "ScaleType.get",
    get3
  );
  function all2() {
    return dictionary2.slice();
  }
  var entries2 = deprecate(
    "ScaleDictionary.entries",
    "ScaleType.all",
    all2
  );
  function add3(intervals, name, aliases = []) {
    const scale2 = { ...get(intervals), name, intervals, aliases };
    dictionary2.push(scale2);
    index2[scale2.name] = scale2;
    index2[scale2.setNum] = scale2;
    index2[scale2.chroma] = scale2;
    scale2.aliases.forEach((alias) => addAlias2(scale2, alias));
    return scale2;
  }
  function addAlias2(scale2, alias) {
    index2[alias] = scale2;
  }
  data_default2.forEach(
    ([ivls, name, ...aliases]) => add3(ivls.split(" "), name, aliases)
  );

  // ../../node_modules/@tonaljs/chord/dist/index.mjs
  var NoChord = {
    empty: true,
    name: "",
    symbol: "",
    root: "",
    bass: "",
    rootDegree: 0,
    type: "",
    tonic: null,
    setNum: NaN,
    quality: "Unknown",
    chroma: "",
    normalized: "",
    aliases: [],
    notes: [],
    intervals: []
  };
  function tokenize(name) {
    const [letter, acc, oct, type] = tokenizeNote(name);
    if (letter === "") {
      return tokenizeBass("", name);
    } else if (letter === "A" && type === "ug") {
      return tokenizeBass("", "aug");
    } else {
      return tokenizeBass(letter + acc, oct + type);
    }
  }
  function tokenizeBass(note22, chord2) {
    const split = chord2.split("/");
    if (split.length === 1) {
      return [note22, split[0], ""];
    }
    const [letter, acc, oct, type] = tokenizeNote(split[1]);
    if (letter !== "" && oct === "" && type === "") {
      return [note22, split[0], letter + acc];
    } else {
      return [note22, chord2, ""];
    }
  }
  function get4(src) {
    if (Array.isArray(src)) {
      return getChord(src[1] || "", src[0], src[2]);
    } else if (src === "") {
      return NoChord;
    } else {
      const [tonic, type, bass] = tokenize(src);
      const chord2 = getChord(type, tonic, bass);
      return chord2.empty ? getChord(src) : chord2;
    }
  }
  function getChord(typeName, optionalTonic, optionalBass) {
    const type = get2(typeName);
    const tonic = note(optionalTonic || "");
    const bass = note(optionalBass || "");
    if (type.empty || optionalTonic && tonic.empty || optionalBass && bass.empty) {
      return NoChord;
    }
    const bassInterval = distance(tonic.pc, bass.pc);
    const bassIndex = type.intervals.indexOf(bassInterval);
    const hasRoot = bassIndex >= 0;
    const root = hasRoot ? bass : note("");
    const rootDegree = bassIndex === -1 ? NaN : bassIndex + 1;
    const hasBass = bass.pc && bass.pc !== tonic.pc;
    const intervals = Array.from(type.intervals);
    if (hasRoot) {
      for (let i = 1; i < rootDegree; i++) {
        const num = intervals[0][0];
        const quality = intervals[0][1];
        const newNum = parseInt(num, 10) + 7;
        intervals.push(`${newNum}${quality}`);
        intervals.shift();
      }
    } else if (hasBass) {
      const ivl = subtract(distance(tonic.pc, bass.pc), "8P");
      if (ivl)
        intervals.unshift(ivl);
    }
    const notes2 = tonic.empty ? [] : intervals.map((i) => transpose(tonic.pc, i));
    typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
    const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${hasRoot && rootDegree > 1 ? "/" + root.pc : hasBass ? "/" + bass.pc : ""}`;
    const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${hasRoot && rootDegree > 1 ? " over " + root.pc : hasBass ? " over " + bass.pc : ""}`;
    return {
      ...type,
      name,
      symbol,
      tonic: tonic.pc,
      type: type.name,
      root: root.pc,
      bass: hasBass ? bass.pc : "",
      intervals,
      rootDegree,
      notes: notes2
    };
  }

  // ../../node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr4 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval3 = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX3 = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX3 = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX5 = new RegExp(
    "^" + INTERVAL_TONAL_REGEX3 + "|" + INTERVAL_SHORTHAND_REGEX3 + "$"
  );
  function tokenizeInterval3(str) {
    const m = REGEX5.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache5 = {};
  function interval3(src) {
    return typeof src === "string" ? cache5[src] || (cache5[src] = parse4(src)) : isPitch(src) ? interval3(pitchName4(src)) : isNamedPitch(src) ? interval3(src.name) : NoInterval3;
  }
  var SIZES3 = [0, 2, 4, 5, 7, 9, 11];
  var TYPES3 = "PMMPPMM";
  function parse4(str) {
    const tokens = tokenizeInterval3(str);
    if (tokens[0] === "") {
      return NoInterval3;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES3[step];
    if (t === "M" && q === "P") {
      return NoInterval3;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt3(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones2 = dir * (SIZES3[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES3[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones: semitones2,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval3(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval3(pitch(ivl));
  }
  function qToAlt3(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName4(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES3[step] === "M" ? "majorable" : "perfectable";
    const name = d + num + altToQ3(type, alt);
    return name;
  }
  function altToQ3(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr4("A", alt);
    } else {
      return fillStr4("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // ../../node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-note/dist/index.mjs
  var fillStr5 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoNote3 = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });
  var cache6 = /* @__PURE__ */ new Map();
  var stepToLetter2 = (step) => "CDEFGAB".charAt(step);
  var altToAcc2 = (alt) => alt < 0 ? fillStr5("b", -alt) : fillStr5("#", alt);
  var accToAlt2 = (acc) => acc[0] === "b" ? -acc.length : acc.length;
  function note3(src) {
    const stringSrc = JSON.stringify(src);
    const cached = cache6.get(stringSrc);
    if (cached) {
      return cached;
    }
    const value = typeof src === "string" ? parse5(src) : isPitch(src) ? note3(pitchName5(src)) : isNamedPitch(src) ? note3(src.name) : NoNote3;
    cache6.set(stringSrc, value);
    return value;
  }
  var REGEX6 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  function tokenizeNote2(str) {
    const m = REGEX6.exec(str);
    return m ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]] : ["", "", "", ""];
  }
  var mod3 = (n, m) => (n % m + m) % m;
  var SEMI2 = [0, 2, 4, 5, 7, 9, 11];
  function parse5(noteName) {
    const tokens = tokenizeNote2(noteName);
    if (tokens[0] === "" || tokens[3] !== "") {
      return NoNote3;
    }
    const letter = tokens[0];
    const acc = tokens[1];
    const octStr = tokens[2];
    const step = (letter.charCodeAt(0) + 3) % 7;
    const alt = accToAlt2(acc);
    const oct = octStr.length ? +octStr : void 0;
    const coord = coordinates({ step, alt, oct });
    const name = letter + acc + octStr;
    const pc = letter + acc;
    const chroma3 = (SEMI2[step] + alt + 120) % 12;
    const height = oct === void 0 ? mod3(SEMI2[step] + alt, 12) - 12 * 99 : SEMI2[step] + alt + 12 * (oct + 1);
    const midi = height >= 0 && height <= 127 ? height : null;
    const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
    return {
      empty: false,
      acc,
      alt,
      chroma: chroma3,
      coord,
      freq,
      height,
      letter,
      midi,
      name,
      oct,
      pc,
      step
    };
  }
  function pitchName5(props) {
    const { step, alt, oct } = props;
    const letter = stepToLetter2(step);
    if (!letter) {
      return "";
    }
    const pc = letter + altToAcc2(alt);
    return oct || oct === 0 ? pc + oct : pc;
  }

  // ../../node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-distance/dist/index.mjs
  function distance3(fromNote, toNote) {
    const from = note3(fromNote);
    const to = note3(toNote);
    if (from.empty || to.empty) {
      return "";
    }
    const fcoord = from.coord;
    const tcoord = to.coord;
    const fifths = tcoord[0] - fcoord[0];
    const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
    const forceDescending = to.height === from.height && to.midi !== null && from.oct === to.oct && from.step > to.step;
    return coordToInterval3([fifths, octs], forceDescending).name;
  }

  // ../../node_modules/@tonaljs/interval/dist/index.mjs
  var get5 = interval3;
  var semitones = (name2) => interval3(name2).semitones;
  var IQ2 = "P m M m M P d P m M m M".split(" ");
  var distance4 = distance3;
  var add4 = combinator2((a, b) => [a[0] + b[0], a[1] + b[1]]);
  var subtract2 = combinator2((a, b) => [a[0] - b[0], a[1] - b[1]]);
  function combinator2(fn) {
    return (a, b) => {
      const coordA = interval3(a).coord;
      const coordB = interval3(b).coord;
      if (coordA && coordB) {
        const coord = fn(coordA, coordB);
        return coordToInterval3(coord).name;
      }
    };
  }

  // ../../node_modules/@tonaljs/midi/dist/index.mjs
  var L2 = Math.log(2);
  var L440 = Math.log(440);
  var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
  var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
  function midiToNoteName(midi, options = {}) {
    if (isNaN(midi) || midi === -Infinity || midi === Infinity)
      return "";
    midi = Math.round(midi);
    const pcs = options.sharps === true ? SHARPS : FLATS;
    const pc = pcs[midi % 12];
    if (options.pitchClass) {
      return pc;
    }
    const o = Math.floor(midi / 12) - 1;
    return pc + o;
  }

  // ../../node_modules/@tonaljs/note/dist/index.mjs
  var get6 = note;
  var chroma = (note4) => get6(note4).chroma;
  function fromMidi(midi2) {
    return midiToNoteName(midi2);
  }

  // ../../node_modules/@tonaljs/roman-numeral/dist/index.mjs
  var NoRomanNumeral = { empty: true, name: "", chordType: "" };
  var cache7 = {};
  function get7(src) {
    return typeof src === "string" ? cache7[src] || (cache7[src] = parse6(src)) : typeof src === "number" ? get7(NAMES[src] || "") : isPitch(src) ? fromPitch(src) : isNamed(src) ? get7(src.name) : NoRomanNumeral;
  }
  var romanNumeral = deprecate(
    "RomanNumeral.romanNumeral",
    "RomanNumeral.get",
    get7
  );
  function fromPitch(pitch2) {
    return get7(altToAcc(pitch2.alt) + NAMES[pitch2.step]);
  }
  var REGEX7 = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
  function tokenize2(str) {
    return REGEX7.exec(str) || ["", "", "", ""];
  }
  var ROMANS = "I II III IV V VI VII";
  var NAMES = ROMANS.split(" ");
  var NAMES_MINOR = ROMANS.toLowerCase().split(" ");
  function parse6(src) {
    const [name, acc, roman, chordType2] = tokenize2(src);
    if (!roman) {
      return NoRomanNumeral;
    }
    const upperRoman = roman.toUpperCase();
    const step = NAMES.indexOf(upperRoman);
    const alt = accToAlt(acc);
    const dir = 1;
    return {
      empty: false,
      name,
      roman,
      interval: interval({ step, alt, dir }).name,
      acc,
      chordType: chordType2,
      alt,
      step,
      major: roman === upperRoman,
      oct: 0,
      dir
    };
  }

  // ../../node_modules/@tonaljs/key/dist/index.mjs
  var Empty = Object.freeze([]);
  var NoKey = {
    type: "major",
    tonic: "",
    alteration: 0,
    keySignature: ""
  };
  var NoKeyScale = {
    tonic: "",
    grades: Empty,
    intervals: Empty,
    scale: Empty,
    triads: Empty,
    chords: Empty,
    chordsHarmonicFunction: Empty,
    chordScales: Empty
  };
  var NoMajorKey = {
    ...NoKey,
    ...NoKeyScale,
    type: "major",
    minorRelative: "",
    scale: Empty,
    secondaryDominants: Empty,
    secondaryDominantsMinorRelative: Empty,
    substituteDominants: Empty,
    substituteDominantsMinorRelative: Empty
  };
  var NoMinorKey = {
    ...NoKey,
    type: "minor",
    relativeMajor: "",
    natural: NoKeyScale,
    harmonic: NoKeyScale,
    melodic: NoKeyScale
  };
  var mapScaleToType = (scale2, list, sep = "") => list.map((type, i) => `${scale2[i]}${sep}${type}`);
  function keyScale(grades, triads, chords, harmonicFunctions, chordScales) {
    return (tonic) => {
      const intervals = grades.map((gr) => get7(gr).interval || "");
      const scale2 = intervals.map((interval4) => transpose(tonic, interval4));
      return {
        tonic,
        grades,
        intervals,
        scale: scale2,
        triads: mapScaleToType(scale2, triads),
        chords: mapScaleToType(scale2, chords),
        chordsHarmonicFunction: harmonicFunctions.slice(),
        chordScales: mapScaleToType(scale2, chordScales, " ")
      };
    };
  }
  var distInFifths = (from, to) => {
    const f = note(from);
    const t = note(to);
    return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
  };
  var MajorScale = keyScale(
    "I II III IV V VI VII".split(" "),
    " m m   m dim".split(" "),
    "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
    "T SD T SD D T D".split(" "),
    "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
  );
  var NaturalScale = keyScale(
    "I II bIII IV V bVI bVII".split(" "),
    "m dim  m m  ".split(" "),
    "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
    "T SD T SD D SD SD".split(" "),
    "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
  );
  var HarmonicScale = keyScale(
    "I II bIII IV V bVI VII".split(" "),
    "m dim aug m   dim".split(" "),
    "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
    "T SD T SD D SD D".split(" "),
    "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
      ","
    )
  );
  var MelodicScale = keyScale(
    "I II bIII IV V VI VII".split(" "),
    "m m aug   dim dim".split(" "),
    "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
    "T SD T SD D  ".split(" "),
    "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
      ","
    )
  );
  function minorKey(tnc) {
    const pc = note(tnc).pc;
    if (!pc)
      return NoMinorKey;
    const alteration = distInFifths("C", pc) - 3;
    return {
      type: "minor",
      tonic: pc,
      relativeMajor: transpose(pc, "3m"),
      alteration,
      keySignature: altToAcc(alteration),
      natural: NaturalScale(pc),
      harmonic: HarmonicScale(pc),
      melodic: MelodicScale(pc)
    };
  }

  // ../../node_modules/@tonaljs/scale/dist/index.mjs
  var NoScale = {
    empty: true,
    name: "",
    type: "",
    tonic: null,
    setNum: NaN,
    chroma: "",
    normalized: "",
    aliases: [],
    notes: [],
    intervals: []
  };
  function tokenize3(name) {
    if (typeof name !== "string") {
      return ["", ""];
    }
    const i = name.indexOf(" ");
    const tonic = note(name.substring(0, i));
    if (tonic.empty) {
      const n = note(name);
      return n.empty ? ["", name] : [n.name, ""];
    }
    const type = name.substring(tonic.name.length + 1).toLowerCase();
    return [tonic.name, type.length ? type : ""];
  }
  function get8(src) {
    const tokens = Array.isArray(src) ? src : tokenize3(src);
    const tonic = note(tokens[0]).name;
    const st = get3(tokens[1]);
    if (st.empty) {
      return NoScale;
    }
    const type = st.name;
    const notes = tonic ? st.intervals.map((i) => transpose(tonic, i)) : [];
    const name = tonic ? tonic + " " + type : type;
    return { ...st, name, type, tonic, notes };
  }
  var scale = deprecate("Scale.scale", "Scale.get", get8);

  // ../../packages/util/color/dist/index.mjs
  var map2rgbByHue = (h, max, mid) => {
    switch (Math.floor(h)) {
      case 0:
        return [max, mid, 0];
      case 1:
        return [mid, max, 0];
      case 2:
        return [0, max, mid];
      case 3:
        return [0, mid, max];
      case 4:
        return [mid, 0, max];
      case 5:
        return [max, 0, mid];
      default:
        throw new Error(`Unexpected value received. It should be in 0 <= h < 6, but h is ${h}`);
    }
  };
  var hsv2rgb = (h, s, v3) => {
    new Assertion(0 <= s && s <= 1).onFailed(() => {
      throw new RangeError(`Unexpected value received. It should be in 0 <= s <= 1, but max is ${s}`);
    });
    new Assertion(0 <= v3 && v3 <= 1).onFailed(() => {
      throw new RangeError(`Unexpected value received. It should be in 0 <= v <= 1, but mid is ${v3}`);
    });
    const H = mod(h, 360) / 60;
    const max = v3 * s;
    const mid = v3 * s * Math.abs(mod(H + 1, 2) - 1);
    const m = v3 * (1 - s);
    const rgb = map2rgbByHue(H, max, mid);
    const f = (e) => Math.floor((e + m) * 256);
    const g = (e) => e > 255 ? 255 : e;
    return [g(f(rgb[0])), g(f(rgb[1])), g(f(rgb[2]))];
  };
  var rgbToString = (rgb) => "#" + rgb.map((e) => ("0" + e.toString(16)).slice(-2)).join("");
  var green_hue = 120;
  var thirdToColor = (note4, tonic, s, v3) => {
    if (note4.length === 0) {
      return "rgb(64, 64, 64)";
    }
    const interval4 = get5(distance4(tonic, note4));
    const circle_of_third_pos = mod(chroma(tonic) * 5, 12) - interval4.step / 4;
    return rgbToString(hsv2rgb(-circle_of_third_pos * 360 / 12 + green_hue, s, v3));
  };
  var fifthChromaToColor = (chroma3, s, v3) => rgbToString(hsv2rgb(-mod(chroma3 * 5, 12) * 360 / 12 + green_hue, s, v3));
  var fifthToColor = (note4, s, v3) => note4.length ? fifthChromaToColor(chroma(note4), s, v3) : "rgb(64, 64, 64)";

  // ../../packages/UI/piano-roll/chord-view/dist/index.mjs
  var chord_name_margin = 5;
  var chord_text_em = size;
  var chord_text_size = 16 * chord_text_em;
  var oneLetterKey = (key) => {
    const tonic = key.tonic || "";
    const type = key.type;
    if (type === "aeolian") {
      return getLowerCase(tonic);
    } else if (type === "minor") {
      return getLowerCase(tonic);
    } else if (type === "ionian") {
      return getCapitalCase(tonic);
    } else if (type === "major") {
      return getCapitalCase(tonic);
    } else {
      return key.name;
    }
  };
  var getChordKeyModel = (e) => ({
    time: e.time,
    chord: e.chord,
    scale: e.scale,
    roman: e.roman,
    tonic: e.scale.tonic || ""
  });
  var getColor = (tonic) => (s, v3) => {
    return fifthToColor(tonic, s, v3) || "rgb(0, 0, 0)";
  };
  var updateChordKeyViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordKeyViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var scaled2 = (e) => e * NoteSize.get();
  var onWindowResized = (begin, svg) => () => {
    updateChordKeyViewX(svg)(scaled2(begin));
  };
  function buildChordKeySeries(romans, controllers) {
    const children = romans.map((e) => {
      const model = getChordKeyModel(e);
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg2.id = "key-name";
      svg2.style.fontFamily = "Times New Roman";
      svg2.style.fontSize = `${chord_text_em}em`;
      svg2.style.textAnchor = "end";
      svg2.textContent = oneLetterKey(model.scale) + ": ";
      svg2.style.fill = getColor(model.tonic)(1, 0.75);
      updateChordKeyViewX(svg2)(scaled2(model.time.begin));
      updateChordKeyViewY(svg2)(PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin));
      const key = { model, svg: svg2 };
      return key;
    });
    const id = "key-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    controllers.audio.addListeners(() => children.forEach((e) => onWindowResized(e.model.time.begin, e.svg)()));
    controllers.window.addListeners(() => children.forEach((e) => onWindowResized(e.model.time.begin, e.svg)));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var getChordNoteModel = (e, note4, oct) => ({
    ...e,
    type: e.chord.type,
    note: note4.chroma,
    note_name: note4.name,
    tonic: e.chord.tonic || "",
    interval: distance4(e.chord.tonic || "", note4),
    oct
  });
  var updateChordNoteViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordNoteViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var updateChordNoteViewWidth = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateChordNoteViewHeight = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var getColor2 = (tonic) => (s, v3) => {
    return fifthToColor(tonic, s, v3) || "rgb(0, 0, 0)";
  };
  var scaled22 = (e) => e * NoteSize.get();
  var updateChordNoteX = (svg, begin) => {
    updateChordNoteViewX(svg)(scaled22(begin));
  };
  var updateChordNoteY = (svg, y) => {
    updateChordNoteViewY(svg)(y);
  };
  var updateChordNoteWidth = (svg, duration) => {
    updateChordNoteViewWidth(svg)(scaled22(duration));
  };
  var updateChordNoteHeight = (svg) => {
    updateChordNoteViewHeight(svg)(black_key_height);
  };
  var onWindowResized_ChordNote = (svg, model) => {
    updateChordNoteX(svg, model.time.begin);
    updateChordNoteWidth(svg, scaled22(model.time.duration));
    updateChordNoteHeight(svg);
  };
  function buildChordNotesSeries(romans, controllers) {
    const children = romans.map((roman) => {
      const model = roman;
      const chord = model.chord;
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg2.id = chord.name;
      const children2 = [...Array(OctaveCount.get())].map((_, oct) => {
        const svg3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg3.id = `${chord.name}-${oct}`;
        const children3 = chord.notes.map((note4) => {
          const model2 = getChordNoteModel(roman, get6(note4), oct);
          const svg4 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          svg4.id = "key-name";
          svg4.style.fontFamily = "Times New Roman";
          svg4.style.fontSize = `${chord_text_em}em`;
          svg4.style.textAnchor = "end";
          svg4.textContent = oneLetterKey(model2.scale) + ": ";
          svg4.style.fill = getColor2(model2.tonic)(1, 0.75);
          svg4.style.stroke = "rgb(64, 64, 64)";
          svg4.style.fill = thirdToColor(model2.note_name, model2.tonic, 0.25, 1);
          if (false) {
            svg4.style.fill = getColor2(model2.tonic)(0.25, model2.type === "major" ? 1 : 0.9);
          }
          const y = [model2.note].map((e) => mod(e, 12)).map((e) => e + 12).map((e) => e * model2.oct).map((e) => PianoRollConverter.midi2BlackCoordinate(e))[0];
          updateChordNoteX(svg4, model2.time.begin);
          updateChordNoteY(svg4, y);
          updateChordNoteWidth(svg4, scaled22(model2.time.duration));
          updateChordNoteHeight(svg4);
          return { model: model2, svg: svg4 };
        });
        children3.forEach((e) => svg3.appendChild(e.svg));
        return { svg: svg3, children: children3 };
      });
      children2.forEach((e) => svg2.appendChild(e.svg));
      return { svg: svg2, children: children2 };
    });
    const id = "chords";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    controllers.audio.addListeners(() => children.forEach((e) => e.children.forEach((e2) => e2.children.forEach((e3) => onWindowResized_ChordNote(e3.svg, e3.model)))));
    controllers.window.addListeners(() => children.forEach((e) => e.children.forEach((e2) => e2.children.forEach((e3) => onWindowResized_ChordNote(e3.svg, e3.model)))));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var shortenChord = (chord) => {
    const M7 = chord.replace("major seventh", "M7");
    const major = M7.replace("major", "");
    const minor = major.replace("minor ", "m").replace("minor", "m");
    const seventh = minor.replace("seventh", "7");
    return seventh;
  };
  var getChordNameModel = (e) => ({
    ...e,
    tonic: e.chord.tonic || ""
  });
  var getColor3 = (tonic) => (s, v3) => {
    return fifthToColor(tonic, s, v3) || "rgb(0, 0, 0)";
  };
  var updateChordNameViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordNameViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var scaled3 = (e) => e * NoteSize.get();
  function buildChordNameSeries(romans, controllers) {
    const children = romans.map((e) => {
      const model = getChordNameModel(e);
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg2.textContent = shortenChord(model.chord.name);
      svg2.id = "chord-name";
      svg2.style.fontFamily = "Times New Roman";
      svg2.style.fontSize = `${chord_text_em}em`;
      svg2.style.fill = getColor3(model.tonic)(1, 0.75);
      updateChordNameViewX(svg2)(scaled3(model.time.begin));
      updateChordNameViewY(svg2)(PianoRollHeight.get() + chord_text_size);
      return svg2;
    });
    const id = "chord-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e));
    controllers.audio.addListeners(() => children.forEach((e) => updateChordNameViewY(e)(PianoRollHeight.get() + chord_text_size)));
    controllers.window.addListeners(() => children.forEach((e) => updateChordNameViewY(e)(PianoRollHeight.get() + chord_text_size)));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var getChordRomanModel = (e) => ({
    ...e,
    tonic: e.chord.tonic || ""
  });
  var getColor4 = (tonic) => (s, v3) => {
    return fifthToColor(tonic, s, v3) || "rgb(0, 0, 0)";
  };
  var updateChordRomanViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordRomanViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var scaled4 = (e) => e * NoteSize.get();
  function buildChordRomanSeries(romans, controllers) {
    const children = romans.map((e) => {
      const model = getChordRomanModel(e);
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg2.textContent = shortenChord(model.roman);
      svg2.id = "roman-name";
      svg2.style.fontFamily = "Times New Roman";
      svg2.style.fontSize = `${chord_text_em}em`;
      svg2.style.fill = getColor4(model.tonic)(1, 0.75);
      updateChordRomanViewX(svg2)(scaled4(model.time.begin));
      updateChordRomanViewY(svg2)(PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin));
      return { model, svg: svg2 };
    });
    const id = "roman-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    controllers.audio.addListeners(() => children.forEach((e) => updateChordRomanViewX(e.svg)(scaled4(e.model.time.begin))));
    controllers.window.addListeners(() => children.forEach((e) => updateChordRomanViewX(e.svg)(scaled4(e.model.time.begin))));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var getRequiredByChordPartModel = (e) => ({
    time: e.time,
    chord: get4(e.chord),
    scale: get8(e.scale),
    roman: e.scale
  });
  var ChordElements = class {
    children;
    chord_keys;
    chord_names;
    chord_notes;
    chord_romans;
    constructor(romans, controllers) {
      const data = romans.map((e) => getRequiredByChordPartModel(e));
      const chord_keys = buildChordKeySeries(data, controllers);
      const chord_names = buildChordNameSeries(data, controllers);
      const chord_notes = buildChordNotesSeries(data, controllers);
      const chord_romans = buildChordRomanSeries(data, controllers);
      this.chord_keys = chord_keys;
      this.chord_names = chord_names;
      this.chord_notes = chord_notes;
      this.chord_romans = chord_romans;
      this.children = [
        this.chord_keys,
        this.chord_names,
        this.chord_notes,
        this.chord_romans
      ];
    }
  };

  // ../../packages/UI/piano-roll/melody-view/dist/index.mjs
  var updateX_DMelodyView = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateY_DMelodyView = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var updateWidth_DMelodyView = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateHeight_DMelodyView = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var updateX = (svg) => (begin) => {
    updateX_DMelodyView(svg)(PianoRollConverter.scaled(begin));
  };
  var updateY = (svg) => (note4) => {
    updateY_DMelodyView(svg)(PianoRollConverter.midi2NNBlackCoordinate(note4));
  };
  var updateWidth = (svg) => (duration) => {
    updateWidth_DMelodyView(svg)(PianoRollConverter.scaled(duration));
  };
  var updateHeight = (svg) => {
    updateHeight_DMelodyView(svg)(black_key_height);
  };
  var onWindowResized2 = (svg) => (model) => {
    updateX(svg)(model.time.begin);
    updateWidth(svg)(model.time.duration);
    updateHeight(svg);
  };
  var onTimeRangeChanged = onWindowResized2;
  var onDMelodyVisibilityChanged = (svg) => (visible) => {
    const visibility = visible ? "visible" : "hidden";
    svg.setAttribute("visibility", visibility);
  };
  var onAudioUpdate = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  function getMelodyViewSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.id = "melody-note";
    svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    svg.style.stroke = "rgb(64, 64, 64)";
    return svg;
  }
  function getSVGG(id, parts) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    parts.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildDMelody(d_melody, controllers) {
    const children = d_melody.map((melody) => {
      const svg2 = getMelodyViewSVG();
      updateX(svg2)(melody.time.begin);
      updateY(svg2)(melody.note);
      updateWidth(svg2)(melody.time.duration);
      updateHeight(svg2);
      return { model: melody, svg: svg2 };
    });
    const svg = getSVGG("detected-melody", children);
    const d_melody_collection = { svg, children };
    controllers.window.addListeners(...d_melody_collection.children.map((e) => () => onWindowResized2(e.svg)(e.model)));
    controllers.time_range.addListeners(...d_melody_collection.children.map((e) => () => onTimeRangeChanged(e.svg)(e.model)));
    controllers.d_melody.addListeners(onDMelodyVisibilityChanged(d_melody_collection.svg));
    controllers.audio.addListeners(() => onAudioUpdate(d_melody_collection.svg));
    onAudioUpdate(d_melody_collection.svg);
    return d_melody_collection.svg;
  }
  var IRPlotAxis = class {
    constructor(svg) {
      this.svg = svg;
    }
  };
  var IRPlotCircles = class {
    constructor(svg) {
      this.svg = svg;
      this._show = [];
    }
    _show;
    get show() {
      return this._show;
    }
    setShow(visible_layers) {
      this._show = visible_layers;
      this.svg.replaceChildren(...this._show.map((e) => e.view.svg));
    }
  };
  var IRPlotHierarchyModel = class {
    width;
    height;
    constructor(children) {
      const w = Math.max(...children.map((e) => e.view.model.w));
      const h = Math.max(...children.map((e) => e.view.model.h));
      this.width = w;
      this.height = h;
    }
  };
  var IRPlotHierarchyView = class {
    constructor(svg, x_axis, y_axis, circles) {
      this.svg = svg;
      this.x_axis = x_axis;
      this.y_axis = y_axis;
      this.circles = circles;
    }
    updateCircleVisibility(visible_layer) {
      this.circles.setShow(visible_layer);
    }
  };
  var CacheCore = class {
    constructor(melody_series) {
      this.melody_series = melody_series;
      this.#cache = [];
      this.#index = 0;
    }
    #cache;
    #index;
    cacheHit() {
      return this.#cache[1]?.time.has(NowAt.get());
    }
    cacheUpdate() {
      if (this.cacheHit()) {
        return this.#cache;
      } else {
        this.#index = this.melody_series.findIndex(
          (value) => value.time.has(NowAt.get())
        );
      }
      const i = this.#index;
      const N = this.melody_series.length;
      const melodies = [
        this.melody_series[Math.max(0, i - 1)],
        this.melody_series[Math.max(0, i)],
        this.melody_series[Math.min(i + 1, N - 1)],
        this.melody_series[Math.min(i + 2, N - 1)]
      ];
      this.#cache = melodies;
    }
    get index() {
      this.cacheUpdate();
      return this.#index;
    }
    get melody() {
      this.cacheUpdate();
      return this.#cache;
    }
  };
  var MelodiesCache = class {
    #core;
    constructor(melody_series) {
      this.#core = new CacheCore(melody_series);
    }
    get is_visible() {
      const i = this.#core.index;
      return 1 <= i && i < this.#core.melody_series.length - 1;
    }
    getRangedMelody() {
      return this.#core.melody;
    }
    getPositionRatio() {
      const melodies = this.#core.melody;
      const t = [melodies[1].time.begin, melodies[2].time.begin];
      return (NowAt.get() - t[0]) / (t[1] - t[0]);
    }
    getInterval() {
      const melodies = this.#core.melody.map((e) => e.note);
      return [
        melodies[1] - melodies[0] || 0,
        melodies[2] - melodies[1] || 0,
        melodies[3] - melodies[2] || 0
      ];
    }
    getCurrentNote() {
      return this.#core.melody[1];
    }
  };
  var IRPlotModel = class {
    time;
    head;
    melody;
    get archetype() {
      return this.melody.getCurrentNote().melody_analysis.implication_realization;
    }
    constructor(melody_series) {
      this.time = new Time(0, 0);
      this.head = new Time(0, 0);
      this.melody = new MelodiesCache(melody_series);
    }
    get is_visible() {
      return this.melody.is_visible;
    }
    getRangedMelody() {
      return this.melody.getRangedMelody();
    }
    getPositionRatio() {
      return this.melody.getPositionRatio();
    }
    getInterval() {
      return this.melody.getInterval();
    }
    getCurrentNote() {
      return this.melody.getCurrentNote();
    }
  };
  var IRPlotViewModel = class {
    x0;
    y0;
    w;
    h;
    constructor() {
      this.w = 500;
      this.h = 500;
      this.x0 = 250;
      this.y0 = 250;
    }
    getTranslatedX(x) {
      return x * this.w / 2 + this.x0;
    }
    getTranslatedY(y) {
      return y * this.h / 2 + this.y0;
    }
  };
  var get_pos = (_x, _y) => {
    const a = 1 / 3;
    const x = a * _x;
    const y = a * _y;
    const double_angle_x = x * x - y * y;
    const double_angle_y = 2 * x * y;
    const r2 = 1 + x * x + y * y;
    return [
      double_angle_x / r2,
      double_angle_y / r2
    ];
  };
  var nan2zero = (x) => isNaN(x) ? 0 : x;
  var IRPlotView = class {
    constructor(svg, view_model, model) {
      this.svg = svg;
      this.view_model = view_model;
      this.model = model;
    }
    updateRadius(r) {
      this.svg.style.r = String(r);
    }
    updateX(x) {
      [x].map((e) => this.view_model.getTranslatedX(e)).map((e) => nan2zero(e)).map((e) => this.svg.setAttribute("cx", String(e)));
    }
    updateY(y) {
      [y].map((e) => this.view_model.getTranslatedY(e)).map((e) => nan2zero(e)).map((e) => this.svg.setAttribute("cy", String(e)));
    }
    easeInOutCos(t) {
      return (1 - Math.cos(t * Math.PI)) / 2;
    }
    updatePosition() {
      const interval4 = this.model.getInterval();
      const curr = get_pos(interval4[0], interval4[1]);
      const next = get_pos(interval4[1], interval4[2]);
      const r = this.easeInOutCos(this.model.getPositionRatio());
      this.updateX(-((1 - r) * curr[0] + r * next[0]));
      this.updateY(-((1 - r) * curr[1] + r * next[1]));
    }
    setColor = (color) => this.svg.style.fill = color;
  };
  var IRPlot = class {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.view = view;
    }
    get svg() {
      return this.view.svg;
    }
    onAudioUpdate() {
      this.view.updatePosition();
    }
    onWindowResized() {
    }
    setColor = (f) => this.view.setColor(f(this.model.archetype));
  };
  var IRPlotLayerModel = class {
    constructor(w, h) {
      this.w = w;
      this.h = h;
    }
  };
  var IRPlotLayerView = class {
    constructor(svg, layer, model) {
      this.svg = svg;
      this.layer = layer;
      this.model = model;
    }
    updateWidth(w) {
      this.svg.setAttribute("width", String(w));
    }
    updateHeight(h) {
      this.svg.setAttribute("height", String(h));
    }
  };
  var IRPlotLayer = class {
    constructor(svg, view, children, layer) {
      this.svg = svg;
      this.view = view;
      this.children = children;
      this.layer = layer;
      this.svg = svg;
      this.children_model = this.children.map((e) => e.model);
      this.#show = children;
    }
    children_model;
    #show;
    get show() {
      return this.#show;
    }
    onAudioUpdate() {
      this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
    }
  };
  var IRPlotHierarchy = class {
    constructor(svg, children, view, model) {
      this.svg = svg;
      this.children = children;
      this.view = view;
      this.model = model;
      this.#visible_layer = children.length;
    }
    #visible_layer;
    _show = [];
    get show() {
      return this.view.circles.show;
    }
    updateLayer() {
      const visible_layer = this.children.filter((e) => e.children[0].model.is_visible).filter((e) => 1 < e.layer && e.layer <= this.#visible_layer);
      this.view.updateCircleVisibility(visible_layer);
    }
    onChangedLayer(value) {
      this.#visible_layer = value;
      this.updateLayer();
    }
    setShow(visible_layers) {
      this._show = visible_layers;
      this._show.forEach((e) => e.onAudioUpdate());
      this.svg.replaceChildren(...this._show.map((e) => e.svg));
    }
  };
  var IRPlotSVG = class {
    constructor(svg, children) {
      this.svg = svg;
      this.children = children;
    }
  };
  function getCircle() {
    const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle_svg.style.stroke = "rgb(16, 16, 16)";
    circle_svg.style.strokeWidth = String(6);
    return circle_svg;
  }
  function getLayer(layer, child) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = `layer-${layer}`;
    svg.appendChild(child.view.svg);
    return svg;
  }
  function updateRadius(l, N, part) {
    const base = Math.min(part.view.view_model.w, part.view.view_model.h) / 10 / N;
    part.view.updateRadius(base * (N - l / 2));
  }
  function getAxis(p) {
    const x_axis_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    x_axis_svg.setAttribute("x1", String(p.x1));
    x_axis_svg.setAttribute("x2", String(p.x2));
    x_axis_svg.setAttribute("y1", String(p.y1));
    x_axis_svg.setAttribute("y2", String(p.y2));
    x_axis_svg.style.stroke = "rgb(0, 0, 0)";
    return x_axis_svg;
  }
  function getAxisSVG(w, h, x_axis, y_axis, circles) {
    const axis_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    axis_svg.id = "implication-realization plot";
    axis_svg.replaceChildren(x_axis.svg, y_axis.svg, circles.svg);
    axis_svg.setAttribute("width", String(w));
    axis_svg.setAttribute("height", String(h));
    return axis_svg;
  }
  function getSVGG2(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildIRPlot(h_melodies, controllers) {
    const layers = h_melodies.map((e, l) => {
      const model = new IRPlotModel(e);
      const circle_svg2 = getCircle();
      const view_model = new IRPlotViewModel();
      const view2 = new IRPlotView(circle_svg2, view_model, model);
      const part = new IRPlot(model, view2);
      const svg2 = getLayer(l, part);
      const layer_model = new IRPlotLayerModel(part.view.view_model.w, part.view.view_model.h);
      updateRadius(l, h_melodies.length, part);
      const layer_view = new IRPlotLayerView(svg2, l, layer_model);
      layer_view.updateWidth(layer_model.w);
      layer_view.updateHeight(layer_model.h);
      const svgg2 = getSVGG2(`layer-${l}`, [part]);
      return new IRPlotLayer(svgg2, layer_view, [part], l);
    });
    const h_model = new IRPlotHierarchyModel(layers);
    const w = h_model.width;
    const h = h_model.height;
    const x_axis_svg = getAxis({ x1: 0, x2: w, y1: h / 2, y2: h / 2 });
    const y_axis_svg = getAxis({ x1: w / 2, x2: w / 2, y1: 0, y2: h });
    const x_axis = new IRPlotAxis(x_axis_svg);
    const y_axis = new IRPlotAxis(y_axis_svg);
    const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circles = new IRPlotCircles(circle_svg);
    const axis_svg = getAxisSVG(w, h, x_axis, y_axis, circles);
    const view = new IRPlotHierarchyView(axis_svg, x_axis, y_axis, circles);
    const svgg = getSVGG2("IR-plot-hierarchy", layers);
    const hierarchy = [new IRPlotHierarchy(svgg, layers, view, h_model)];
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "IR-plot";
    hierarchy.forEach((e) => svg.appendChild(e.view.svg));
    hierarchy.forEach((e) => svg.setAttribute("width", String(e.model.width)));
    hierarchy.forEach((e) => svg.setAttribute("height", String(e.model.height)));
    const ir_plot_svg = new IRPlotSVG(svg, hierarchy);
    controllers.window.addListeners(...ir_plot_svg.children.flatMap((e) => e).flatMap((e) => e.children).flatMap((e) => e.children).map((e) => e.onWindowResized.bind(e)));
    controllers.hierarchy.addListeners(...ir_plot_svg.children.flatMap((e) => e.onChangedLayer.bind(e)));
    controllers.melody_color.addListeners(...ir_plot_svg.children.flatMap((e) => e.children).flatMap((e) => e.children).map((e) => e.setColor.bind(e)));
    controllers.audio.addListeners(...ir_plot_svg.children.flatMap((e) => e.children).map((e) => e.onAudioUpdate.bind(e)));
    ir_plot_svg.children.flatMap((e) => e.children).map((e) => e.onAudioUpdate());
    return ir_plot_svg.svg;
  }
  var IRSymbolModel = class {
    time;
    head;
    note;
    archetype;
    layer;
    constructor(e, layer) {
      this.time = e.time;
      this.head = e.head;
      this.note = e.note;
      this.archetype = e.melody_analysis.implication_realization;
      this.layer = layer || 0;
    }
  };
  var ir_analysis_em = size;
  var IRSymbolView = class {
    constructor(svg) {
      this.svg = svg;
    }
    updateX(x) {
      this.svg.setAttribute("x", String(x));
    }
    updateY(y) {
      this.svg.setAttribute("y", String(y));
    }
    setColor = (color) => this.svg.style.fill = color;
  };
  var IRSymbol = class {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.#y = PianoRollConverter.midi2NNBlackCoordinate(this.model.note);
      this.updateX();
      this.updateY();
    }
    get svg() {
      return this.view.svg;
    }
    #y;
    updateX() {
      this.view.updateX(
        PianoRollConverter.scaled(this.model.time.begin) + PianoRollConverter.scaled(this.model.time.duration) / 2
      );
    }
    updateY() {
      this.view.updateY(this.#y);
    }
    onWindowResized() {
      this.updateX();
    }
    onTimeRangeChanged = this.onWindowResized;
    setColor = (f) => this.view.setColor(f(this.model.archetype));
  };
  var IRSymbolLayer = class {
    constructor(svg, children, layer) {
      this.svg = svg;
      this.children = children;
      this.layer = layer;
      this.svg = svg;
      this.children_model = this.children.map((e) => e.model);
      this.#show = children;
    }
    children_model;
    #show;
    get show() {
      return this.#show;
    }
    onAudioUpdate() {
      this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
    }
  };
  var IRSymbolHierarchy = class {
    constructor(svg, children) {
      this.svg = svg;
      this.children = children;
    }
    _show = [];
    get show() {
      return this._show;
    }
    setShow(visible_layers) {
      this._show = visible_layers;
      this._show.forEach((e) => e.onAudioUpdate());
      this.svg.replaceChildren(...this._show.map((e) => e.svg));
    }
    onChangedLayer(value) {
      const visible_layer = this.children.filter((e) => value === e.layer);
      this.setShow(visible_layer);
    }
  };
  function getIRSymbolSVG(text) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svg.textContent = text;
    svg.id = "I-R Symbol";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${ir_analysis_em}em`;
    svg.style.textAnchor = "middle";
    svg.style.visibility = "hidden";
    return svg;
  }
  function getSVGG3(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildIRSymbol(h_melodies, controllers) {
    const layers = h_melodies.map((e, l) => {
      const parts = e.map((e2) => {
        const model = new IRSymbolModel(e2, l);
        const svg3 = getIRSymbolSVG(model.archetype.symbol);
        const view = new IRSymbolView(svg3);
        return new IRSymbol(model, view);
      });
      const svg2 = getSVGG3(`layer-${l}`, parts);
      return new IRSymbolLayer(svg2, parts, l);
    });
    const svg = getSVGG3("implication-realization archetype", layers);
    const ir_hierarchy = new IRSymbolHierarchy(svg, layers);
    controllers.window.addListeners(...ir_hierarchy.children.flatMap((e) => e.children).map((e) => e.onWindowResized.bind(e)));
    controllers.hierarchy.addListeners(ir_hierarchy.onChangedLayer.bind(ir_hierarchy));
    controllers.time_range.addListeners(...ir_hierarchy.children.flatMap((e) => e.children).map((e) => e.onTimeRangeChanged.bind(e)));
    controllers.melody_color.addListeners(...ir_hierarchy.children.flatMap((e) => e.children).map((e) => e.setColor.bind(e)));
    controllers.audio.addListeners(...ir_hierarchy.children.map((e) => e.onAudioUpdate.bind(e)));
    ir_hierarchy.children.map((e) => e.onAudioUpdate());
    return ir_hierarchy.svg;
  }
  var deleteMelody = () => {
    console.log("deleteMelody called");
  };
  var MelodyBeep = class {
    constructor(model) {
      this.model = model;
      this.#beep_volume = 0;
      this.#do_melody_beep = false;
      this.#sound_reserved = false;
    }
    #beep_volume;
    #do_melody_beep;
    #sound_reserved;
    #beepMelody = () => {
      const volume = this.#beep_volume / 400;
      const pitch2 = [440 * Math.pow(2, (this.model.note - 69) / 12)];
      const begin_sec = this.model.time.begin - NowAt.get();
      const length_sec = this.model.time.duration;
      play(pitch2, begin_sec, length_sec, volume);
      this.#sound_reserved = true;
      setTimeout(() => {
        this.#sound_reserved = false;
      }, reservation_range * 1e3);
    };
    beepMelody = () => {
      if (!this.#do_melody_beep) {
        return;
      }
      if (!this.model.note) {
        return;
      }
      const model_is_in_range = new Time(0, reservation_range).map((e) => e + NowAt.get()).has(this.model.time.begin);
      if (model_is_in_range) {
        if (this.#sound_reserved === false) {
          this.#beepMelody();
        }
      }
    };
    onMelodyBeepCheckChanged(do_melody_beep) {
      this.#do_melody_beep = do_melody_beep;
    }
    onMelodyVolumeBarChanged(beep_volume) {
      this.#beep_volume = beep_volume;
    }
  };
  var MelodyModel = class {
    time;
    head;
    note;
    melody_analysis;
    archetype;
    constructor(e) {
      this.time = e.time;
      this.head = e.head;
      this.note = e.note;
      this.melody_analysis = e.melody_analysis;
      this.archetype = e.melody_analysis.implication_realization;
    }
  };
  var MelodyView = class {
    constructor(svg) {
      this.svg = svg;
    }
    updateX(x) {
      this.svg.setAttribute("x", String(x));
    }
    updateY(y) {
      this.svg.setAttribute("y", String(y));
    }
    updateWidth(w) {
      this.svg.setAttribute("width", String(w));
    }
    updateHeight(h) {
      this.svg.setAttribute("height", String(h));
    }
    setColor = (color) => this.svg.style.fill = "#0d0";
  };
  var Melody = class {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.#beeper = new MelodyBeep(model);
      this.updateX();
      this.updateY();
      this.updateWidth();
      this.updateHeight();
    }
    #beeper;
    get svg() {
      return this.view.svg;
    }
    updateX() {
      this.view.updateX(PianoRollConverter.scaled(this.model.time.begin));
    }
    updateY() {
      this.view.updateY(PianoRollConverter.midi2NNBlackCoordinate(this.model.note));
    }
    updateWidth() {
      this.view.updateWidth(31 / 32 * PianoRollConverter.scaled(this.model.time.duration));
    }
    updateHeight() {
      this.view.updateHeight(black_key_height);
    }
    onWindowResized() {
      this.updateX();
      this.updateWidth();
    }
    setColor = (f) => this.view.setColor(f(this.model.archetype));
    onTimeRangeChanged = this.onWindowResized;
    beep() {
      this.#beeper.beepMelody();
    }
    onMelodyBeepCheckChanged(e) {
      this.#beeper.onMelodyBeepCheckChanged(e);
    }
    onMelodyVolumeBarChanged(e) {
      this.#beeper.onMelodyVolumeBarChanged(e);
    }
  };
  var MelodyLayer = class {
    constructor(svg, children, layer) {
      this.svg = svg;
      this.children = children;
      this.layer = layer;
      this.children_model = this.children.map((e) => e.model);
      this.#show = children;
    }
    children_model;
    #show;
    get show() {
      return this.#show;
    }
    beep() {
      this.children.forEach((e) => e.beep());
    }
    onAudioUpdate() {
      this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
    }
  };
  var MelodyHierarchy = class {
    constructor(svg, children) {
      this.svg = svg;
      this.children = children;
    }
    _show = [];
    get show() {
      return this._show;
    }
    onAudioUpdate() {
      this.show.forEach((e) => e.beep());
    }
    beep() {
      this.children.forEach((e) => e.beep());
    }
    setShow(visible_layers) {
      this._show = visible_layers;
      this._show.forEach((e) => e.onAudioUpdate());
      this.svg.replaceChildren(...this._show.map((e) => e.svg));
    }
    onChangedLayer(value) {
      const visible_layer = this.children.filter((e) => value === e.layer);
      this.setShow(visible_layer);
    }
  };
  function getMelodySVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.id = "melody-note";
    svg.style.stroke = "rgb(64, 64, 64)";
    svg.onclick = deleteMelody;
    return svg;
  }
  function getSVGG4(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildMelody(h_melodies, controllers) {
    const layers = h_melodies.map((e, l) => {
      const parts = e.map((e2) => {
        const model = new MelodyModel(e2);
        const svg3 = getMelodySVG();
        const view = new MelodyView(svg3);
        return new Melody(model, view);
      });
      const svg2 = getSVGG4(`layer-${l}`, parts);
      return new MelodyLayer(svg2, parts, l);
    });
    const svg = getSVGG4("melody", layers);
    const melody_hierarchy = new MelodyHierarchy(svg, layers);
    controllers.window.addListeners(...melody_hierarchy.children.flatMap((e) => e.children).map((e) => e.onWindowResized.bind(e)));
    controllers.hierarchy.addListeners(melody_hierarchy.onChangedLayer.bind(melody_hierarchy));
    controllers.time_range.addListeners(...melody_hierarchy.children.flatMap((e) => e.children).map((e) => e.onTimeRangeChanged.bind(e)));
    controllers.melody_color.addListeners(...melody_hierarchy.children.flatMap((e) => e.children).map((e) => e.setColor.bind(e)));
    controllers.melody_beep.checkbox.addListeners(...melody_hierarchy.children.flatMap((e) => e.children).map((e) => e.onMelodyBeepCheckChanged.bind(e)));
    controllers.melody_beep.volume.addListeners(...melody_hierarchy.children.flatMap((e) => e.children).map((e) => e.onMelodyVolumeBarChanged.bind(e)));
    controllers.audio.addListeners(...melody_hierarchy.children.map((e) => e.onAudioUpdate.bind(e)));
    controllers.audio.addListeners(...melody_hierarchy.show.map((e) => e.beep.bind(e)));
    melody_hierarchy.children.map((e) => e.onAudioUpdate());
    melody_hierarchy.show.map((e) => e.beep());
    return melody_hierarchy.svg;
  }
  var ReductionModel = class {
    constructor(e, layer) {
      this.layer = layer;
      this.time = e.time;
      this.head = e.head;
      this.archetype = e.melody_analysis.implication_realization;
    }
    time;
    head;
    archetype;
  };
  var ReductionViewModel = class {
    constructor(model) {
      this.model = model;
      this.#x = this.getViewX(this.model.time.begin);
      this.#w = this.getViewW(this.model.time.duration);
      this.#cw = this.getViewW(this.model.head.duration);
      this.#cx = this.getViewX(this.model.head.begin) + this.getViewW(this.model.head.duration) / 2;
      this.y = [this.model.layer].map((e) => e + 2).map((e) => PianoRollConverter.convertToCoordinate(e)).map((e) => e * bracket_height)[0];
      this.h = black_key_height * bracket_height;
      this.#strong = false;
      this.archetype = model.archetype;
    }
    #x;
    #w;
    #cx;
    #cw;
    #strong;
    y;
    h;
    get x() {
      return this.#x;
    }
    get w() {
      return this.#w;
    }
    get cx() {
      return this.#cx;
    }
    get cw() {
      return this.#cw;
    }
    get strong() {
      return this.#strong;
    }
    set strong(value) {
      this.#strong = value;
    }
    archetype;
    getViewX(x) {
      return PianoRollConverter.scaled(x);
    }
    getViewW(w) {
      return PianoRollConverter.scaled(w);
    }
    updateX() {
      this.#x = this.getViewX(this.model.time.begin);
      this.#cx = this.getViewX(this.model.head.begin) + this.getViewW(this.model.head.duration) / 2;
    }
    updateWidth() {
      this.#w = this.getViewW(this.model.time.duration);
      this.#cw = this.getViewW(this.model.head.duration);
    }
    onWindowResized() {
      this.updateWidth();
      this.updateX();
      return this;
    }
    onTimeRangeChanged = this.onWindowResized;
  };
  var IRMSymbol = class {
    constructor(svg) {
      this.svg = svg;
    }
    update(cx, y, w, h) {
      this.svg.setAttribute("x", String(cx));
      this.svg.setAttribute("y", String(y));
      this.svg.setAttribute("fontSize", `${Math.min(w / h, bracket_height)}em`);
    }
    onWindowResized(model) {
      this.update(model.cx, model.y, model.w, model.h);
    }
    setColor = (color) => this.svg.style.fill = color;
  };
  var Bracket = class {
    constructor(svg, model) {
      this.svg = svg;
      this.model = model;
    }
    model;
    updateStrong() {
      this.svg.style.strokeWidth = this.model.strong ? "3" : "1";
    }
    update(x, y, w, h) {
      const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
      const ctrl11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
      const ctrl12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
      const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
      const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
      const ctrl21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
      const ctrl22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
      const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
      this.svg.setAttribute(
        "d",
        `M${begin.x} ${begin.y}C${ctrl11.x} ${ctrl11.y} ${ctrl12.x} ${ctrl12.y} ${corner1.x} ${corner1.y}L${corner2.x} ${corner2.y}C${ctrl21.x} ${ctrl21.y} ${ctrl22.x} ${ctrl22.y} ${end.x} ${end.y}`
      );
    }
    onWindowResized(model) {
      this.update(model.x, model.y, model.w, model.h);
    }
  };
  var Dot = class {
    constructor(svg, model) {
      this.svg = svg;
      this.model = model;
    }
    updateStrong() {
      this.svg.style.r = String(this.model.strong ? 5 : 3);
    }
    update(cx, cy) {
      this.svg.setAttribute("cx", String(cx));
      this.svg.setAttribute("cy", String(cy));
    }
    onWindowResized(model) {
      this.update(model.cx, model.y - model.h);
    }
  };
  var ReductionView = class {
    constructor(svg, bracket, dot, ir_symbol, model) {
      this.svg = svg;
      this.bracket = bracket;
      this.dot = dot;
      this.ir_symbol = ir_symbol;
      this.model = model;
    }
    get strong() {
      return this.model.strong;
    }
    set strong(value) {
      this.model.strong = value;
      this.bracket.updateStrong();
      this.dot.updateStrong();
    }
    onTimeRangeChanged() {
      this.onWindowResized();
    }
    onWindowResized() {
      const model = this.model.onWindowResized();
      this.bracket.onWindowResized(model);
      this.dot.onWindowResized(model);
      this.ir_symbol.onWindowResized(model);
    }
    setColor = (color) => this.svg.style.fill = color;
  };
  var Reduction = class {
    constructor(model, view) {
      this.model = model;
      this.view = view;
    }
    get svg() {
      return this.view.svg;
    }
    setColor = (f) => this.view.setColor(f(this.model.archetype));
    renewStrong(strong) {
      this.view.strong = strong;
    }
    onTimeRangeChanged() {
      this.view.onTimeRangeChanged();
    }
    onWindowResized() {
      this.view.onWindowResized();
    }
  };
  var ReductionLayer = class {
    constructor(svg, children, layer) {
      this.svg = svg;
      this.children = children;
      this.layer = layer;
      this.children_model = this.children.map((e) => e.model);
      this.#show = children;
    }
    children_model;
    #show;
    get show() {
      return this.#show;
    }
    renewStrong(layer) {
      this.children.forEach((e) => e.renewStrong(layer === this.layer));
    }
    onAudioUpdate() {
      this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
    }
  };
  var ReductionHierarchy = class {
    constructor(svg, children) {
      this.svg = svg;
      this.children = children;
    }
    _show = [];
    get show() {
      return this._show;
    }
    setShow(visible_layers) {
      this._show = visible_layers;
      this._show.forEach((e) => e.onAudioUpdate());
      this.svg.replaceChildren(...this._show.map((e) => e.svg));
    }
    onChangedLayer(value) {
      const visible_layer = this.children.filter((e) => value >= e.layer);
      this.show.forEach((e) => e.renewStrong(value));
      visible_layer.forEach((e) => e.renewStrong(value));
      this.setShow(visible_layer);
    }
  };
  function getReductionSVG(bracket, dot, ir_symbol) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "time-span-node";
    svg.appendChild(bracket.svg);
    if (true) {
      svg.appendChild(dot.svg);
    }
    if (false) {
      svg.appendChild(ir_symbol.svg);
    }
    return svg;
  }
  function getIRMSymbolSVG(model) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svg.textContent = model.archetype.symbol;
    svg.id = "I-R Symbol";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${bracket_height}em`;
    svg.style.textAnchor = "middle";
    return svg;
  }
  function getBracketSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.id = "group";
    svg.style.stroke = "rgb(0, 0, 64)";
    svg.style.strokeWidth = String(3);
    svg.style.fill = "rgb(242, 242, 242)";
    return svg;
  }
  function getDotSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    svg.id = "head";
    svg.style.stroke = "rgb(192, 0, 0)";
    svg.style.fill = "rgb(192, 0, 0)";
    return svg;
  }
  function getSVGG5(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildReduction(h_melodies, controllers) {
    const layer = h_melodies.map((e, l) => {
      const parts = e.map((e2) => {
        const model = new ReductionModel(e2, l);
        const view_model = new ReductionViewModel(model);
        const bracket_svg = getBracketSVG();
        const bracket = new Bracket(bracket_svg, view_model);
        const dot_svg = getDotSVG();
        const dot = new Dot(dot_svg, view_model);
        const svg_irm_symbol = getIRMSymbolSVG(model);
        const ir_symbol = new IRMSymbol(svg_irm_symbol);
        const svg3 = getReductionSVG(bracket, dot, ir_symbol);
        const view = new ReductionView(svg3, bracket, dot, ir_symbol, view_model);
        return new Reduction(model, view);
      });
      const svg2 = getSVGG5(`layer-${l}`, parts);
      return new ReductionLayer(svg2, parts, l);
    });
    const svg = getSVGG5("time-span-reduction", layer);
    const time_span_tree = new ReductionHierarchy(svg, layer);
    controllers.window.addListeners(...time_span_tree.children.flatMap((e) => e.children).map((e) => e.onWindowResized.bind(e)));
    controllers.hierarchy.addListeners(time_span_tree.onChangedLayer.bind(time_span_tree));
    controllers.time_range.addListeners(...time_span_tree.children.flatMap((e) => e.children).map((e) => e.onTimeRangeChanged.bind(e)));
    controllers.melody_color.addListeners(...time_span_tree.children.flatMap((e) => e.children).map((e) => e.setColor.bind(e)));
    controllers.audio.addListeners(...time_span_tree.children.map((e) => e.onAudioUpdate.bind(e)));
    time_span_tree.children.map((e) => e.onAudioUpdate());
    return time_span_tree.svg;
  }
  var getGravityModel = (layer, e, next, gravity) => ({
    ...e,
    next,
    gravity,
    destination: gravity.destination,
    layer: layer || 0
  });
  var getLinePos = (x1, x2, y1, y2) => ({
    x1,
    x2,
    y1,
    y2
  });
  var scaled5 = (e) => (w, h) => getLinePos(
    e.x1 * w,
    e.x2 * w,
    e.y1 * h,
    e.y2 * h
  );
  var updateWidth_GravityView = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateHeight_GravityView = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var onWindowResized_GravityView = (triangle, line) => (line_pos) => {
    const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1) * 180 / Math.PI + 90;
    triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
    line.setAttribute("x1", String(line_pos.x1));
    line.setAttribute("x2", String(line_pos.x2));
    line.setAttribute("y1", String(line_pos.y1));
    line.setAttribute("y2", String(line_pos.y2));
  };
  var onWindowResized_Gravity = (svg) => (model) => (triangle, line, line_seed) => {
    updateWidth_GravityView(svg)(PianoRollConverter.scaled(model.time.duration));
    updateHeight_GravityView(svg)(black_key_height);
    onWindowResized_GravityView(triangle, line)(scaled5(line_seed)(NoteSize.get(), 1));
  };
  var onAudioUpdate2 = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  var onUpdateGravityVisibility_GravityHierarchy = (svg) => (visible) => {
    svg.style.visibility = visible ? "visible" : "hidden";
  };
  var onChangedLayer_GravityHierarchy = (svg, show, children) => (value) => {
    show = children.filter((e) => value === e.layer);
    show.forEach((e) => onAudioUpdate2(e.svg));
    svg.replaceChildren(...show.map((e) => e.svg));
  };
  function getTriangle() {
    const triangle_width2 = 4;
    const triangle_height2 = 5;
    const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle_svg.classList.add("triangle");
    triangle_svg.id = "gravity-arrow";
    triangle_svg.style.stroke = "rgb(0, 0, 0)";
    triangle_svg.style.fill = "rgb(0, 0, 0)";
    triangle_svg.style.strokeWidth = String(5);
    triangle_svg.setAttribute("points", [0, 0, -triangle_width2, +triangle_height2, +triangle_width2, +triangle_height2].join(","));
    return triangle_svg;
  }
  function getLine() {
    const line_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_svg.id = "gravity-arrow";
    line_svg.classList.add("line");
    line_svg.style.stroke = "rgb(0, 0, 0)";
    line_svg.style.strokeWidth = String(5);
    return line_svg;
  }
  function getGravitySVG(triangle, line) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "gravity";
    svg.appendChild(triangle);
    svg.appendChild(line);
    return svg;
  }
  function getLinePos2(e, n, g) {
    const convert = (arg) => [
      (e2) => PianoRollConverter.midi2BlackCoordinate(e2),
      (e2) => 0.5 + e2
    ].reduce((c, f) => f(c), arg);
    const line_pos = getLinePos(
      e.time.begin + e.time.duration / 2,
      n.time.begin,
      isNaN(e.note) ? -99 : convert(e.note),
      isNaN(e.note) ? -99 : convert(g.destination)
    );
    return line_pos;
  }
  function getSVGG6(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  var getLayers = (mode) => (melodies, layer) => {
    const next = melodies.slice(1);
    const children = next.map((n, i) => {
      const e = melodies[i];
      const g = e.melody_analysis[mode];
      if (!g) {
        return;
      }
      const line_seed = getLinePos2(e, n, g);
      const model = getGravityModel(layer, e, n, g);
      const triangle = getTriangle();
      const line = getLine();
      const svg2 = getGravitySVG(triangle, line);
      const view = { svg: svg2, triangle, line };
      return {
        model,
        view,
        line_seed,
        ...view
      };
    }).filter((e) => e !== void 0).map((e) => ({ ...e, ...e.view }));
    const svg = getSVGG6(`layer-${layer}`, children);
    return { layer, svg, children, show: children };
  };
  function buildGravity(mode, h_melodies, controllers) {
    const children = h_melodies.map(getLayers(mode));
    const svg = getSVGG6(mode, children);
    const gravity_hierarchy = { svg, children, show: children };
    switch (mode) {
      case "chord_gravity":
        controllers.gravity.chord_checkbox.addListeners(() => onUpdateGravityVisibility_GravityHierarchy(gravity_hierarchy.svg));
      case "scale_gravity":
        controllers.gravity.scale_checkbox.addListeners(() => onUpdateGravityVisibility_GravityHierarchy(gravity_hierarchy.svg));
      default:
        ;
    }
    controllers.hierarchy.addListeners(onChangedLayer_GravityHierarchy(gravity_hierarchy.svg, gravity_hierarchy.show, gravity_hierarchy.children));
    controllers.window.addListeners(...gravity_hierarchy.children.flatMap((e) => e.children).map((e) => () => onWindowResized_Gravity(e.svg)(e.model)(e.triangle, e.line, e.line_seed)));
    controllers.time_range.addListeners(...gravity_hierarchy.children.flatMap((e) => e.children).map((e) => () => onWindowResized_Gravity(e.svg)(e.model)(e.triangle, e.line, e.line_seed)));
    controllers.audio.addListeners(...gravity_hierarchy.children.map((e) => () => onAudioUpdate2(e.svg)));
    gravity_hierarchy.children.map((e) => onAudioUpdate2(e.svg));
    return gravity_hierarchy.svg;
  }
  function getLinePos3(e, n) {
    const convert = (arg) => [
      (e2) => e2 - 0.5,
      (e2) => PianoRollConverter.midi2BlackCoordinate(e2)
    ].reduce((c, f) => f(c), arg);
    const line_pos = {
      x1: e.time.begin + e.time.duration / 2,
      x2: n.time.begin + n.time.duration / 2,
      y1: isNaN(e.note) ? -99 : convert(e.note),
      y2: isNaN(n.note) ? -99 : convert(n.note)
    };
    return line_pos;
  }
  var triangle_width = 10;
  var triangle_height = 10;
  function getTriangle2() {
    const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle_svg.classList.add("triangle");
    triangle_svg.id = "gravity-arrow";
    triangle_svg.style.stroke = "rgb(0, 0, 0)";
    triangle_svg.style.fill = "rgb(0, 0, 0)";
    triangle_svg.style.strokeWidth = String(0);
    triangle_svg.setAttribute("points", [0, 0, -triangle_width, +triangle_height, +triangle_width, +triangle_height].join(","));
    return triangle_svg;
  }
  function getLine2() {
    const line_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_svg.id = "gravity-arrow";
    line_svg.classList.add("line");
    line_svg.style.stroke = "rgb(0, 0, 0)";
    line_svg.style.strokeWidth = String(5);
    return line_svg;
  }
  function getGravitySVG2(...children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "gravity";
    children.forEach((e) => svg.appendChild(e));
    return svg;
  }
  function getSVGG7(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e));
    return svg;
  }
  var getArchetypeColor = (archetype) => {
    switch (archetype.symbol) {
      case "(P)":
      case "P":
        return "rgba(0,0,255,1)";
      case "(IP)":
      case "IP":
        return "rgba(170,0,255,1)";
      case "(VP)":
      case "VP":
        return "rgba(0,170,255,1)";
      case "(R)":
      case "R":
        return "rgba(255,0,0,1)";
      case "(IR)":
      case "IR":
        return "rgba(255,170,0,1)";
      case "(VR)":
      case "VR":
        return "rgba(255,0,170,1)";
      case "(D)":
      case "D":
        return "rgba(0,255,0,1)";
      case "(ID)":
      case "ID":
        return "rgba(0,255,170,1)";
      default:
        "rgba(0,0,0,.25)";
    }
  };
  var getRange2 = (inf, sup, over, sgn) => ({ inf, sup, over, sgn });
  var m3 = 3;
  var getDestination = (observation) => {
    const s = Math.sign(observation);
    const O = Math.abs(observation);
    const L = O - m3;
    const G = O + m3;
    return O < 6 ? getRange2(s * L, s * G, s * G, 1) : getRange2(s * 0, s * L, s * G, -1);
  };
  var getImplicationArrow = (layer) => (delayed_melody) => (_, i) => {
    const first = delayed_melody[0][i];
    const second = delayed_melody[1][i];
    const third = delayed_melody[2][i];
    const implication = getDestination(second.note - first.note);
    const line_pos = getLinePos3(
      { time: second.time, note: second.note },
      { time: third.time, note: second.note + (implication.inf + implication.sup) / 2 }
    );
    const model = {
      ...second,
      archetype: second.melody_analysis.implication_realization,
      layer: layer || 0
    };
    const triangle = getTriangle2();
    const line = getLine2();
    const a = isB(second.note - first.note, third.note - second.note) ? 1 : 0.25;
    triangle.style.stroke = isP(first.note, second.note) ? `rgba(0,0,255,${a})` : `rgba(255,0,0,${a})`;
    triangle.style.fill = isP(first.note, second.note) ? `rgba(0,0,255,${a})` : `rgba(255,0,0,${a})`;
    line.style.stroke = isP(first.note, second.note) ? `rgba(0,0,255,${a})` : `rgba(255,0,0,${a})`;
    const svg = getGravitySVG2(triangle, line);
    const view = { svg, triangle, line };
    return { model, view, line_pos };
  };
  var eqv = (a, b) => !(a || b) || a && b;
  var isV = (observed, realization) => {
    const I = Math.abs(observed);
    const R = Math.abs(realization);
    return I + m3 <= R;
  };
  var isB = (observed, realization) => {
    const I = Math.abs(observed);
    const R = Math.abs(realization);
    if (I + m3 <= R) {
      return false;
    }
    return eqv(I - m3 < R && R < I + m3, Math.sign(observed) === Math.sign(realization));
  };
  var isP = (observed, realization) => {
    const I = Math.abs(observed);
    const R = Math.abs(realization);
    return I + m3 <= R ? Math.sign(observed) === Math.sign(realization) : I - m3 < R;
  };
  var getReImplicationArrow = (layer) => (delayed_melody) => (_, i) => {
    const first = delayed_melody[0][i];
    const second = delayed_melody[1][i];
    const third = delayed_melody[2][i];
    const fourth = delayed_melody[3][i];
    const implication = getDestination(second.note - first.note);
    if (isB(second.note - first.note, third.note - second.note)) {
      return;
    }
    const is_V = isV(second.note - first.note, third.note - second.note);
    const IImplication = third?.note + (implication.inf + implication.sup) / 2;
    const VImplication = third?.note - (implication.inf + implication.sup) / 2;
    const line_pos = fourth && getLinePos3(
      { time: third.time, note: third.note },
      { time: fourth.time, note: is_V ? VImplication : IImplication }
    );
    const model = {
      ...second,
      archetype: second.melody_analysis.implication_realization,
      layer: layer || 0
    };
    const triangle = getTriangle2();
    const line = getLine2();
    triangle.style.stroke = getArchetypeColor(model.archetype) || "rgba(0,0,0,.25)";
    triangle.style.fill = getArchetypeColor(model.archetype) || "rgba(0,0,0,.25)";
    line.style.stroke = getArchetypeColor(model.archetype) || "rgba(0,0,0,.25)";
    const svg = getGravitySVG2(triangle, line);
    const view = { svg, triangle, line };
    return { model, view, line_pos };
  };
  var getLayers2 = (melodies, layer) => {
    const delayed_melody = melodies.map((_, i) => melodies.slice(i));
    if (delayed_melody.length <= 3) {
      return;
    }
    const gravity = [
      delayed_melody[2].map(getImplicationArrow(layer)(delayed_melody)),
      delayed_melody[3].map(getReImplicationArrow(layer)(delayed_melody))
    ].flat().filter((e) => e !== void 0).map((e) => ({ svg: e.view.svg, model: e.model, view: e.view, line_seed: e.line_pos }));
    const svg = getSVGG7(`layer-${layer}`, gravity.map((e) => e.svg));
    return {
      layer,
      svg,
      children: gravity,
      show: gravity
    };
  };
  var onWindowResized_IRGravity = (e) => {
    e.svg.setAttribute("width", String(PianoRollConverter.scaled(e.model.time.duration)));
    e.svg.setAttribute("height", String(black_key_height));
    const line_pos = { x1: e.line_seed.x1 * NoteSize.get(), x2: e.line_seed.x2 * NoteSize.get(), y1: e.line_seed.y1 * 1, y2: e.line_seed.y2 * 1 };
    const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1);
    const marginX = triangle_height * Math.cos(angle);
    const marginY = triangle_height * Math.sin(angle);
    e.view.triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle * 180 / Math.PI + 90})`);
    e.view.line.setAttribute("x1", String(line_pos.x1));
    e.view.line.setAttribute("y1", String(line_pos.y1));
    e.view.line.setAttribute("x2", String(line_pos.x2 - marginX));
    e.view.line.setAttribute("y2", String(line_pos.y2 - marginY));
  };
  var onAudioUpdate3 = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  var onChangedLayer = (ir_gravity) => (value) => {
    ir_gravity.show = ir_gravity.children.filter((e) => value === e.layer);
    ir_gravity.show.forEach((e) => onAudioUpdate3(e.svg));
    ir_gravity.svg.replaceChildren(...ir_gravity.show.map((e) => e.svg));
  };
  function buildIRGravity(h_melodies, controllers) {
    const children = h_melodies.map(getLayers2).filter((e) => e !== void 0);
    const svg = getSVGG7("ir_gravity", children.map((e) => e.svg));
    const ir_gravity = { svg, children, show: [] };
    controllers.window.addListeners(...ir_gravity.children.flatMap((e) => e.children).map((e) => () => onWindowResized_IRGravity(e)));
    controllers.time_range.addListeners(...ir_gravity.children.flatMap((e) => e.children).map((e) => () => onWindowResized_IRGravity(e)));
    controllers.hierarchy.addListeners(onChangedLayer(ir_gravity));
    controllers.melody_color.addListeners(...ir_gravity.children.flatMap((e) => e.children).map((e) => (f) => e.svg.style.fill = f(e.model.archetype)));
    controllers.audio.addListeners(...ir_gravity.children.map((e) => () => onAudioUpdate3(e.svg)));
    ir_gravity.children.map((e) => onAudioUpdate3(e.svg));
    return ir_gravity.svg;
  }
  var MelodyElements = class {
    children;
    d_melody_collection;
    melody_hierarchy;
    ir_hierarchy;
    ir_plot_svg;
    ir_gravity;
    chord_gravities;
    scale_gravities;
    time_span_tree;
    constructor(hierarchical_melody, d_melodies, controllers) {
      this.d_melody_collection = buildDMelody(d_melodies, controllers);
      this.melody_hierarchy = buildMelody(hierarchical_melody, controllers);
      this.ir_hierarchy = buildIRSymbol(hierarchical_melody, controllers);
      this.ir_plot_svg = buildIRPlot(hierarchical_melody, controllers);
      this.ir_gravity = buildIRGravity(hierarchical_melody, controllers);
      this.chord_gravities = buildGravity("chord_gravity", hierarchical_melody, controllers);
      this.scale_gravities = buildGravity("scale_gravity", hierarchical_melody, controllers);
      this.time_span_tree = buildReduction(hierarchical_melody, controllers);
      this.children = [
        this.d_melody_collection,
        this.melody_hierarchy,
        this.ir_hierarchy,
        this.ir_plot_svg,
        this.chord_gravities,
        this.scale_gravities,
        this.time_span_tree
      ];
    }
  };

  // ../../packages/UI/piano-roll/piano-roll/dist/index.mjs
  var MusicStructureElements = class {
    beat;
    chord;
    melody;
    constructor(beat_info, romans, hierarchical_melody, melodies, d_melodies, controllers) {
      this.beat = new BeatElements(beat_info, melodies, controllers);
      this.chord = new ChordElements(romans, controllers);
      this.melody = new MelodyElements(hierarchical_melody, d_melodies, controllers);
    }
  };
  var AnalysisView = class {
    svg;
    constructor(analysis) {
      const { beat, chord, melody } = analysis;
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      this.svg.appendChild(chord.chord_notes);
      this.svg.appendChild(chord.chord_names);
      this.svg.appendChild(chord.chord_romans);
      this.svg.appendChild(chord.chord_keys);
      this.svg.appendChild(melody.d_melody_collection);
      this.svg.appendChild(melody.melody_hierarchy);
      this.svg.appendChild(melody.ir_hierarchy);
      this.svg.appendChild(melody.ir_gravity);
      this.svg.appendChild(melody.chord_gravities);
      this.svg.appendChild(melody.scale_gravities);
      this.svg.appendChild(melody.time_span_tree);
    }
  };
  var CurrentTimeLine = class {
    svg;
    constructor(visible, window_registry) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
      this.svg.id = "current_time";
      this.svg.style.strokeWidth = String(5);
      this.svg.style.stroke = "rgb(0, 0, 0)";
      this.svg.style.visibility = visible ? "visible" : "hidden";
      window_registry.addListeners(this.onWindowResized.bind(this));
    }
    onWindowResized() {
      this.svg.setAttribute("x1", `${CurrentTimeX.get()}`);
      this.svg.setAttribute("x2", `${CurrentTimeX.get()}`);
      this.svg.setAttribute("y1", "0");
      this.svg.setAttribute("y2", `${PianoRollHeight.get()}`);
    }
  };
  var RectangleView = class {
    constructor(svg) {
      this.svg = svg;
    }
    setX(x) {
      this.svg.setAttribute("x", String(x));
    }
    setY(y) {
      this.svg.setAttribute("y", String(y));
    }
    setW(w) {
      this.svg.setAttribute("width", String(w));
    }
    setH(h) {
      this.svg.setAttribute("height", String(h));
    }
  };
  var RectangleModel = class {
    constructor(y, w, h) {
      this.y = y;
      this.w = w;
      this.h = h;
    }
    get x() {
      return 0;
    }
  };
  var Rectangle = class {
    constructor(model, view) {
      this.model = model;
      this.view = view;
    }
    get svg() {
      return this.view.svg;
    }
  };
  var bg_height = octave_height / 12;
  var BG = class extends Rectangle {
    constructor(svg, i) {
      const y = PianoRollConverter.midi2BlackCoordinate(i);
      super(
        new RectangleModel(
          y,
          1,
          bg_height
        ),
        new RectangleView(svg)
      );
    }
    onWindowResized() {
      this.view.setX(this.model.x);
      this.view.setY(this.model.y);
      this.view.setW(PianoRollWidth.get());
      this.view.setH(this.model.h);
    }
  };
  var isBlack = (i) => mod(i * 5 - 2, 12) < 5;
  var BGs = class {
    svg;
    children;
    constructor(publisher) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg.id = `BGs`;
      const children = getRange(
        PianoRollBegin.get(),
        PianoRollEnd.get(),
        PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1
      ).map((i) => {
        const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svg2.id = `BG-${i}`;
        svg2.style.fill = isBlack(i) ? "rgb(192, 192, 192)" : "rgb(242, 242, 242)";
        svg2.style.stroke = "rgb(0, 0, 0)";
        return new BG(svg2, i);
      });
      children.forEach((e) => svg.appendChild(e.svg));
      this.svg = svg;
      this.children = children;
      publisher.addListeners(this.onWindowResized.bind(this));
    }
    onWindowResized() {
      this.children.forEach((e) => e.onWindowResized());
    }
  };
  var key_width = 36;
  var black_key_width = key_width * 2 / 3;
  var white_key_width = key_width;
  var white_key_height = octave_height / 7;
  var Key = class extends Rectangle {
    isBlack;
    constructor(svg, i) {
      const y = isBlack(i) ? PianoRollConverter.midi2BlackCoordinate(i) : [i].map((e) => PianoRollConverter.transposed(e)).map((e) => e + 1).map((e) => PianoRollConverter.convertToCoordinate(e)).map((e) => e + white_key_height).map((e) => e - mod(i, 12) * 2).map((e) => e + (mod(i, 12) > 4 ? 12 : 0)).map((e) => -e)[0];
      super(
        new RectangleModel(
          y,
          isBlack(i) ? black_key_width : white_key_width,
          isBlack(i) ? black_key_height : white_key_height
        ),
        new RectangleView(svg)
      );
      this.isBlack = isBlack(i);
    }
  };
  var Keys = class {
    svg;
    children;
    constructor() {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      this.svg.id = "keys";
      const sgn = PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1;
      const keys = getRange(
        PianoRollBegin.get() - sgn,
        PianoRollEnd.get() + sgn * 2,
        sgn
      ).map((i) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svg.id = `key-${i}`;
        svg.style.fill = isBlack(i) ? "rgb(64, 64, 64)" : "rgb(255, 255, 255)";
        svg.style.stroke = "rgb(0, 0, 0)";
        return new Key(svg, i);
      });
      this.children = [
        keys.filter((e) => !e.isBlack),
        keys.filter((e) => e.isBlack)
      ].flat();
      this.children.forEach((e) => this.svg.appendChild(e.svg));
    }
  };
  var appendChildren = (svg) => (...children) => {
    children.forEach((e) => svg.appendChild(e));
  };
  var onWindowResized3 = (svg) => () => {
    svg.setAttribute("x", String(0));
    svg.setAttribute("y", String(0));
    svg.setAttribute("width", String(PianoRollWidth.get()));
    svg.setAttribute("height", String(PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin));
  };
  var PianoRoll = class {
    svg;
    constructor(analyzed, window2, show_current_time_line) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "piano-roll";
      appendChildren(svg)(
        new BGs(window2).svg,
        new AnalysisView(analyzed).svg,
        new Keys().svg,
        new CurrentTimeLine(show_current_time_line, window2).svg
      );
      window2.addListeners(onWindowResized3(svg));
      this.svg = svg;
    }
  };

  // ../../packages/cognitive-theory-of-music/irm/dist/index.mjs
  var Dyad = class {
    length = 2;
    symbol = "Dyad";
    notes;
    intervals;
    constructor(prev, curr) {
      this.notes = [prev, curr];
      this.intervals = [distance4(prev, curr)];
    }
  };
  var Monad = class {
    length = 1;
    symbol = "M";
    notes;
    constructor(note4) {
      this.notes = [note4];
    }
  };
  var Null_ad = class {
    length = 0;
    symbol = "";
    notes = [];
    constructor() {
    }
  };
  var retrospectiveSymbol = (symbol) => {
    switch (symbol) {
      case "P":
        return "(P)";
      case "IP":
        return "(IP)";
      case "VP":
        return "(VP)";
      case "R":
        return "(R)";
      case "IR":
        return "(IR)";
      case "VR":
        return "(VR)";
      case "D":
        return "(D)";
      case "ID":
        return "(ID)";
      default:
        throw new Error(`Illegal symbol given.
Expected symbol: P, IP, VP, R, IR, VR, D, ID
 Given symbol:${symbol}`);
    }
  };
  var RegistralReturnForm = class {
    is_null;
    return_degree;
    constructor(notes) {
      this.is_null = true;
      if (notes.length !== 3) {
        throw new Error(`Invalid argument length. Required 3 arguments but given was ${notes.length} notes: ${JSON.stringify(notes)}`);
      }
      if (get6(notes[0]) === get6("")) {
        this.return_degree = "";
        return;
      }
      this.return_degree = distance4(notes[0], notes[2]);
      const dir1 = Math.sign(
        semitones(distance4(notes[0], notes[1]))
      );
      const dir2 = Math.sign(
        semitones(distance4(notes[1], notes[2]))
      );
      this.is_null = dir1 === dir2;
    }
  };
  var NULL_REGISTRAL_RETURN_FORM = new RegistralReturnForm(["", "", ""]);
  var Motion = class {
    direction;
    magnitude;
    closure;
    constructor(dir, mgn) {
      this.direction = dir;
      this.magnitude = mgn;
      this.closure = dir.name === "mL" && mgn.name === "AB" ? 1 : 0;
    }
  };
  var Direction = class {
    constructor(name, value) {
      this.name = name;
      this.value = value;
      if (name === "mL") {
        this.closure_degree = 1;
      }
      if (name === "mN") {
        this.closure_degree = 0;
      }
      if (name === "mR") {
        this.closure_degree = -1;
      }
    }
    closure_degree;
  };
  var Magnitude = class {
    constructor(name, value) {
      this.name = name;
      this.value = value;
      if (name === "AA") {
        this.closure_degree = 1;
      }
      if (name === "AB") {
        this.closure_degree = 2;
      }
    }
    closure_degree;
  };
  var M3 = get5("M3");
  var m32 = get5("m3");
  var _sgn = (x) => x < 0 ? -1 : x && 1;
  var _abs = (x) => x < 0 ? -x : x;
  var IntervallicMotion = class extends Motion {
    constructor(prev, curr) {
      const dir_map = ["mL", "mN", "mR"];
      const pd = _sgn(prev.semitones);
      const cd = _sgn(curr.semitones);
      const C = (cd - pd ? m32 : M3).semitones;
      const p = _abs(prev.semitones);
      const c = _abs(curr.semitones);
      const d = c - p;
      const sgn = d < 0 ? -1 : d && 1;
      const abs = d < 0 ? -d : d;
      super(
        new Direction(dir_map[sgn + 1], sgn),
        new Magnitude(abs < C ? "AA" : "AB", abs)
      );
    }
  };
  var _sgn2 = (x) => x < 0 ? -1 : x && 1;
  var RegistralMotion = class extends Motion {
    constructor(prev, curr) {
      const dir_map = ["mL", "mN", "mR"];
      const mgn_map = ["AB", "AA", "AA"];
      const p = _sgn2(prev.semitones);
      const c = _sgn2(curr.semitones);
      const d = c - p;
      const sgn = d ? -1 : p && 1;
      const abs = d ? -1 : p && 1;
      super(
        new Direction(dir_map[sgn + 1], sgn),
        new Magnitude(mgn_map[abs + 1], abs)
      );
    }
  };
  var getReverse = (I, V) => {
    if (I !== "mL") {
      return "VR";
    } else if (V !== "mL") {
      return "IR";
    } else {
      return "R";
    }
  };
  var getDuplication = (V) => {
    if (V !== "mN") {
      return "ID";
    } else {
      return "D";
    }
  };
  var getProcessLike = (I, V) => {
    if (V === "mR") {
      return "P";
    } else if (I === "mN") {
      return getDuplication(V);
    } else {
      return "IP";
    }
  };
  var getTriadArchetypeSymbol = (Id, Im, V) => {
    if (Im === "AA") {
      return getProcessLike(Id, V);
    } else if (V === "mL") {
      return getReverse(Id, V);
    } else if (Id === "mL") {
      return "IR";
    } else {
      return "VP";
    }
  };
  var TriadArchetype = class {
    symbol;
    notes;
    intervals;
    registral;
    intervallic;
    registral_return_form;
    constructor(prev, curr, next) {
      this.notes = [prev || "", curr || "", next || ""];
      this.intervals = [distance4(prev, curr), distance4(curr, next)];
      const initial = get5(this.intervals[0]);
      const follow = get5(this.intervals[1]);
      this.registral = new RegistralMotion(initial, follow);
      this.intervallic = new IntervallicMotion(initial, follow);
      this.registral_return_form = new RegistralReturnForm(this.notes);
      this.symbol = getTriadArchetypeSymbol(
        this.intervallic.direction.name,
        this.intervallic.magnitude.name,
        this.registral.direction.name
      );
    }
  };
  var isRetrospective = (archetype) => {
    const initial = get5(archetype.intervals[0]);
    const init_mgn = Math.abs(initial.num) < 5 ? "aa" : "ab";
    switch (archetype.symbol) {
      case "R":
      case "IR":
      case "VR":
        return init_mgn === "aa";
      default:
        return init_mgn === "ab";
    }
  };
  var getTriad = (prev, curr, next) => {
    const archetype = new TriadArchetype(prev, curr, next);
    const { intervals, registral, intervallic, registral_return_form } = archetype;
    const retrospective = isRetrospective(archetype);
    return {
      notes: [prev || "", curr || "", next || ""],
      archetype,
      intervals,
      registral,
      intervallic,
      registral_return_form,
      retrospective,
      symbol: retrospective ? retrospectiveSymbol(archetype.symbol) : archetype.symbol
    };
  };
  var get_grb_on_parametric_scale = (archetype) => {
    const s = archetype.intervallic?.direction.name === "mL" ? -1 : 0;
    const v3 = archetype.intervallic?.direction.name === "mR" ? -1 : 0;
    const scale2 = archetype.intervallic?.magnitude.name === "AA" ? 0.25 : 0.5;
    const B = 120;
    switch (archetype.registral?.direction.name) {
      case "mL":
        return hsv2rgb(-120 + B, 1 + s * scale2, 1 + v3 * scale2);
      case "mN":
        return hsv2rgb(0 + B, 1 + s * scale2, 1 + v3 * scale2);
      case "mR":
        return hsv2rgb(120 + B, 1 + s * scale2, 1 + v3 * scale2);
    }
    return [64, 64, 64];
  };
  function get_color_on_parametric_scale(archetype) {
    if (archetype instanceof Dyad || archetype instanceof Monad || archetype instanceof Null_ad) {
      return "rgb(64,64,64)";
    }
    return rgbToString(get_grb_on_parametric_scale(archetype));
  }
  var get_color_on_digital_intervallic_scale = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 0, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 255, 0)";
      case "D":
      case "(D)":
        return "rgb(0, 255, 0)";
      case "IR":
      case "(IR)":
        return "rgb(255, 0, 0)";
      case "VR":
      case "(VR)":
        return "rgb(0, 0, 255)";
      case "IP":
      case "(IP)":
        return "rgb(0, 255, 0)";
      case "ID":
      case "(ID)":
        return "rgb(0, 255, 0)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_color_on_digital_parametric_scale = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 160, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 0, 255)";
      case "D":
      case "(D)":
        return "rgb(0, 0, 255)";
      case "IR":
      case "(IR)":
        return "rgb(160, 0, 255)";
      case "VR":
      case "(VR)":
        return "rgb(0, 224, 0)";
      case "IP":
      case "(IP)":
        return "rgb(255, 160, 0)";
      case "ID":
      case "(ID)":
        return "rgb(255, 160, 0)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_color_of_implication_realization = (archetype) => {
    switch (archetype.symbol) {
      case "D":
        return "rgb(0,240,0)";
      case "ID":
        return "rgb(0, 0, 255)";
      case "VP":
        return "rgb(255, 0, 0)";
      case "P":
        return "rgb(0,240,0)";
      case "IP":
        return "rgb(0, 0, 255)";
      case "VR":
        return "rgb(255, 0, 0)";
      case "R":
        return "rgb(0,240,0)";
      case "IR":
        return "rgb(0, 0, 255)";
      case "(D)":
        return "rgb(0, 0, 0)";
      case "(ID)":
        return "rgb(255, 0, 0)";
      case "(VP)":
        return "rgb(0, 0, 0)";
      case "(P)":
        return "rgb(0, 0, 0)";
      case "(IP)":
        return "rgb(255, 0, 0)";
      case "(VR)":
        return "rgb(0, 0, 0)";
      case "(R)":
        return "rgb(0, 0, 0)";
      case "(IR)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_rgb_on_intervallic_angle = (n0, n1, n2) => {
    const intervals = [
      distance4(n0, n1),
      distance4(n1, n2)
    ].map((e) => get5(e).semitones);
    const dist = ((p) => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals) || 0;
    const angle = Math.atan2(intervals[1], intervals[0]) || 0;
    return hsv2rgb(angle * 360 / Math.PI, 1, dist);
  };
  var _get_color_on_intervallic_angle = (n0, n1, n2) => rgbToString(
    get_rgb_on_intervallic_angle(n0 || "", n1 || "", n2 || "")
  );
  var get_color_on_intervallic_angle = (archetype) => _get_color_on_intervallic_angle(archetype.notes[0], archetype.notes[1], archetype.notes[2]);
  var get_color_of_Narmour_concept = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 160, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 0, 255)";
      case "IP":
      case "(IP)":
        return "rgb(160, 0, 255)";
      case "VR":
      case "(VR)":
        return "rgb(255, 0, 160)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      case "IR":
      case "(IR)":
        return "rgb(255, 160, 0)";
      case "D":
      case "(D)":
        return "rgb(0, 242, 0)";
      case "ID":
      case "(ID)":
        return "rgb(0, 255, 160)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_color_on_registral_scale = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 0, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 0, 255)";
      case "D":
      case "(D)":
        return "rgb(0, 0, 255)";
      case "IR":
      case "(IR)":
        return "rgb(0, 0, 255)";
      case "VR":
      case "(VR)":
        return "rgb(255, 0, 0)";
      case "IP":
      case "(IP)":
        return "rgb(255, 0, 0)";
      case "ID":
      case "(ID)":
        return "rgb(255, 0, 0)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };

  // ../../packages/music-structure/melody/melody-analyze/dist/index.mjs
  var registerGravity = (pitch_class_set, curr, next) => {
    if (!pitch_class_set) {
      return void 0;
    }
    const name = pitch_class_set.name;
    const tonic = get6(pitch_class_set.tonic || "").chroma;
    if (curr === void 0) {
      return void 0;
    }
    const chroma3 = mod(curr - tonic - (name.includes("major") ? 0 : 3), 12);
    const destination = chroma3 === 11 ? curr + 1 : chroma3 === 5 ? curr - 1 : void 0;
    if (destination === void 0) {
      return void 0;
    }
    return new Gravity(
      destination,
      destination && next === destination || void 0
    );
  };
  var getSome_ad = (prev, curr, next) => {
    const [p, c, n] = [prev, curr, next].map((e) => e ? fromMidi(e) : void 0);
    if (c !== void 0) {
      if (p !== void 0) {
        if (n !== void 0) {
          return getTriad(p, c, n);
        } else {
          return new Dyad(p, c);
        }
      } else if (n !== void 0) {
        return new Dyad(c, n);
      } else {
        return new Monad(c);
      }
    } else if (p !== void 0) {
      return new Monad(p);
    } else if (n !== void 0) {
      return new Monad(n);
    } else {
      return new Null_ad();
    }
  };
  var analyzeMelody = (melodies, romans) => {
    const prev = [void 0, ...melodies];
    const curr = [...melodies];
    const next = [...melodies.slice(1), void 0];
    return curr.map((e, i) => {
      const roman = romans.find((roman2) => roman2.time.begin <= e.time.end && e.time.begin < roman2.time.end);
      const time_and_melody = new TimeAndMelody(
        e.time,
        e.head,
        e.note
      );
      const melody_analysis = new SerializedMelodyAnalysis(
        registerGravity(roman && get8(roman.scale), prev[i]?.note, curr[i]?.note),
        registerGravity(roman && get4(roman.chord), prev[i]?.note, curr[i]?.note),
        getSome_ad(prev[i]?.note, curr[i]?.note, next[i]?.note)
      );
      return new SerializedTimeAndAnalyzedMelody(
        time_and_melody.time,
        time_and_melody.head,
        time_and_melody.note,
        melody_analysis
      );
    }).filter((e) => isNaN(0 * e.note) === false);
  };
  var getArgsOfGravity = (args) => {
    if (args.length === 1) {
      const [e] = args;
      return [e.destination, e.resolved];
    }
    return args;
  };
  var Gravity = class {
    destination;
    resolved;
    constructor(...args) {
      const [destination, resolved] = getArgsOfGravity(args);
      this.destination = destination;
      this.resolved = resolved;
    }
  };
  var getArgsOfMelodyAnalysis = (args) => {
    if (args.length === 1) {
      const [e] = args;
      return [
        e.scale_gravity && new Gravity(e.scale_gravity),
        e.chord_gravity && new Gravity(e.chord_gravity),
        e.implication_realization
      ];
    }
    return args;
  };
  var SerializedMelodyAnalysis = class {
    chord_gravity;
    scale_gravity;
    implication_realization;
    constructor(...args) {
      const [scale_gravity, chord_gravity, implication_realization] = getArgsOfMelodyAnalysis(args);
      this.scale_gravity = scale_gravity;
      this.chord_gravity = chord_gravity;
      this.implication_realization = implication_realization;
    }
  };
  var v = "25.03.10.08.51";
  var SerializedMelodyAnalysisData = class _SerializedMelodyAnalysisData {
    constructor(body) {
      this.body = body;
    }
    version = v;
    static checkVersion(e) {
      return e.version === v;
    }
    static instantiate(e) {
      return new _SerializedMelodyAnalysisData(e.body.map((e2) => new SerializedTimeAndAnalyzedMelody(e2)));
    }
  };
  var getArgsOfSerializedTimeAndAnalyzedMelody = (args) => {
    if (args.length === 1) {
      const [e] = args;
      return [new Time(e.time), new Time(e.head), e.note, new SerializedMelodyAnalysis(e.melody_analysis)];
    }
    return args;
  };
  var SerializedTimeAndAnalyzedMelody = class {
    time;
    head;
    note;
    melody_analysis;
    constructor(...args) {
      const [time, head, note4, melody_analysis] = getArgsOfSerializedTimeAndAnalyzedMelody(args);
      this.time = time;
      this.head = head;
      this.note = note4;
      this.melody_analysis = melody_analysis;
    }
  };
  var getArgsOfTimeAndMelody = (args) => {
    if (args.length === 1) {
      const [e] = args;
      return [
        new Time(e.time),
        new Time(e.head),
        e.note
      ];
    }
    return args;
  };
  var TimeAndMelody = class {
    time;
    head;
    note;
    constructor(...args) {
      const [time, head, note4] = getArgsOfTimeAndMelody(args);
      this.time = time;
      this.head = head;
      this.note = note4;
    }
  };

  // ../../packages/music-structure/melody/melody-hierarchical-analysis/dist/index.mjs
  var getTime = (matrix, left, right) => new Time(
    matrix[left.measure][left.note].leftend,
    matrix[right.measure][right.note].rightend
  );
  var calcChroma = (pitch2) => 12 + pitch2.octave * 12 + (pitch2.alter || 0) + chroma(pitch2.step);
  var getTimeAndMelody = (element, matrix, musicxml) => {
    const leftend = element.getLeftEnd();
    const rightend = element.getRightEnd();
    const note4 = musicxml["score-partwise"].part.measure.find((e) => e.number === element.measure).note;
    const pitch2 = Array.isArray(note4) ? note4[element.note - 1].pitch : note4.pitch;
    return new TimeAndMelody(
      getTime(matrix, leftend, rightend),
      getTime(matrix, element, element),
      pitch2 ? calcChroma(pitch2) : NaN
    );
  };
  var SerializedTimeAndAnalyzedMelodyAndIR = class extends SerializedTimeAndAnalyzedMelody {
    constructor(e, IR) {
      super(e.time, e.head, e.note, e.melody_analysis);
      this.IR = IR;
    }
  };
  var appendIR = (e) => {
    return new SerializedTimeAndAnalyzedMelodyAndIR(
      e,
      e.melody_analysis.implication_realization.symbol
    );
  };
  var analyzeAndScaleMelody = (measure, matrix, musicxml) => (element) => {
    const w = measure / 8;
    const b = 0;
    const e = getTimeAndMelody(element, matrix, musicxml);
    const time = e.time.map((e2) => e2 * w + b);
    const head = e.head.map((e2) => e2 * w + b);
    return new TimeAndMelody(
      time,
      head,
      e.note
    );
  };
  var getMapOntToHierarchicalMelodyFromLayer = (measure, reduction, matrix, musicxml, roman) => (_, layer) => {
    const melodies = reduction.getArrayOfLayer(layer).map(analyzeAndScaleMelody(measure, matrix, musicxml));
    return analyzeMelody(melodies, roman).map((e) => appendIR(e));
  };
  var getHierarchicalMelody = (measure, reduction, matrix, musicxml, roman) => {
    return [...Array(reduction.getDepthCount())].map(getMapOntToHierarchicalMelodyFromLayer(measure, reduction, matrix, musicxml, roman));
  };

  // ../../packages/cognitive-theory-of-music/tonal-pitch-space/dist/index.mjs
  var c_minor = minorKey("C").natural;

  // ../../packages/music-structure/chord/chord-analyze/dist/index.mjs
  var getArgsOfSerializedTimeAndRomanAnalysis = (args) => {
    if (args.length === 1) {
      const [e] = args;
      return [e.time, e.chord, e.scale, e.roman];
    }
    return args;
  };
  var SerializedTimeAndRomanAnalysis = class {
    time;
    chord;
    scale;
    roman;
    constructor(...args) {
      const [time, chord, scale2, roman] = getArgsOfSerializedTimeAndRomanAnalysis(args);
      this.time = new Time(time);
      this.chord = chord;
      this.scale = scale2;
      this.roman = roman;
    }
  };
  var v2 = "25.03.10.08.51";
  var SerializedRomanAnalysisData = class _SerializedRomanAnalysisData {
    constructor(body) {
      this.body = body;
    }
    version = v2;
    static checkVersion(e) {
      return e.version === v2;
    }
    // required by the class with the constructor which has 1 argument
    static instantiate(e) {
      return new _SerializedRomanAnalysisData(e.body.map((e2) => new SerializedTimeAndRomanAnalysis(e2)));
    }
  };

  // ../../packages/data-type/serializable-data/dist/index.mjs
  var import_fast_xml_parser = __toESM(require_fxp(), 1);
  var xml_options = {
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
      skipLike: /.^/,
      // /.^/ matches nothing
      eNotation: false
    },
    stopNodes: [],
    unpairedTags: [],
    alwaysCreateTextNode: false,
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: true,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false
  };
  var xml_parser = new import_fast_xml_parser.XMLParser(xml_options);

  // ../../packages/UI/controllers/dist/index.mjs
  var Controller = class {
    body;
    input;
    constructor(type, id, label) {
      const e = new ControllerView(type, id, label);
      this.body = e.body;
      this.input = e.input;
      this.init();
    }
    listeners = [];
    addListeners(...listeners) {
      this.listeners.push(...listeners);
      this.update();
    }
    init() {
      this.input.addEventListener("input", this.update.bind(this));
      this.update();
    }
  };
  var ControllerView = class {
    body;
    input;
    label;
    constructor(type, id, label) {
      this.input = document.createElement("input");
      this.input.type = type;
      this.input.id = id;
      this.input.name = id;
      this.label = document.createElement("label");
      this.label.textContent = label;
      this.label.htmlFor = this.input.id;
      this.label.style.whiteSpace = "nowrap";
      this.body = document.createElement("span");
      this.body.style.whiteSpace = "nowrap";
      this.body.appendChild(this.label);
      this.body.appendChild(this.input);
    }
  };
  var ColorSelector = class extends Controller {
    constructor(id, text) {
      super("radio", id, text);
      this.id = id;
    }
  };
  var IRM_ColorSelector = class extends ColorSelector {
    getColor;
    constructor(id, text, getColor5) {
      super(id, text);
      this.getColor = getColor5;
    }
    update() {
      this.listeners.forEach((setColor) => setColor((triad) => this.getColor(triad)));
    }
  };
  var MelodyColorSelector = class {
    body;
    children;
    default;
    constructor() {
      this.children = [
        new IRM_ColorSelector("Narmour_concept", "Narmour concept color", get_color_of_Narmour_concept),
        new IRM_ColorSelector("implication_realization", "implication realization", get_color_of_implication_realization),
        new IRM_ColorSelector("digital_parametric_scale", "digital parametric scale color", get_color_on_digital_parametric_scale),
        new IRM_ColorSelector("digital_intervallic_scale", "digital intervallic scale color", get_color_on_digital_intervallic_scale),
        new IRM_ColorSelector("registral_scale", "registral scale color", get_color_on_registral_scale),
        new IRM_ColorSelector("intervallic_angle", "intervallic angle color", get_color_on_intervallic_angle),
        new IRM_ColorSelector("analog_parametric_scale", "analog parametric scale color", get_color_on_parametric_scale)
      ];
      this.children.forEach((e) => {
        e.input.name = "melody-color-selector";
      });
      this.default = this.children[0];
      this.default && (this.default.input.checked = true);
      this.body = document.createElement("div");
      this.body.id = "melody_color_selector";
      this.children.forEach((e) => this.body.appendChild(e.body));
      this.default.update();
    }
    addListeners(...listeners) {
      this.children.forEach((e) => e.addListeners(...listeners));
      this.default.update();
    }
  };
  var MelodyColorController = class {
    view;
    selector;
    constructor() {
      this.selector = new MelodyColorSelector();
      this.view = document.createElement("div");
      this.view.id = "melody-color-selector";
      this.view.style.display = "inline";
      this.view.appendChild(this.selector.body);
    }
    addListeners(...listeners) {
      this.selector.addListeners(...listeners);
    }
  };
  var Checkbox = class extends Controller {
    constructor(id, label) {
      super("checkbox", id, label);
      this.input.checked = false;
    }
  };
  var DMelodyController = class {
    view;
    checkbox;
    constructor() {
      const d_melody_switcher = new DMelodySwitcher("d_melody_switcher", "detected melody before fix");
      this.view = document.createElement("div");
      this.view.id = "d-melody";
      this.view.appendChild(d_melody_switcher.body);
      this.checkbox = d_melody_switcher;
    }
    addListeners(...listeners) {
      this.checkbox.addListeners(...listeners);
    }
  };
  var DMelodySwitcher = class extends Checkbox {
    constructor(id, label) {
      super(id, label);
    }
    update() {
      this.listeners.forEach((e) => e(this.input.checked));
    }
  };
  var GravityController = class {
    view;
    chord_checkbox;
    scale_checkbox;
    constructor(visible) {
      const chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
      const scale_gravity_switcher = new GravitySwitcher("scale_gravity_switcher", "Scale Gravity");
      this.view = document.createElement("div");
      this.view.id = "gravity-switcher";
      this.view.style = visible ? "visible" : "hidden";
      this.view.appendChild(scale_gravity_switcher.body);
      this.view.appendChild(chord_gravity_switcher.body);
      this.chord_checkbox = chord_gravity_switcher;
      this.scale_checkbox = scale_gravity_switcher;
    }
  };
  var GravitySwitcher = class extends Checkbox {
    constructor(id, label) {
      super(id, label);
    }
    update() {
      this.listeners.forEach((e) => e(this.input.checked));
    }
  };
  var Slider = class extends Controller {
    display;
    constructor(id, label, min, max, step, value) {
      super("range", id, label);
      this.display = document.createElement("span");
      this.body.appendChild(this.display);
      this.input.min = String(min);
      this.input.max = String(max);
      this.input.step = String(step);
      value && (this.input.value = String(value));
      this.updateDisplay();
      this.input.addEventListener("input", this.updateDisplay.bind(this));
    }
  };
  var HierarchyLevel = class extends Slider {
    constructor() {
      super("hierarchy_level_slider", "Melody Hierarchy Level", 0, 1, 1);
    }
    updateDisplay() {
      this.display.textContent = `layer: ${this.input.value}`;
    }
    setHierarchyLevelSliderValues = (max) => {
      this.input.max = String(max);
      this.input.value = String(max);
      this.updateDisplay();
    };
    update() {
      const value = Number(this.input.value);
      this.listeners.forEach((e) => e(value));
    }
  };
  var HierarchyLevelController = class {
    view;
    slider;
    constructor(layer_count) {
      const hierarchy_level = new HierarchyLevel();
      this.view = document.createElement("div");
      this.view.id = "hierarchy-level";
      this.view.appendChild(hierarchy_level.body);
      this.slider = hierarchy_level;
      this.slider.setHierarchyLevelSliderValues(layer_count);
    }
    addListeners(...listeners) {
      this.slider.addListeners(...listeners);
    }
  };
  var TimeRangeController = class {
    view;
    slider;
    constructor(length) {
      const time_range_slider = new TimeRangeSlider();
      this.view = document.createElement("div");
      this.view.id = "time-length";
      this.view.appendChild(time_range_slider.body);
      this.slider = time_range_slider;
      if (length > 30) {
        const window2 = 30;
        const ratio = window2 / length;
        const max = this.slider.input.max;
        const value = max + Math.log2(ratio);
        this.slider.input.value = String(value);
        this.slider.updateDisplay();
      }
    }
    addListeners(...listeners) {
      this.slider.addListeners(...listeners);
    }
  };
  var TimeRangeSlider = class extends Slider {
    constructor() {
      super("time_range_slider", "Time Range", 1, 10, 0.1, 10);
    }
    updateDisplay() {
      [Number(this.input.value)].map((e) => e - Number(this.input.max)).map((e) => Math.pow(2, e)).map((e) => e * 100).map((e) => Math.floor(e)).map((e) => `${e} %`).map((e) => this.display.textContent = e);
    }
    update() {
      const value = Number(this.input.value);
      const max = Number(this.input.max);
      const ratio = Math.pow(2, value - max);
      PianoRollRatio.set(ratio);
      this.listeners.forEach((e) => e(ratio));
    }
  };
  var MelodyBeepVolume = class extends Slider {
    constructor() {
      super("melody_beep_volume", "", 0, 100, 1);
    }
    updateDisplay() {
      this.display.textContent = `volume: ${this.input.value}`;
    }
    update() {
      const value = Number(this.input.value);
      this.listeners.forEach((e) => e(value));
    }
  };
  var MelodyBeepSwitcher = class extends Checkbox {
    constructor(id, label) {
      super(id, label);
    }
    update() {
      const visibility = this.input.checked;
      this.listeners.forEach((e) => e(visibility));
    }
  };
  var MelodyBeepController = class {
    view;
    checkbox;
    volume;
    constructor() {
      const melody_beep_switcher = new MelodyBeepSwitcher("melody_beep_switcher", "Beep Melody");
      const melody_beep_volume = new MelodyBeepVolume();
      this.view = document.createElement("div");
      this.view.appendChild(melody_beep_switcher.body);
      this.view.appendChild(melody_beep_volume.body);
      this.view.id = "melody-beep-controllers";
      this.checkbox = melody_beep_switcher;
      this.volume = melody_beep_volume;
    }
  };

  // index.ts
  var Controllers = class {
    div;
    d_melody;
    hierarchy;
    time_range;
    gravity;
    melody_beep;
    melody_color;
    constructor(layer_count, length, gravity_visible) {
      this.div = document.createElement("div");
      this.div.id = "controllers";
      this.div.style = "margin-top:20px";
      this.d_melody = new DMelodyController();
      this.hierarchy = new HierarchyLevelController(layer_count);
      this.time_range = new TimeRangeController(length);
      this.gravity = new GravityController(gravity_visible);
      this.melody_beep = new MelodyBeepController();
      this.melody_color = new MelodyColorController();
      [
        this.d_melody,
        this.hierarchy,
        this.time_range,
        this.gravity,
        this.melody_beep,
        this.melody_color
      ].forEach((e) => this.div.appendChild(e.view));
    }
  };
  var TitleInfo = class {
    constructor(id, mode) {
      this.id = id;
      this.mode = mode;
    }
  };
  var AnalyzedMusicData = class {
    constructor(roman, melody, hierarchical_melody, GTTM) {
      this.roman = roman;
      this.melody = melody;
      this.hierarchical_melody = hierarchical_melody;
      this.GTTM = GTTM;
    }
  };
  var getMusicAnalyzerWindow = (window2, raw_analyzed_data) => {
    const e = window2;
    e.MusicAnalyzer = raw_analyzed_data;
    return e;
  };
  var ApplicationManager = class {
    NO_CHORD = false;
    // コード関連のものを表示しない
    FULL_VIEW = false;
    // 横いっぱいに分析結果を表示
    analyzed;
    controller;
    audio_time_mediator;
    window_size_mediator;
    constructor(beat_info, romans, hierarchical_melody, melodies, d_melodies) {
      if (hierarchical_melody.length <= 0) {
        throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`);
      }
      const layer_count = hierarchical_melody.length - 1;
      const length = melodies.length;
      this.controller = new Controllers(layer_count, length, !this.NO_CHORD);
      this.audio_time_mediator = new AudioReflectableRegistry();
      this.window_size_mediator = new WindowReflectableRegistry();
      const controllers = {
        ...this.controller,
        audio: this.audio_time_mediator,
        window: this.window_size_mediator
      };
      this.analyzed = new MusicStructureElements(beat_info, romans, hierarchical_melody, melodies, d_melodies, controllers);
    }
  };
  var EventLoop = class {
    constructor(registry, audio_player2) {
      this.registry = registry;
      this.audio_player = audio_player2;
      this.old_time = Date.now();
      this.fps_element = document.createElement("p");
      this.fps_element.id = "fps";
      this.fps_element.textContent = `fps:${0}`;
      document.body.insertAdjacentElement("beforeend", this.fps_element);
    }
    fps_element;
    last_audio_time = Number.MIN_SAFE_INTEGER;
    old_time;
    audioUpdate() {
      const now_at = this.audio_player.currentTime;
      if (this.audio_player.paused && now_at === this.last_audio_time) {
        return;
      }
      this.last_audio_time = now_at;
      NowAt.set(now_at);
      this.registry.onUpdate();
    }
    onUpdate() {
      const now = Date.now();
      const fps = Math.floor(1e3 / (now - this.old_time));
      this.fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
      this.fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
      this.old_time = now;
      this.audioUpdate();
    }
    update() {
      this.onUpdate();
      requestAnimationFrame(this.update.bind(this));
    }
  };
  var getG = (header_height) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${0},${header_height || 0})`);
    return g;
  };
  var getSVG = (header_height) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(PianoRollWidth.get()));
    svg.setAttribute("height", String(PianoRollHeight.get() + (header_height || 0)));
    svg.setAttribute("viewBox", `0 0 ${PianoRollWidth.get()} ${PianoRollHeight.get() + (header_height || 0)}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xml:space", "preserve");
    svg.setAttribute("overflow", "hidden");
    return svg;
  };
  var getSVGwithoutTitle = (piano_roll_view) => {
    const g = getG();
    g.innerHTML = piano_roll_view.svg.getHTML();
    const svg = getSVG();
    svg.appendChild(g);
    return svg.outerHTML;
  };
  var getRawSaveButton = (tune_id, title2, piano_roll_view) => {
    const save_button = document.createElement("input");
    save_button.value = "save analyzed result as SVG (without title)";
    save_button.setAttribute("type", "submit");
    function handleDownload() {
      const blob = new Blob([getSVGwithoutTitle(piano_roll_view)], { "type": "text/plain" });
      const download_link = document.createElement("a");
      download_link.setAttribute("download", `${tune_id}.svg`);
      download_link.setAttribute("href", window.URL.createObjectURL(blob));
      download_link.click();
    }
    save_button.onclick = (e) => {
      handleDownload();
    };
    return save_button;
  };
  var getForeignObject = (header_height) => {
    const foreign_object = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreign_object.setAttribute("x", "0");
    foreign_object.setAttribute("y", "0");
    foreign_object.setAttribute("width", String(PianoRollWidth.get()));
    foreign_object.setAttribute("height", String(header_height));
    return foreign_object;
  };
  var getHTML = () => {
    const html = document.createElement("html");
    html.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    return html;
  };
  var getDiv = () => {
    const div = document.createElement("div");
    div.style.backgroundColor = "white";
    div.style.width = `${100}%`;
    div.style.height = `${100}%`;
    return div;
  };
  var getH1 = (title2) => {
    const h1 = document.createElement("h1");
    h1.textContent = title2.textContent;
    return h1;
  };
  var getSVGwithTitle = (title2, piano_roll_view, header_height) => {
    const h1 = getH1(title2);
    const div = getDiv();
    div.appendChild(h1);
    const html = getHTML();
    html.appendChild(div);
    const foreign_object = getForeignObject(header_height);
    foreign_object.appendChild(html);
    const g = getG(header_height);
    g.innerHTML = piano_roll_view.svg.getHTML();
    const svg = getSVG(header_height);
    svg.appendChild(foreign_object);
    svg.appendChild(g);
    return svg.outerHTML;
  };
  var getSaveButton = (tune_id, title2, piano_roll_view) => {
    const save_button = document.createElement("input");
    save_button.value = "save analyzed result as SVG (with title)";
    save_button.setAttribute("type", "submit");
    const header_height = 96;
    function handleDownload() {
      const blob = new Blob([getSVGwithTitle(title2, piano_roll_view, header_height)], { "type": "text/plain" });
      const download_link = document.createElement("a");
      download_link.setAttribute("download", `${tune_id}.svg`);
      download_link.setAttribute("href", window.URL.createObjectURL(blob));
      download_link.click();
    }
    save_button.onclick = (e) => {
      handleDownload();
    };
    return save_button;
  };
  var getSaveButtons = (title2, titleHead2, piano_roll_view) => {
    const tune_id = `${title2.mode}-${title2.id}`;
    return [
      getSaveButton(tune_id, titleHead2, piano_roll_view),
      getRawSaveButton(tune_id, titleHead2, piano_roll_view)
    ];
  };
  var asParent = (node) => {
    return {
      appendChildren: (...children) => {
        children.forEach((e) => node.appendChild(e));
      }
    };
  };
  var ColumnHTML = class {
    div;
    constructor(...children) {
      this.div = document.createElement("div");
      this.div.setAttribute("style", `column-count: ${children.length}`);
      children.forEach((e) => this.div.appendChild(e));
    }
  };
  var setupUI = (title_info, audio_player2, titleHead2, piano_roll_place2, manager) => {
    const audio_viewer = new AudioViewer(audio_player2, manager.audio_time_mediator);
    const piano_roll_view = new PianoRoll(manager.analyzed, manager.window_size_mediator, !manager.FULL_VIEW);
    asParent(piano_roll_place2).appendChildren(
      new ColumnHTML(
        audio_viewer.wave.svg,
        audio_viewer.spectrogram.svg,
        audio_viewer.fft.svg
      ).div,
      ...getSaveButtons(title_info, titleHead2, piano_roll_view),
      piano_roll_view.svg,
      audio_player2,
      new ColumnHTML(
        manager.controller.div,
        manager.analyzed.melody.ir_plot_svg
      ).div
    );
  };
  var setFullView = (FULL_VIEW, audio_player2) => {
    if (FULL_VIEW) {
      setCurrentTimeRatio(0.025);
      audio_player2.autoplay = false;
    } else {
      audio_player2.autoplay = true;
    }
  };
  var setIRCount = () => {
    const area = document.getElementById("ir-count");
  };
  var calcIRMDistribution = (hierarchical_melody) => {
    const count = hierarchical_melody.map((layer, l) => {
      const first = layer.slice(0);
      const second = layer.slice(1);
      const diff = second.map((_, i) => second[i].note - first[i].note);
      const impl = diff.slice(0);
      const real = diff.slice(1);
      const next = diff.slice(2);
      const dabs = (a, b) => Math.abs(a) - Math.sign(b);
      const cdir = (a, b) => Math.sign(a) === Math.sign(b) ? 0 : 1;
      const count2 = {};
      real.forEach((_, i) => {
        const im = impl[i];
        const reAbs = dabs(real[i], impl[i]);
        const reDir = cdir(real[i], impl[i]);
        const neAbs = dabs(next[i], impl[i]);
        const neDir = cdir(next[i], impl[i]);
        count2[im] ||= { count: 0, 0: {}, 1: {} };
        count2[im].count++;
        count2[im][reDir][reAbs] ||= { count: 0, 0: {}, 1: {} };
        count2[im][reDir][reAbs].count++;
        count2[im][reDir][reAbs][neDir][neAbs] ||= 0;
        count2[im][reDir][reAbs][neDir][neAbs]++;
      });
      return count2;
    });
    console.log(count);
  };
  var setup = (window2, audio_player2, titleHead2, piano_roll_place2, title2) => (raw_analyzed_data) => {
    const { roman, hierarchical_melody, melody } = raw_analyzed_data;
    calcIRMDistribution(hierarchical_melody);
    const { beat_info, d_melodies } = new AnalyzedDataContainer(roman, melody, hierarchical_melody);
    setPianoRollParameters(hierarchical_melody);
    const manager = new ApplicationManager(beat_info, roman, hierarchical_melody, melody, d_melodies);
    setFullView(manager.FULL_VIEW, audio_player2);
    setupUI(title2, audio_player2, titleHead2, piano_roll_place2, manager);
    setIRCount();
    new EventLoop(manager.audio_time_mediator, audio_player2).update();
    getMusicAnalyzerWindow(window2, raw_analyzed_data).onresize = (_) => manager.window_size_mediator.onUpdate();
    manager.window_size_mediator.onUpdate();
  };
  var updateTitle = (titleHead2, gttm) => {
    titleHead2.textContent = gttm.mode ? `[${gttm.mode}] ${gttm.id}` : gttm.id;
    const tune_match = gttm.id.match(/([0-9]+)_[0-9]/);
    const tune_no = tune_match ? Number(tune_match[1]) : Number(gttm.id);
    if (tune_no) {
      const song_data = song_list[tune_no];
      titleHead2.innerHTML = `[${gttm.mode || "???"}] ${gttm.id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
    }
  };
  var getJSON = (url) => {
    return fetch(url).then((res) => res.json()).catch((e) => {
      console.error(e);
      return void 0;
    });
  };
  var getVersionedJSON = (VersionChecker) => (url) => fetch(url).then((res) => res.json()).then((res) => {
    if (VersionChecker.checkVersion(res)) {
      return VersionChecker.instantiate(res);
    } else {
      throw new Error(`Version check: fault in ${url}`);
    }
  }).catch(
    (e) => fetch(`${url}?update`).then((res) => res.json()).then((res) => VersionChecker.instantiate(res))
  ).then((res) => res?.body).then((res) => res?.map((e) => ({ ...e, head: e.time }))).catch((e) => {
    console.error(e);
    return [];
  });
  var justLoad = (analysis_urls, gttm_urls) => {
    return [
      getVersionedJSON(SerializedRomanAnalysisData)(analysis_urls.roman),
      getVersionedJSON(SerializedMelodyAnalysisData)(analysis_urls.melody),
      getJSON(gttm_urls.msc),
      getJSON(gttm_urls.grp),
      getJSON(gttm_urls.mtr),
      getJSON(gttm_urls.tsr),
      getJSON(gttm_urls.pr)
      /*
      getJSONfromXML<MusicXML>(gttm_urls.msc),
      getJSONfromXML<GroupingStructure>(gttm_urls.grp),
      getJSONfromXML<MetricalStructure>(gttm_urls.mtr),
      getJSONfromXML<ITimeSpanReduction>(gttm_urls.tsr),
      getJSONfromXML<IProlongationalReduction>(gttm_urls.pr),
      */
    ];
  };
  var compoundMusicData = (title2) => (e) => {
    const [roman, read_melody, musicxml, grouping, metric, time_span, prolongation] = e;
    const ts = time_span ? new TimeSpanReduction(time_span).tstree.ts : void 0;
    const pr = (() => {
      try {
        return prolongation ? new ProlongationalReduction(prolongation).prtree.pr : void 0;
      } catch (e2) {
        return void 0;
      }
    })();
    const measure = title2.id === "doremi" ? 3.5 : 7;
    const reduction = title2.mode === "PR" && pr || title2.mode === "TSR" && ts;
    const matrix = ts?.getMatrixOfLayer(ts.getDepthCount() - 1);
    const hierarchical_melody = reduction && matrix && musicxml && getHierarchicalMelody(measure, reduction, matrix, musicxml, roman) || [read_melody];
    const melody = hierarchical_melody[hierarchical_melody.length - 1];
    return new AnalyzedMusicData(
      roman,
      melody,
      hierarchical_melody,
      new GTTMData(grouping, metric, time_span, prolongation)
    );
  };
  var GTTM_URLs = class {
    msc;
    grp;
    mtr;
    tsr;
    pr;
    constructor(title2, resources) {
      this.msc = `https://clone-of-gttm-database.vercel.app/api/MSC?tune=${title2.id}`;
      this.grp = `https://clone-of-gttm-database.vercel.app/api/GPR?tune=${title2.id}`;
      this.mtr = `https://clone-of-gttm-database.vercel.app/api/MPR?tune=${title2.id}`;
      this.tsr = `https://clone-of-gttm-database.vercel.app/api/TS?tune=${title2.id}`;
      this.pr = `https://clone-of-gttm-database.vercel.app/api/PR?tune=${title2.id}`;
    }
  };
  var AnalysisURLs = class {
    melody;
    roman;
    constructor(title2, resources) {
      this.melody = `${resources}/${title2.id}/analyzed/melody/crepe/manalyze.json`;
      this.roman = `${resources}/${title2.id}/analyzed/chord/roman.json`;
    }
  };
  var loadMusicAnalysis = (title2, resources) => {
    const tune_name = encodeURI(title2.id);
    return Promise.all(justLoad(new AnalysisURLs(title2, resources), new GTTM_URLs(title2, resources))).then(compoundMusicData(title2));
  };
  var registerSong = (urls, default_url, audio_player2) => {
    const url = urls.pop();
    if (!url) {
      audio_player2.src = default_url;
      return;
    }
    audio_player2.muted = false;
    audio_player2.src = url;
    audio_player2.onerror = () => {
      audio_player2.muted = true;
      registerSong(urls, default_url, audio_player2);
    };
  };
  var setAudioPlayer = (title2, resources, audio_src, audio_player2) => {
    const filename = `${resources}/${title2.id}/${title2.id}`;
    const extensions = ["mp3", "mp4", "wav", "m4a"];
    registerSong(extensions.map((e) => `${filename}.${e}`), audio_src, audio_player2);
  };
  var titleHead = title;
  var main = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title2 = new TitleInfo(
      urlParams.get("tune") || "",
      urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : ""
    );
    const resources = `/resources`;
    const audio_src = `https://summer498.github.io/MusicAnalyzer-Server/resources/silence.mp3`;
    updateTitle(titleHead, title2);
    setAudioPlayer(title2, resources, audio_src, audio_player);
    loadMusicAnalysis(title2, resources).then(setup(window, audio_player, titleHead, piano_roll_place, title2));
  };
  main();
})();
