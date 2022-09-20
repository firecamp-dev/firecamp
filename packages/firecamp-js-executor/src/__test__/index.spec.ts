import jsExecutor from ".."

it('should allow declaring a function', async () => {
    const result = await jsExecutor(`() => {return 2}`, {})

    expect(result()).toEqual(2)
})

it('should allow defining class', async () => {
    const result = await jsExecutor(
        `
        class A {
            data = 2
        }
        
        (() => {
            return {
                a: new A(),
                A
            }
        })()
    `, {})

    expect(result.a).toBeInstanceOf(result.A)
})

it('should allow using a console API', async () => {
    const result = await jsExecutor(
        `
        (() => { return console.log })();
    `, {})    

    expect(result).toBeDefined()
})

it('should throw an error on invalid syntax', async () => {
    try {
        await jsExecutor(
            `return
        `, {})    
         
    } catch (error) {
        expect(error.message).toEqual('Illegal return statement')
    }
 })