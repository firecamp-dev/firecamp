import { FC } from 'react';
import cx from 'classnames';
import { TestResultTable } from '@firecamp/ui-kit';

const TestScriptResult: FC<any> = ({ result }) => {
  console.log(result, 'TestScriptResult...');
  return <TestResultTable rows={result.tests} onChange={() => {}} />;
};
export default TestScriptResult;
