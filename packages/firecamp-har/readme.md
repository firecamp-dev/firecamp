## Firecamp <> HAR

This package will convert

1. Firecamp collection to HAR
2. HAR to Firecamp Collection

usage

```
import { firecampToHar, harToFirecamp } from "@firecamp/firecamp-har";

const firecampCollection = { requests: [ fcRequest ] }
const har = firecampToHar(firecampCollection);
console.log(har);

const fc = harToFirecamp(harCollection);
console.log(fc);
```