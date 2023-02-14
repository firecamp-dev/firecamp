import cx from 'classnames';
import { TestResultTable } from '@firecamp/ui-kit';

const TestScriptResult = ({ result }) => {
  console.log(result, 'TestScriptResult...');
  return (
    <TestResultTable
      rows={[
        {
          isPassed: true,
          name: 'Response time is less than 200ms',
        },
        {
          isPassed: false,
          name: 'Successful POST request',
        },
        {
          isPassed: true,
          name: 'Response code is less than 201',
        },
      ]}
      onChange={() => {}}
    />
  );
};
export default TestScriptResult;
