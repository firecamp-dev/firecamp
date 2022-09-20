# Welcome to Firecamp 👋

[![Firecamp Discord](https://badgen.net/discord/members/8hRaqhK)](https://discord.gg/8hRaqhK)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://firecamp.io/docs)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/jhen0409/react-chrome-extension-boilerplate/graphs/commit-activity)
[![Twitter: Firecamp](https://img.shields.io/twitter/follow/firecamphq.svg?style=social)](https://twitter.com/firecamphq)

## Pre-requisite
- [libraries to link](#libraries-to-link)
- [local libraries](#local-libraries)


### <u>libraries to link</u>

All libraries are linked via yarn in a specific package.

<i><u>Example:</u></i>

library to link

```sh
$ firecamp-packages/packages-misc/cloud-apis/yarn link
yarn link v1.22.17
success Registered "@firecamp/cloud-apis".
info You can now run `yarn link "@firecamp/cloud-apis"` in the projects where you want to use this package and it will be used instead.
Done in 0.10s.
```

library where library will be link

```sh
$ firecamp-oss/yarn link @firecamp/cloud-apis
yarn link v1.22.17
success Using linked package for "@firecamp/cloud-apis".
Done in 0.09s.
```

Following are the list of libs need to link on root of the project:
- @firecamp/cloud-apis
- @firecamp/indexed-db
- @firecamp/types

### <u>local libraries</u>

Following are the list:
<table border="1px">
<tr>
    <th>package</th>
    <th>directory path</th>
    <th>lib. to clone</th>
</tr>
<tr>
    <td>electron-oauth-helper</td>
    <td>firecamp-forks/electron-oauth-helper</td>
    <td>https://github.com/firecamp-forks/electron-oauth-helper</td>
</tr>
</table>


<b>Note:</b> Run `yarn` and `tsc` after clone
## Install

```sh
yarn install
```

## Run dev app

```sh
yarn dev
```
