import { Args, Command, Flags } from '@oclif/core'
import * as fs from 'fs-extra'
import * as path from 'path'

export default class Run extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    // force: Flags.boolean({ char: 'f' }),
  }

  static args = {
    file: Args.string({ description: 'firecamp collection path' }),
  }

  public async run(): Promise<void> {
    const { args } = await this.parse(Run)
    const { file } = args
    if (!file) {
      this.logToStderr('error: The collection path is missing')
      return
    }
    const _fp = path.join(__dirname, file)
    fs.readJson(_fp)
      .then(collection => {
        this.logJson(collection);
      })
      .catch(e => {
        if (e.code == 'ENOENT') this.logToStderr(`error: file not exist at ${_fp}`)
        // console.error(e)
        else this.logToStderr('error: The collection file is not valid')
      })
  }
}
