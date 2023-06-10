oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g firecamp-cli
$ firecamp COMMAND
running command...
$ firecamp (--version)
firecamp-cli/0.0.0 darwin-x64 node-v18.14.1
$ firecamp --help [COMMAND]
USAGE
  $ firecamp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [oclif-hello-world](#oclif-hello-world)
- [Usage](#usage)
- [Commands](#commands)
  - [`firecamp hello PERSON`](#firecamp-hello-person)
  - [`firecamp hello world`](#firecamp-hello-world)
  - [`firecamp help [COMMANDS]`](#firecamp-help-commands)
  - [`firecamp plugins`](#firecamp-plugins)
  - [`firecamp plugins:install PLUGIN...`](#firecamp-pluginsinstall-plugin)
  - [`firecamp plugins:inspect PLUGIN...`](#firecamp-pluginsinspect-plugin)
  - [`firecamp plugins:install PLUGIN...`](#firecamp-pluginsinstall-plugin-1)
  - [`firecamp plugins:link PLUGIN`](#firecamp-pluginslink-plugin)
  - [`firecamp plugins:uninstall PLUGIN...`](#firecamp-pluginsuninstall-plugin)
  - [`firecamp plugins:uninstall PLUGIN...`](#firecamp-pluginsuninstall-plugin-1)
  - [`firecamp plugins:uninstall PLUGIN...`](#firecamp-pluginsuninstall-plugin-2)
  - [`firecamp plugins update`](#firecamp-plugins-update)

## `firecamp hello PERSON`

Say hello

```
USAGE
  $ firecamp hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/FirecampDev/firecamp-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `firecamp hello world`

Say hello world

```
USAGE
  $ firecamp hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ firecamp hello world
  hello world! (./src/commands/hello/world.ts)
```

## `firecamp help [COMMANDS]`

Display help for firecamp.

```
USAGE
  $ firecamp help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for firecamp.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `firecamp plugins`

List installed plugins.

```
USAGE
  $ firecamp plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ firecamp plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `firecamp plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ firecamp plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ firecamp plugins add

EXAMPLES
  $ firecamp plugins:install myplugin 

  $ firecamp plugins:install https://github.com/someuser/someplugin

  $ firecamp plugins:install someuser/someplugin
```

## `firecamp plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ firecamp plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ firecamp plugins:inspect myplugin
```

## `firecamp plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ firecamp plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ firecamp plugins add

EXAMPLES
  $ firecamp plugins:install myplugin 

  $ firecamp plugins:install https://github.com/someuser/someplugin

  $ firecamp plugins:install someuser/someplugin
```

## `firecamp plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ firecamp plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ firecamp plugins:link myplugin
```

## `firecamp plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ firecamp plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ firecamp plugins unlink
  $ firecamp plugins remove
```

## `firecamp plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ firecamp plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ firecamp plugins unlink
  $ firecamp plugins remove
```

## `firecamp plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ firecamp plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ firecamp plugins unlink
  $ firecamp plugins remove
```

## `firecamp plugins update`

Update installed plugins.

```
USAGE
  $ firecamp plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
