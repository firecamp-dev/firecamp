# @firecamp/agent-executor

### <ins>Usage</ins>

#### <ins>Execute REST request</ins>

```ts
import * as executor from '@firecamp/agent-manager';

// Run request
const response = await executor.send(request, firecampAgent);

// Request to cancel running request
await executor.cancel(request._meta.id, fcAgent);
```