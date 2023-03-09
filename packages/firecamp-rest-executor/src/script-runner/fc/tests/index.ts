export class Test implements ITest {
  private result: {
    tests: any[];
    passed: number;
    failed: number;
    total: number;
  };
  constructor() {
    this.result = { tests: [], passed: 0, failed: 0, total: 0 };
  }

  test = async (testName: string, specFunction: Function = () => {}) => {
    const t: any = { name: testName };
    try {
      await specFunction();
      t.isPassed = true;
      this.result.passed += 1;
    } catch (e) {
      t.error = e;
      t.isPassed = false;
      this.result.failed += 1;
    }
    this.result.total += 1;
    this.result.tests.push(t);
  };

  toJSON = () => this.result;
}

export interface ITest {
  /**  test provider */
  test: (testName: string, specFunction: Function) => void;
}
