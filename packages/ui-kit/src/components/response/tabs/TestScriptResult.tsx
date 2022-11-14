import classnames from 'classnames';
import { CustomMessage } from '@firecamp/ui-kit';
import './testscriptResult.sass';

const TestScriptResult = ({ result }) => {
  if (
    !result ||
    typeof result !== 'object' ||
    (typeof result === 'object' && !Object.keys(result).length)
  )
    return <></>;
  if (!result.suites?.length) {
    return <></>;
  } else if (result.error) {
    if (typeof result.error === 'string') {
      return <CustomMessage message={result.error || ''} />;
    } else if (
      typeof result.error === 'object' &&
      result.error.message &&
      typeof result.error.message === 'string'
    ) {
      return <CustomMessage message={result.error.message || ''} />;
    }
  }

  return (
    <div className="">
      {result.suites && result.suites.length ? (
        result.suites.map((suite: any, i: number) => (
          <Suite suite={suite} key={i} />
        ))
      ) : (
        <></>
      )}
      {/* {result.suites.tests && result.suites.tests.length ? (
        <Tests tests={result.suites.tests} key="tests" />
      ) : (
        <></>
      )} */}
    </div>
  );
};
export default TestScriptResult;

const Suite = ({ suite }) => {
  let { suites = [], tests = [], name } = suite;
  return (
    <div className="fc-suite">
      <div className="">
        <div
          className={classnames({ invalid: suite.fail > 0 }, 'fc-suite__name')}
        >
          {name || ''}
        </div>

        {tests?.length ? <Tests tests={tests} /> : <></>}

        {/* {suites.length
          ? suites.map((s: any, i: number) => <Suite suite={s} key={i} />)
          : ''} */}
      </div>
    </div>
  );
};

const Tests = ({ tests = [] }) => {
  return (
    <div className="fc-test__list">
      {tests.map((test, i) => (
        <div key={i}>
          <div
            className={classnames('fc-test', {
              invalid: test.passed == false,
            })}
          >
            {test.name}
          </div>
          {test.error?.message ? (
            <div className={classnames('fc-test__error')}>
              Error: {test?.error?.message || ''}
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};
