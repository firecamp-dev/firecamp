import convert from 'xml-js';
import { to_json as XML2JSON } from 'xmljson';
import { EConverterLang } from './types';
import { stringify } from 'javascript-stringify';
import jsyaml from 'js-yaml';
import saferEval from 'safer-eval';
import formatXML from 'prettify-xml';

const { JS, JSON: Json, XML, YAML } = EConverterLang;

let parser = new DOMParser(); // XML DOM parser

const XML_to_JSON = (sourceData) => {
  return new Promise((rs, rj) => {
    XML2JSON(sourceData, (error = '', data: any) => {
      if (error) return rj(error);
      rs(data);
    });
  });
};

export default class DataConvertor {
  // Detect Type of sourceData
  static detectDataType = (code: string | number) => {
    let type;
    if (
      !code ||
      (typeof code === 'string' && !code.length) ||
      typeof code !== 'string'
    )
      return;
    if (code == '""' || code == "''" || code.length == 0) {
      return 'OTHER';
    } else {
      try {
        if (Number.isNaN(code) == true) {
          if (JSON.parse(code)) {
            let res = code.trim();

            if (
              (res.startsWith('{') && res.endsWith('}')) ||
              (res.startsWith('[') && res.endsWith(']'))
            ) {
              type = Json;
              return type;
            } else {
              throw 'error';
            }
          }
        } else {
          throw 'error';
        }
      } catch (err) {
        type = 'OTHER';
      }

      try {
        if (code !== 'code') {
          // let result = saferEval("(" + code + ")");
          let result = code;
          if (Number.isNaN(code) === true) {
            if (JSON.parse(JSON.stringify(result))) {
              // result = JSON.stringify(result);
              if (
                (result.startsWith('{') && result.endsWith('}')) ||
                (result.startsWith('[') && result.endsWith(']')) ||
                (result.startsWith('(') && result.endsWith(')'))
              ) {
                type = JS;
                return type;
              } else throw 'error';
            }
          } else throw 'error';
        }
      } catch (err) {
        type = 'OTHER';
      }

      try {
        let xml = parser.parseFromString(code, 'text/xml');
        if (xml.getElementsByTagName('parsererror').length) {
          throw 'error';
        } else {
          type = XML;
          return type;
        }
      } catch (err) {
        type = 'OTHER';
      }

      try {
        if (jsyaml.load(code)) {
          type = YAML;
          return type;
        } else throw 'error';
      } catch (err) {
        type = 'OTHER';
      }
    }
    // console.log("type other", type);
    return type;
  };

  static validate = {
    json: (sourceData: string) => {
      try {
        if (typeof sourceData !== 'string') {
          return false;
        } else {
          let json = JSON.parse(sourceData);
          console.log({ json });
          return true;
        }
      } catch (error) {
        return false;
      }
    },

    js: () => {
      return true;
    },

    xml: (sourceData: string) => {
      let xml = parser.parseFromString(sourceData, 'text/xml');
      if (xml.getElementsByTagName('parsererror').length) {
        return false;
      } else {
        return true;
      }
    },

    yaml: () => {
      return true;
    },
  };

  static prettify = {
    json: (sourceData: string) => {
      // console.log("s data", sourceData);
      try {
        return JSON.stringify(JSON.parse(sourceData), null, 4);
      } catch (e) {
        // console.log(e);
        return undefined;
      }
    },

    js: (sourceData) => {
      return sourceData; //TODO: we will add prettifier later
    },

    xml: (sourceData) => {
      try {
        let formattedXml = formatXML(sourceData);
        return formattedXml;
      } catch (e) {
        // console.log(`e`, e);
        return sourceData; //TODO: we will add prettifier later
      }
    },

    yaml: (sourceData) => {
      return sourceData; //TODO: we will add prettifier later
    },
  };

  static convert = {
    xml: {
      toJSON: async (sourceData: string, type = 'Compact') => {
        let response;
        switch (type) {
          case JS:
            // to convert xml string to JSObject

            XML_to_JSON(sourceData)
              .then((JSObject: string) => {
                JSObject = JSON.stringify(JSObject);

                let replacer = (value, indent, stringify) => {
                  /* if (addTrailingComma) {
                   if (value instanceof Array) {
                   return stringify(value).replace(/\n]$/g, ",\n]");
                   }
                   if (typeof value === 'object') {
                   return stringify(value).replace(/\n}$/g, ",\n}");
                   }
                   }*/
                  return stringify(value);
                };
                let js = stringify(JSON.parse(JSObject), replacer, 2);
                response = js;
              })
              .catch((e) => {
                console.log(`e`, e);
              });
            break;

          case 'Plain':
            let Plain = await XML_to_JSON(sourceData);
            Plain = JSON.stringify(Plain, null, 2);
            response = Plain;
            break;

          case 'Non-compact':
            // to convert xml string to javascript object
            let normal = convert.xml2js(sourceData, {
              compact: false,
              ignoreComment: true,
              // spaces: 4 // TODO: Check options
            });
            response = JSON.stringify(normal, null, 2);
            break;

          case 'Compact':
            // to convert xml string to json string
            let compact = convert.xml2json(sourceData, {
              compact: true,
              ignoreComment: true,
              spaces: 4,
            });
            // console.log("xml to json string : ", Compact);
            response = compact;
            break;
        }
        return Promise.resolve(response);
      },

      toYAML: async (sourceData) => {
        let jsonData = await DataConvertor.convert.xml.toJSON(
          sourceData,
          'Plain'
        );
        let yaml = DataConvertor.convert.json.toYAML(jsonData);
        // console.log("xml2yaml : ", yaml);
        return Promise.resolve(yaml);
      },
    },

    json: {
      toJSON: (sourceData, type = 'Plain') => {
        let response;
        switch (type) {
          case JS:
            // console.log("in json to json");
            let replacer = (value, indent, stringify) => {
              /* if (addTrailingComma) {
               if (value instanceof Array) {
               return stringify(value).replace(/\n]$/g, ",\n]");
               }
               if (typeof value === 'object') {
               return stringify(value).replace(/\n}$/g, ",\n}");
               }
               }*/
              return stringify(value);
            };
            response = stringify(JSON.parse(sourceData), replacer, 2);
            break;
          case 'Plain':
            response = sourceData;
            break;
        }
        return Promise.resolve(response);
      },

      toXML: (sourceData: string) => {
        try {
          let input;

          if (typeof sourceData === 'string') {
            input = JSON.parse(sourceData);

            if (
              Object.keys(input).length > 1 ||
              (Object.keys(input).length === 1 &&
                typeof input?.[Object.keys(input)[0]] !== 'object')
            ) {
              input = { root: { ...input } };
            }

            return Promise.resolve(
              convert.json2xml(input, {
                compact: true,
                ignoreComment: true,
                spaces: 4,
                elementNameFn: function (val) {
                  return val.replace(/\s/g, '_');
                },
              })
            );
          }
          return Promise.resolve('Invalid data');
        } catch (error) {
          return Promise.resolve('Invalid data');
        }
      },

      toYAML: (sourceData) => {
        let yamlResponse = jsyaml.dump(JSON.parse(sourceData));
        // console.log("yamlResponse", yamlResponse);
        return Promise.resolve(yamlResponse);
      },
    },

    yaml: {
      toJSON: async (sourceData, type = 'Plain') => {
        let json = jsyaml.load(sourceData);
        // console.log("yaml2json : ", json);
        json = JSON.stringify(json, null, 2);
        let response;
        switch (type) {
          case JS:
            let replacer = (value, indent, stringify) => {
              /* if (addTrailingComma) {
               if (value instanceof Array) {
               return stringify(value).replace(/\n]$/g, ",\n]");
               }
               if (typeof value === 'object') {
               return stringify(value).replace(/\n}$/g, ",\n}");
               }
               }*/
              return stringify(value);
            };
            let JSObject = stringify(JSON.parse(json), replacer, 2);
            // console.log(JS, JSObject);
            response = JSObject;
            break;
          case 'Plain':
            response = json;
            break;
        }
        // console.log("response", response);
        return Promise.resolve(response);
      },

      toXML: async (sourceData) => {
        // console.log("source", sourceData)
        let json = await DataConvertor.convert.yaml.toJSON(sourceData); // TODO: default plain (no compact here)
        // console.log(Json, json);
        let xml = await DataConvertor.convert.json.toXML(json);
        // console.log("yaml2xml : ", xml);
        return Promise.resolve(xml);
      },
    },

    js: {
      toJSON: (sourceData: any) => {
        try {
          let json = JSON.stringify(saferEval(`${sourceData}`));
          return Promise.resolve(json);
        } catch (e) {
          console.log('Error: ', e.message);
          return undefined;
        }
      },

      toXML: (sourceData: any) => {
        try {
          let json = JSON.stringify(saferEval(`(${sourceData})`));
          return DataConvertor.convert.json.toXML(json);
        } catch (e) {
          console.log('Error: ', e.message);
          return undefined;
        }
      },

      toYAML: (sourceData: any) => {
        try {
          let json = JSON.stringify(saferEval(`(${sourceData})`));
          return DataConvertor.convert.json.toYAML(json);
        } catch (e) {
          console.log('Error: ', e.message);
          return undefined;
        }
      },
    },
  };
}
