import vm from 'vm';
import chai, { assert, should, expect } from 'chai';

class Runner {
  code: string;
  suites: any[];
  result: any;
  private currentSuite: string | null;
  constructor(code: string) {
    this.code = code;
    this.suites = [];
    this.result = {
      total: 0,
      pass: 0,
      fail: 0,
      suites: [],
    };
    this.currentSuite = null;

    this.describe = this.describe.bind(this);
    this.it = this.it.bind(this);
  }

  it(desc, fn) {
    this.addTest({
      id: Math.random().toString(),
      name: desc,
      fn,
      result: {},
    });
  }

  async describe(desc, fn) {
    this.addSuite({
      id: Math.random().toString(),
      name: desc,
      fn: null,
      tests: [],
    });
    await fn();
  }

  async build(deps: any = {}) {
    await vm.runInNewContext(this.code, {
      describe: this.describe,
      it: this.it,
      chai,
      assert,
      should,
      expect,
      ...deps,
    });
  }

  addTest(test) {
    this.suites = this.suites.map((s) => {
      if (s.id === this.currentSuite) {
        return {
          ...s,
          tests: [...s.tests, test],
        };
      }
      return s;
    });
  }

  addSuite(suite) {
    this.currentSuite = suite.id;
    this.suites.push(suite);
  }

  async runTestFn(test) {
    this.result.total += 1;
    try {
      await test.fn();
      test.passed = true;
      this.result.pass += 1;
    } catch (error) {
      test.passed = false;
      test.error = error;
      this.result.fail += 1;
    }
  }

  async runTests(suite) {
    for (const test of suite.tests) {
      await this.runTestFn(test);
    }
  }

  async runSuite(suite) {
    await this.runTests(suite);
  }

  async run(deps: any = {}) {
    await this.build(deps);
    for (const suite of this.suites) await this.runSuite(suite);
    return this.toJSON();
  }

  toJSON() {
    return {
      ...this.result,
      suites: this.suites.map((s) => {
        delete s.id;
        delete s.fn;

        return {
          ...s,
          tests: s.tests.map((t) => ({
            name: t.name,
            passed: t.passed,
            error: t.error,
          })),
        };
      }),
    };
  }
}

export default Runner;

// const runner = new Runner(`
//     describe('1. Concat Strings', () => {
//       it('add Hello + World', () => {
//         console.log('hwllo world');
//         expect(1+1).equal(2);
//       });
//     });
// `);
// runner.run().then((res) => console.log(res));
