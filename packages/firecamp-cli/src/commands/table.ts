import { Command, ux } from '@oclif/core'
import * as chalk from 'chalk';
import * as Table from 'cli-table3';

export default class Users extends Command {
    static flags = {

    }

    async run() {
        const { flags } = await this.parse(Users)
        // const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users')

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

        console.log(table.toString());

        // console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));

        // boxen('unicorn', {padding: 1})

    }
}