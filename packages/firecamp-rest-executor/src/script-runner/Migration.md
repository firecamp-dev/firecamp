## <ins>Runtime Script Migration</ins>

This release contains some changes in runtime scripts. Like allow access to request, response basic data directly. As well as added pre-defined assertions to write tests for a request.

This doc. contains list of API changes, where unlisted API's support are dropped. So, please follow the migration guide and update request scripts soon. 

Checkout, complete runtime scripts detail documentation from [#here]()

API migration list
- [Environment API](#environment-api-migration)
- [Pre Script API](#pre-script-api-migration)

### <ins>Environment API migration</ins>

#### Get single variable

Before:

```js
env.getVariable("var_name");
```

After:

```js
environment.get("variableName");
```

#### Get multiple variables

Before:

```js
env.getVariables("var1_name", "var2_name", ...);
```

After:

```js
// return the combined variables of workspace and collection
environment.variables();
```

#### Set project single variable

Before

```js
env.project.setVariable("var_name", "var_value");
```

After: 

```js
environment.collection.set("variableName", "variableValue");
```

#### Unset project single/multiple variables

Before

```js
env.project.unsetVariables("var1_name", "var2_name", ...);
```

After: 

```js
environment.collection.unset("variableName1", "variableName2",...,"variableName-n");
```

#### Set global single variable

Before

```js
env.global.setVariable("var_name", "var_value");
```

After: 

```js
environment.workspace.set("variableName", "variableValue");
```

#### Unset global single/multiple variables

Before

```js
env.global.unsetVariables("var1_name", "var2_name", ...);
```

After: 

```js
environment.workspace.unset("variableName1", "variableName2",...,"variableName-n");
```

### <ins>Pre-script API migration</ins>

#### Set single header

Before:

```js
request.setHeader("header_name", "header_value");
```

After:

```js
request.addHeader("headerName", "headerValue");
```

#### Update single header

Before:

```js
request.setHeader("header_name", "header_value");
```

After:

```js
request.updateHeader("headerName", "headerValue");
```

#### Unset single/multiple headers

Before:

```js
request.unsetHeaders("header_name1", "header_name2",...);"
```

After:

```js
request.removeHeader("headerName1", "headerName2",...,"headerName-n");
```

#### Get single header

Before:

```js
request.getHeader("header_name");
```

After:

```js
request.getHeader("header_name");
```

#### Get multiple headers

Before:

```js
request.getHeaders("header_name1", "header_name2",...);
```

After:

```js
// return headers JS object
request.getHeaders();

// or

// return headers list
request.headers;
```

#### Set single query parameter

Before:

```js
request.setParam("param_name", "param_value");
```

After:

```js
request.addQuery("queryName", "queryValue");
```

#### Update single query parameter

Before:

```js
request.setParam("param_name", "param_value");
```

After:

```js
request.updateQuery("queryName", "queryValue");
```

#### Unset single/multiple query parameters

Before:

```js
request.unsetParams("param_name1", "param_name2",...);
```

After:

```js
request.removeQuery("queryName1", "queryName2",...,"queryName-n");
```

#### Get single query parameters

Before

```js
request.getParam("param_name");
```

After:

```js
request.getQuery("queryName");
```

#### Get multiple query parameters

Before:

```js
request.getParams("param_name1", "param_name2",...);
```

After:

```js
// return get queries object
request.getQueries();

// or

// return queries list
request.url.query_params;
```