### <ins>Usage</ins>

```ts
// Usage of Auth service 
const auth = new Auth(authOptions: TAuth, extra?: { url?, method?, data?, authType })

const authHeader = await auth.authorize().getHeader()

// Return
// { Authorization: 'value' }
```