# `@firecamp/websocket`

> TODO: description

### Purpose:
To demonstrate real-time WebSocket events and save it too for future use.

### Usage:

```
const Websocket = require('@firecamp/websocket');

<Websocket
  tabData={tabData}
  envSnippetsMeta={{
    showProjectSnippets: showProjectSnippets,
    global: {
      show: true,
      name:"Global",
      snippets: globalSnippets.snippets || {},
      active_snippet: globalSnippets.active_snippet || {},
      allowed_snippet_variable_formates: [],
      onChangeActiveSnippet: ()=>{},
      onChangeSnippetVariables:()=>{}
    },
    project: {
      show: true,
      uuid: projectSnippets.uuid || "",
      name: projectSnippets.name || "",
      snippets: projectSnippets.snippets || {},
      active_snippet: projectSnippets.active_snippet || {},
      allowed_snippet_variable_formates: [],
      onChangeActiveSnippet: ()=>{},
      onChangeSnippetVariables: ()=>{}
    },
    onChangeActiveProject: ()=>{},
    toggleEnvModal: ()=>{}
  }}
  sslManager={[]}
  proxyManager={[]}
  request={{}}
  collection={{}}
  additionalComponents={{}}
  firecampFunctions={firecampFunctions}
  constants={constants}
  webSocketExecutor={{}}
  tour={{
      ws:{},
      steps:[]  
  }}
  onChange={()=>{}}
  onSave={()=>{}}
  onUpdate={()=>{}}
  onSendMessage={()=>{}}
/>

```

### Props:



|  Prop | type | Description  |   
|---|---|---|
|  tabData | Object |Tab data is firecamp websocket tab data and it is used to save/ update request.   | 
|  meta | Object |client meta  |
| envSnippetsMeta  | Object | Environment snippet meta is having all the information regurding to firecamp environment snippets. |  
|  sslManager | Array | Firecamp ssl manager data  |  
|  proxyManager | Array|Firecamp proxy manager data  |  
|  request |  Object |Firecamp websocket request payload  |  
|  collection |  Object | Websocket message collection  |
|  additionalComponents |  Object | Websocket additional components  |  
|  firecampFunctions | Object | firecampFunctions is utility function for firecamp to demonstate various operations.  |  
|  constants |  Object |Constants needed for websocket client  |  
|  webSocketExecutor |  Object |Websocket executor |  
|  onChange |  Function | To handle on change for websocket client  |  
|  onSave |  Function |To save request in firecamp  |  
|  onUpdate |  Function |To update existing request in firecamp  |  
|  onSendMessage |  Function |To add history on add message  |
  

##### Detailed descrption of props with example:  

1. envSnippetsMeta:

- showProjectSnippets: Boolean// to show project snippets or not
- global:  // type: Object
 ```javascript
{
   show= true,
   name= "Global", //optional
   snippets= {},
   active_snnippet= "",
   allowed_snippet_variable_formates= [],
   onChangeActiveSnippet=() => {
   },
   onChangeSnippetVariables= () => {
   }
 }
 ```
 - project:  // type: Object
 ```javascript
 {     
    show= true,
    uuid="",
    name= "",
    snippets= {},
    active_snnippet= "",
    allowed_snippet_variable_formates= [],
    onChangeActiveSnippet= () => {
    },
    onChangeSnippetVariables= () => {
    }
  }
 
 ```
   - onChangeActiveProject //type : function, To set active project in env
   - toggleEnvModal //type : function,To toggle env modal
   
2. Request:

```javascript
"request"= {
    "name": "request_name",
    "raw_url": "endpoint",
    "url": {},
    "_config": {
      "protocols": [
        "protocol_list"
      ],
      "auto_reconnect": false,
      "font_size": "13",
      "ping_interval": "3000"
    },
    "scripts": {
      "pre": "",
      "post": "",
      "test": ""
    },
    "active_connection": "123",
    "default_connection": {
      "uuid": "123",
      "is_default": true,
      "name": "connection_name",
      "headers": [
        {
          "uuid": "",
          "key": "header_name",
          "value": "header_value",
          "disable": false
        }
      ],
      "params": [
        {
          "uuid": "",
          "key": "param_name",
          "value": "param_value",
          "disable": false
        }
      ],
      "auth": {},
      "active_auth_type": ""
    },
    "connections": [
      {
        "uuid": "",
        "is_default": false,
        "name": "Vinaxi",
        "headers": [
          {
            "key": "header_name",
            "value": "header_value",
            "disable": false
          }
        ],
        "params": [
          {
            "key": "param_name",
            "value": "param_value",
            "disable": false
          }
        ],
        "auth": {},
        "active_auth_type": ""
      }
    ],
    "message": {
      "type": "arraybuffer",
      "typedArrayView": "Int8Array",
      "body": "",
      "name": "Message1"
    }
  }
```

3. collection:

```javascript
"collection"= {
  "messages":[],
  "directories": []
}
``` 

4. additionalComponents: 
```javascript
"additionalComponents"={       
  SaveButton: <SaveButton/>
  
}
```
