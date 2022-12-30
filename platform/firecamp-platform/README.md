# URL Utility

### <ins>Usage</ins>
```ts
import { url } from '@firecamp/url'

const urlString = 'https://google.com'

// Convert url string to object
const urlObject = url.toObject(urlString)

// Convert url object to string
url.toString(urlString)

// Parse url string, specifically use before sending request to execute
url.normalize('localhost:4000', 'http')

// Return 
// http://localhost:4000
```
