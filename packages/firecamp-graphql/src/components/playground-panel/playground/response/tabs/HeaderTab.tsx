// @ts-nocheck
import { Fragment, useContext } from 'react';
import { Button, EButtonSize } from '@firecamp/ui-kit';
import _toPairs from 'lodash/toPairs';
import Resizable from 're-resizable';
import shallow from 'zustand/shallow';

import { useGraphQLStore } from '../../../../../store';

const HeaderTab = () => {
  let { response } = useGraphQLStore(
    (s) => ({
      response: s.playgrounds?.[s.runtime.activePlayground]?.response,
    }),
    shallow
  );

  let headers = response.headers ? response.headers : {};
  let pairs = _toPairs(headers);

  let _headersToString = (headers = {}) => {
    console.log('headers', headers);
    return Object.keys(headers).reduce(
      (prev, h) => prev + h + ': ' + headers[h] + '\n',
      ''
    );
  };

  let _copyAsText = (text) => {
    // ctx_copyToClipboard(_headersToString(text));
  };

  let _copyAsJson = (json) => {
    // ctx_copyToClipboard(JSON.stringify(json, null, 4));
  };

  return (
    <Fragment>
      <div className="smart-table striped response-headers-table">
        <div className="smart-table-row smart-table-header">
          <Resizable
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            minWidth={210}
          >
            <div className="smart-table-row-cell">Name</div>
          </Resizable>
          <div className="smart-table-row-cell">
            Value
            <div className="response-headers-action1 flex float-right h-5">
              <Button
                secondary
                transparent={true}
                sm
                ghost={true}
                text="copy text"
                onClick={(e) => _copyAsText(headers)}
              />
              <Button
                secondary
                transparent={true}
                sm
                ghost={true}
                text="copy json"
                onClick={(e) => _copyAsJson(headers)}
              />
            </div>
          </div>
        </div>

        {pairs
          ? pairs.map((p, i) => {
              return (
                <div className="smart-table-row" key={i}>
                  <div className="smart-table-row-cell">{p[0]}</div>
                  <div className="smart-table-row-cell">{p[1]}</div>
                </div>
              );
            })
          : ''}
      </div>
    </Fragment>
  );
};

export default HeaderTab;
