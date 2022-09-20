# REST-executor

### <ins>Pre-requisite</ins>
- Node.js v16
- Pre-script request only contains specific keys, so need to merge with actual one before send to the executor
- Post-script response only contains specific keys, so need to merge with actual one before going to use

### <ins>TODO</ins>

- Test cases
  - add graphql body test case
  - chrome agent test cases not running due to chrome API not found
  - Unable to use File, FormData API which prevent run form data body with File

### <ins>Build</ins>

- Run: `yarn build`

### <ins>Run test case</ins>

- Run: `yarn test`

### <ins>Usage</ins>

#### <ins>Execute REST request</ins>

```ts
// React App
import executor from '@firecamp/rest-executor/dist/esm';

// Node.js
import executor from '@firecamp/rest-executor/dist/cjs';

// Run pre script
const { request, environment } = await executor.preScript(request, variables);

// Run request
const response = await executor.send(request);

// Set cookies

// Run post script
await executor.postScript(postScript: string, response: IRestResponse, variables: TEnvVariable);

// Run test script
await executor.testScript(request: IRest, response: IRestResponse, variables: TEnvVariable);
```