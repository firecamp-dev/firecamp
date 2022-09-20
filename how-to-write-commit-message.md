## How to write commit message?

The commit message will consist of a pattern like the following

`type(component): subject line in text (#issue-number)`

where 
- type is required
- component is optional
- issue-number is optional

an example of commit message is like

##### with type 
```text
feat(authentication): feature is introduced
```

##### with type and issue-number
```text
feat: authentication feature is introduced (#114)
```

##### with component
```text
feat:(platform) authentication feature is introduced
```

##### with component and issue-number
```text
feat:(platform): authentication feature is introduced (#114)
```


### types
- **chore**: Regular code maintenance
- **feat**: The new feature you're introducing
- **fix**: A bug fix
- **test**: Everything related to testing
- **ui**: Feature and updates related to UI/UX
- **refactor**: Refactoring a specific section of the codebase
- **doc**: Everything related to documentation

### components
Components are yet to define for Firecamp. TBD
