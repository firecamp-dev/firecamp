
import { ERunnerEvents } from '@firecamp/collection-runner';
import ora, { Ora } from 'ora';
import c from 'kleur';
import figures from 'figures';
import Table from 'cli-table3';
import prettyMs from 'pretty-ms';

export default class Reporter {

    private request: any;
    private spinner: Ora = ora();
    constructor(emitter: any) {
        emitter
            .on(ERunnerEvents.Start, () => { })
            .on(ERunnerEvents.BeforeRequest, (request: any) => {
                // console.log(request)
                this.onBeforeRequest(request)
            })
            .on(ERunnerEvents.Request, (result: any) => {
                this.onRequest(result)
            })
            .on(ERunnerEvents.Done, (result: any) => {
                this.onDone(result)
            });
    }
    initSpinner() {
        this.spinner = ora()
        this.newLine();
    }

    onBeforeRequest(request: any) {
        // console.log(request)
        this.initSpinner()
        this.request = request
        this.spinner.start(this._title())
    }

    onRequest(result: any) {

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
            this.logResponseMeta(result.response.response)
        }
    }

    onDone(result: any) {
        this.logResult(result)
    }

    newLine(n: number = 1) {
        if (n > 10) n = 5
        if (n < 0) n = 1;
        Array.from({ length: n }).forEach(() => console.log(''))
    }

    _title() {
        const { method = '', name = '', url, path } = this.request
        const title = `${name} ${c.dim().cyan(`(${path})`)}`;
        // return title;

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
            console.log(`       `, c.italic().dim(error.message))
        // throw new Error(error)
    }

    logResponseMeta(response: any) {
        const { code, status, responseTime, responseSize } = response

        console.log(c.dim('   ----------------'))
        console.log(
            `   `,
            c.dim(`${code} ${status}`),
            c.dim(`${responseTime}ms`),
            c.dim(`${responseSize}B`)
        )
    }

    logResult(summary: any) {
        const { result: { total, pass, fail, duration } } = summary

        // const _header = (h: string) => c.magenta(h);
        var table = new Table({
            // head: [
            //     _header('method'),
            //     _header('api'),
            //     _header('status'),
            //     _header('pass'),
            //     _header('fail')
            // ],
            // colWidths: [100, 400, 200, 150, 150 ],
            // wordWrap: true,
            // chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }

        });

        this.newLine();
        table.push(
            [c.dim('Total Requests'), 28],
            [c.dim('Total run duration'), prettyMs(duration)],
            [c.dim('Tests'), total],
            [c.green('Pass Tests'), pass],
            [c.red('Fail Tests'), fail]
        );

        console.log(table.toString());
    }

}
