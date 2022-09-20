import classnames from 'classnames';
import { CustomMessage } from '@firecamp/ui-kit';

// import './testscriptResult.sass';

const TestScriptResult = (result: any) => {
  console.log(`result`, result);

  if (
    !result ||
    typeof result !== 'object' ||
    (typeof result === 'object' && !Object.keys(result).length)
  )
    return <span />;
  if (!result.suites && !result.error) {
    return <span />;
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
    <div className="fc-testscript-box-content">
      {result.suites.suites && result.suites.suites.length
        ? result.suites.suites.map((suite: any, i: number) => (
            <Suite suite={suite} key={i} />
          ))
        : ''}
      {result.suites.tests && result.suites.tests.length ? (
        <Tests tests={result.suites.tests} key="tests" />
      ) : (
        ''
      )}
    </div>
  );
};
export default TestScriptResult;

const Suite = ({ suite }: any) => {
  if (!Object.keys(suite).length) return <span />;

  let { suites = [], tests = [], title } = suite;
  return (
    <div className="fc-testscript-box">
      <div className="fc-testscript-box-content">
        <div
          className={classnames(
            { invalid: suite.meta ? suite.meta.fail > 0 : false },
            'fc-testscript-box-content__title'
          )}
        >
          {title || ''}
        </div>

        {tests && tests.length ? <Tests tests={tests} /> : ''}

        {suites.length
          ? suites.map((s: any, i: number) => <Suite suite={s} key={i} />)
          : ''}
      </div>
    </div>
  );
};

const Tests = ({ tests = [] }) => {
  return (
    <div className="fc-testscript-box-content-list">
      {tests.map((test, i) => (
        <div key={i}>
          <div
            className={classnames('fc-testscript-box-content-list-item', {
              invalid: test.state == 2,
            })}
          >
            {test.title || ''}
          </div>
          {test?.err?.message ? (
            <div
              className={classnames(
                'fc-testscript-box-content-list-item-error'
              )}
            >
              Error: {test?.err?.message || ''}
            </div>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
};
