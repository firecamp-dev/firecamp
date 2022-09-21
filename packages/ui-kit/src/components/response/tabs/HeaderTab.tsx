import { FC } from "react";
import { Button,  } from '@firecamp/ui-kit';
import _toPairs from 'lodash/toPairs';
import { Resizable } from 're-resizable';

const HeaderTab: FC<{headers: any}> = ({ headers= {} }) => {

  let pairs = _toPairs(headers);

  let _headersToString = (headers: any = {}) => {
    console.log('headers', headers);
    return Object.keys(headers).reduce(
      (prev, h) => prev + h + ': ' + headers[h] + '\n',
      ''
    );
  };

  let _copyAsText = (hds: any) => {
    // ctx_copyToClipboard(_headersToString(hds));
  };

  let _copyAsJson = (json: any) => {
    // ctx_copyToClipboard(JSON.stringify(json, null, 4));
  };

  return (
    <div className="smart-table striped response-headers-table">
      <div className="smart-table-row smart-table-header">
        {/* @ts-ignore */}
        <Resizable
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
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
              onClick={e => _copyAsText(headers)}
            />
            <Button
              secondary
              transparent={true}
              sm
              ghost={true}
              text="copy json"
              onClick={e => _copyAsJson(headers)}
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
  );
};

export default HeaderTab;
