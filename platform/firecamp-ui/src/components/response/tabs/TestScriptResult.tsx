import { FC } from 'react';
import cx from 'classnames';
import { TestResultTable } from '@firecamp/ui-kit';

const TestScriptResult: FC<any> = ({ result }) => {
  // console.log(result, 'TestScriptResult...');
  return (
    <div className="flex-1 overflow-auto visible-scrollbar">
      <div className="flex text-base px-3 pt-2 -mb-2 uppercase">
        <div className="mr-3">
          <label className="mr-1">Pass:</label>
          <span className="font-semibold text-success">{result.passed}</span>
        </div>
        <div className="mr-3">
          <label className="mr-1">Fail:</label>
          <span className="font-semibold text-error">{result.failed}</span>
        </div>
        <div className="mr-3">
          <label className="mr-1">Total:</label>
          <span className="font-semibold">{result.total}</span>
        </div>
      </div>
      <TestResultTable rows={result.tests} onChange={() => {}} />
    </div>
  );
};
export default TestScriptResult;
