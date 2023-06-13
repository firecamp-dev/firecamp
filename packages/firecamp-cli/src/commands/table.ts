import { Command, ux } from '@oclif/core'
import chalk from 'chalk';
import Table from 'cli-table3';
import ora from 'ora';
import boxen from 'boxen';

export default class Users extends Command {
    static flags = {}


    async run() {
        const { flags } = await this.parse(Users)
        // const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users')

        console.log(boxen('unicorn', {padding: 1}));

        const spinner = ora(`Loading ${chalk.red('unicorns')}`).start();
        const spinner1 = ora(`  Test one`).start();
        const spinner2 = ora(`  Test 2`).start();
        spinner.succeed()
        spinner1.indent = 4
        spinner1.succeed()
        spinner2.indent = 4
        spinner2.fail()

        const _header = (h: string) => chalk.hex('#079fb3')(h);
        var table = new Table({
            head: [
                _header('method'),
                _header('api'),
                _header('status'),
                _header('pass'),
                _header('fail')
            ],
            // colWidths: [100, 400, 200, 150, 150 ],
            wordWrap: true,
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                , 'right': '║', 'right-mid': '╢', 'middle': '│'
            }
        });

        table.push(
            [chalk.green('GET'), chalk.blue('https://localhost:300/api/post'), '200', 3, 2],
            [chalk.blue('POST'), chalk.blue('https://localhost:300/api/post'), '200', 3, 1],
            [chalk.red('DELETE'), chalk.blue('https://localhost:300/api/post'), '200', 3, 2]
        );

        this.log(table.toString());

        // console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));

        // boxen('unicorn', {padding: 1})

    }
}