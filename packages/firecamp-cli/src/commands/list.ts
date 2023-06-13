import { Command, ux } from '@oclif/core'
import type { ListrBaseClassOptions } from 'listr2'
import { delay, Manager, ListrLogger, ListrLogLevels } from 'listr2'

export default class List extends Command {
    static flags = {}


    async run() {
        const { flags } = await this.parse(List)
        await new MyMainClass().run()
    }

}

function TaskManagerFactory<T = any>(override?: ListrBaseClassOptions): Manager<T> {
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

class MyMainClass {
    private tasks = TaskManagerFactory<Ctx>()
    private logger = new ListrLogger({ useIcons: false })

    public async run(): Promise<void> {
        this.tasks.add(
            [
                {
                    title: 'A task running manager [0]',
                    task: async (): Promise<void> => {
                        throw new Error('Do not dare to run the second task.')
                    }
                },
                {
                    title: 'This will never run first one failed.',
                    task: async (): Promise<void> => {
                        await delay(2000)
                    }
                }
            ],
            { exitOnError: true, concurrent: false }
        )

        this.tasks.add(
            [
                {
                    title: 'Some task that will run in sequential execution mode. [0]',
                    task: async (): Promise<void> => {
                        await delay(2000)
                    }
                },
                {
                    title: 'Some task that will run in sequential execution mode. [1]',
                    task: async (): Promise<void> => {
                        await delay(2000)
                    }
                },
                this.tasks.indent(
                    [
                        {
                            title: 'This will run in parallel. [0]',
                            task: async (): Promise<void> => {
                                await delay(2000)
                            }
                        },
                        {
                            title: 'This will run in parallel. [1]',
                            task: async (): Promise<void> => {
                                await delay(2000)
                            }
                        }
                    ],
                    { concurrent: true }
                )
            ],
            { concurrent: false }
        )

        this.logger.log(ListrLogLevels.STARTED, 'This will run all the tasks in a queue and clear the queue afterwards.')
        await this.tasks.runAll()

        this.logger.log(ListrLogLevels.STARTED, 'You can use listr directly without importing it.')
        this.logger.log(ListrLogLevels.STARTED, 'It will use the options set on the manager so you dont have to initialize it with options everytime.')

        try {
            await this.tasks.run([
                {
                    title: 'I will survive, dont worry',
                    task: (): void => {
                        throw new Error('This will not crash since exitOnError is set to false eventhough default setting in Listr is false.')
                    }
                }
            ])
        } catch (e: any) {
            this.logger.log(ListrLogLevels.FAILED, e)
        }

        this.logger.log(ListrLogLevels.STARTED, 'Access the errors on the last run as in a similar way.')
        this.logger.log(ListrLogLevels.OUTPUT, this.tasks.errors)

        this.logger.log(ListrLogLevels.STARTED, 'You can also access Listr directly in the same way.')
        this.logger.log(ListrLogLevels.STARTED, 'It is not the same manager instance, just a jumper function.')

        try {
            await this.tasks
                .newListr([
                    {
                        title: 'I will die now, goodbye my friends.',
                        task: (): void => {
                            throw new Error('This will not crash since exitOnError is set to false eventhough default setting in Listr is false.')
                        }
                    }
                ])
                .run()
        } catch (e: any) {
            this.logger.log(ListrLogLevels.FAILED, e)
        }

        this.logger.log(ListrLogLevels.STARTED, 'You can inject context directly to main instance.')
        this.tasks.ctx = { injected: true }
        await this.tasks.run([
            {
                title: 'I got the context',
                task: (ctx, task): void => {
                    task.title = String(ctx.injected)
                }
            }
        ])

        this.logger.log(ListrLogLevels.STARTED, 'There is an embedded function of getting the run time, that can be useful in concurrent tasks.')
        await this.tasks.run(
            [
                {
                    task: async (ctx): Promise<void> => {
                        // start the clock
                        ctx.runTime = Date.now()
                    }
                },
                {
                    title: 'Running',
                    task: async (): Promise<void> => {
                        await delay(1000)
                    }
                }
            ],
            { concurrent: false }
        )
    }
}
