import { Args, Command, Flags } from '@oclif/core'
import { loadJsonFile } from 'load-json-file';
import c from 'kleur';
import figlet from 'figlet'
//@ts-ignore https://github.com/egoist/tsup/issues/760
import Runner, { ERunnerEvents } from '@firecamp/collection-runner'
import _RestExecutor from '@firecamp/rest-executor';
//@ts-ignore //TODO: rest-executor is commonjs lib while runner is esm. we'll move all lib in esm in future
const RestExecutor = _RestExecutor.default
import CliReporter from '../../reporters/cli.js'
/**
 * Run command example
 * ./bin/dev run ../../test/data/FirecampRestEchoServer.firecamp_collection.json
 */
export default class Run extends Command {
  static description = 'Run Firecamp Collection'

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
    this.log(c.gray(figlet.textSync("Firecamp")))

    const _filepath = new URL(`../../../${file}`, import.meta.url).pathname
    loadJsonFile(_filepath)
      .then(collection => {
        // this.logJson(collection);
        const runner = new Runner(collection, {
          executeRequest: (request: any) => {
            const executor = new RestExecutor();
            return executor.send(request, { collectionVariables: [], environment: [], globals: [] });
          }
        })

        const emitter = runner.run()
        // console.log(emitter)
        new CliReporter(emitter);
      })
      .then(testResults => {
        // console.log(testResults)
        // this.logJson(testResults)
      })
      .catch(e => {
        console.error(e)
        if (e.code == 'ENOENT') this.logToStderr(`error: file not exist at ${_filepath}`)
        else this.logToStderr('error: The collection file is not valid')
      })
  }
}
