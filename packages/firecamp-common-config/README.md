Usage



This repository contains all the necessary common configurations, such as ESLint, Prettier, etc., which can be imported into any other repository and used.



To download the dependency in the required repository, use the following command:

```
pnpm install @firecamp/common-config --save-dev
```

For ESLint configuration, add eslint-ts.js to the .eslintrc.js file in the repository using the following command:

```
module.exports={
...require("@firecamp/common-config/eslint-ts.js") ,
......
}
```

For tsconfig.json, add the tsconfig.json file in the repository with the following command:

```
{
extends:"@firecamp/common-config/tsconfig.json",
......
}
```
