import { Har } from 'har-format';
import { Collection } from '@firecamp/types';


const firecampToHar = (collection: Partial<Collection>): any => {
  return {};
};

const harToFirecamp = (har: Har): Partial<Collection> => {
  const exctractQuerParams=(queryparams:Har.queryString[])=>{
    if(queryparams.length===0){
      return []
    }
    const convertesqueryparams=queryparams.map((obj)=>{
      return {
        "id":"",
        "key":obj.key,
        "value":obj.value,
        "type":"text",


      }
    })
      return convertesqueryparams;
  }
  const extractHeader=(header:Har.headers[])=>{
     if(header.length===0){
      return []
    }
    return header.map((obj)=>{
      return {
        "name":obj.name,
        "value":obj.value
      }
    })
  }
  return {
    requests: [
      {
        "url": {
          "raw": {har.entries.request.url},
          "queryParams":exctractQuerParams(har.entries.request.queryString),
          "pathParams": []
        },
        "method": {har.entries.request.methods},
        "headers": extractHeader(har.entries.request.headers),
        "body": {
          "type": "none",
          "value": ""
        },
        "auth": {
          "type": "none",
          "value": ""
        },
        "preScripts": [],
        "postScripts": [],
        "__meta": {
          "name": "GET Request",
          "description": "",
          "type": "rest",
          "version": "2.0.0"
        },
        "__ref": {
          "id": ""
        }
      }

    ]
  };
};

export { firecampToHar, harToFirecamp };
