## How to name a branch?

The branch name will consist of a pattern like the following

```
{type}/{number}-short-name-of-{feature/issue/ticket}
```

where
- type is required
- number is optional

Examples of branch are

##### feature branches
```
feat/114-authentication
feat/114-auth
```

##### bug fix branches
```
fix/115-auth
fix/115-auth-error
fix/115-auth-issue
```

##### docs branches
```
docs/116-how-to-auth
docs/how-to-auth
docs/websockets
```

### types
- **chore**: Regular code maintenance
- **feat**: The new feature you're introducing
- **fix**: A bug fix
- **test**: Everything related to testing
- **ui**: Feature and updates related to UI/UX
- **refactor**: Refactoring a specific section of the codebase
- **docs**: Everything related to documentation
