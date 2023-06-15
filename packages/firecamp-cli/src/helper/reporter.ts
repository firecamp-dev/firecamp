import ora, { Ora } from 'ora';
import c from 'kleur';
import figures from 'figures';

export default class Reporter {

    private request: any;
    private spinner: Ora = ora();
    init() {
        this.spinner = ora()
        this.newLine();
    }

    startRequest(request: any) {
        // console.log(request)
        this.init()
        this.request = request
        this.spinner.start(this._title())
    }

    done(result: any) {

        if (result.response?.testResult) {
            const { testResult, testResult: { tests } } = result.response;
            this.spinner.stopAndPersist({
                symbol: testResult.failed == 0 ? c.green(figures.tick) : c.red(figures.cross)
            });
            tests.map((t: any) => {
                if (t.isPassed) this.logTest(t)
                else this.logTest(t, true)
            })
            // console.log(testResult)
        }
    }

    newLine(n: number = 1) {
        if (n > 10) n = 5
        if (n < 0) n = 1;
        Array.from({ length: n }).forEach(() => console.log(''))
    }

    _title() {
        const { method = '', name = '', url } = this.request
        const title = `${name} ${c.dim().cyan('(./folder/path)')}`;
        return title;

        // title with url
        return `${title}
  ${c.dim(method.toUpperCase() + ' ' + url)}`
    }

    logTest(test: any, failed = false) {
        const { name, error } = test
        const log = !failed
            ? `${c.green('   ' + figures.tick)} ${c.dim(name)}`
            : `${c.red('   ' + figures.cross)} ${c.red().dim(name)}`
        console.log(log)

        if (error)
            console.log(`       `, c.dim(error.message))
        // throw new Error(error)
    }

}
