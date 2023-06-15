import { Command, ux } from '@oclif/core'
import c from 'kleur';
import Table from 'cli-table3';
import boxen from 'boxen';

export default class Users extends Command {
    static flags = {}


    async run() {
        const { flags } = await this.parse(Users)
        // const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users')

        console.log(boxen('unicorn', { padding: 1 }));


        const _header = (h: string) => c.magenta(h);
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
            [c.green('GET'), c.blue('https://localhost:300/api/post'), '200', 3, 2],
            [c.blue('POST'), c.blue('https://localhost:300/api/post'), '200', 3, 1],
            [c.red('DELETE'), c.blue('https://localhost:300/api/post'), '200', 3, 2]
        );

        this.log(table.toString());

        // console.log(c.blue('Hello') + ' World' + c.red('!'));

        // boxen('unicorn', {padding: 1})

    }
}