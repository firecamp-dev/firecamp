import { Args, Command, Flags } from '@oclif/core'
import { loadJsonFile } from 'load-json-file';
import * as fs from 'fs'
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

    try {
      const collection = JSON.parse(fs.readFileSync(_fp, { encoding: 'utf-8' }));
      //TODO: validate the collection json
      // if(collection)
      this.logJson(collection);
    }
    catch (e) {
      this.error('The collection file is not valid')
    }
  }
}
