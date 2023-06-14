import type { LoggerFormat } from 'listr2'
import { color, Listr, PRESET_TIMER } from 'listr2'
import type { ListrBaseClassOptions } from 'listr2'
import { delay, Manager, ListrLogger, ListrLogLevels } from 'listr2'
import chalk from 'chalk'
import { ListrTask } from 'listr2'
import { ListrTaskObject } from 'listr2'
import { ListrRenderer } from 'listr2'
import { DefaultRenderer } from 'listr2'

const TaskManagerFactory = <T = any>(override?: ListrBaseClassOptions): Manager<T> => {
    return new Manager({
        concurrent: false,
        exitOnError: false,
        rendererOptions: {
            collapseSubtasks: false,
            collapseSkips: false
        },
        ...override
    })
}

interface Ctx {
    injected?: boolean
    runTime?: number
}

export default class Reporter {
    private tasks = TaskManagerFactory<Ctx>()
    private logger = new ListrLogger({ useIcons: false });
    private isTaskRunning = false;
    private queue: ListrTask<any, typeof DefaultRenderer>[] = [];

    async runTask(request: any, fn: Function) {
        let result: any;
        await this.tasks.run([{
            title: request.name,
            task: async () => {
                result = await fn();
            }
        }])
        console.log(result.testResult)
        return result
    }

    async addTask(request: any) {

        this.queue.push({
            title: request.name,
            //@ts-ignore
            task: async (ctx, task): void => {
                await delay(10000);
            }
        })
        if (!this.isTaskRunning) this.run()
    }

    getTasks() {
        // console.log('in tasks')
        // console.log(this.tasks)
        return this.tasks
    }

    async run() {
        const task = this.queue.shift();
        // console.log(task)
        if (task) {
            this.isTaskRunning = true;
            await this.tasks.run([task])
        }
        if (this.queue.length) await this.run()
        else this.isTaskRunning = false;
    }
}

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
