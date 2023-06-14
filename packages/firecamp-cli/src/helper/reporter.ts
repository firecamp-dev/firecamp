import type { LoggerFormat } from 'listr2'
import { delay, color, Listr, PRESET_TIMER } from 'listr2'
import chalk from 'chalk'

const tasks = new Listr(
    [
        {
            title: 'This task will execute.',
            task: async (_, task): Promise<Listr> => {

                task.title = chalk.blue("I have done stuff, but should do some more.");
                return task.newListr([
                    {
                        title: 'This is a subtask.',
                        task: async (): Promise<void> => {
                            await delay(3000)
                        }
                    }
                ], {
                    concurrent: true,
                    collectErrors: false,
                    rendererOptions: { collapseSubtasks: false }
                })
            }
        }
    ],
    {
        concurrent: false,
        rendererOptions: {
            collapseSubtasks: false,
            timer: {
                ...PRESET_TIMER,
                condition: (duration): boolean => duration > 250,
                format: (duration): LoggerFormat => {
                    if (duration > 1000) {
                        //@ts-ignore
                        return color.red
                    }
                    //@ts-ignore
                    return color.green
                }
            },

        }
    }
)

export { tasks }
