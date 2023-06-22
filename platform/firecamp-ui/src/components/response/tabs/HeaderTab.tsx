import { FC } from 'react';
import { BasicTable, Button, PlainTable } from '@firecamp/ui';
import _toPairs from 'lodash/toPairs';
import { Resizable } from 're-resizable';
import { IHeader } from '@firecamp/types';

const HeaderTab: FC<{ headers: IHeader[] }> = ({ headers = [] }) => {
  // const _headersToString = (headers: any = {}) => {
  //   console.log('headers', headers);
  //   return Object.keys(headers).reduce(
  //     (prev, h) => prev + h + ': ' + headers[h] + '\n',
  //     ''
  //   );
  // };

  const _copyAsText = (hds: any) => {
    // ctx_copyToClipboard(_headersToString(hds));
  };

  const _copyAsJson = (json: any) => {
    // ctx_copyToClipboard(JSON.stringify(json, null, 4));
  };

  return (
    <PlainTable
      columns={[
        { id: 'key', key: 'key', name: 'Name', width: '150px' },
        {
          id: 'value',
          key: 'value',
          name: 'Value',
          width: '150px',
          resizeWithContainer: true,
        },
      ]}
      classes={{
        table: '!m-0 !min-w-full',
        td: 'text-app-foreground-inactive',
      }}
      rows={headers}
    />
  );
  return (
    <div className=" striped response-headers-table">
      <div className="">
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
            topLeft: false,
          }}
          minWidth={210}
        >
          <div className="">Name</div>
        </Resizable>
        <div className="">
          Value
          {/* <div className="response-headers-action1 flex float-right h-5">
            <Button
              text="copy text"
              onClick={(e) => _copyAsText(headers)}
              transparent
              secondary
              ghost
              sm
            />
            <Button
              text="copy json"
              onClick={(e) => _copyAsJson(headers)}
              transparent
              secondary
              ghost
              sm
            />
          </div> */}
        </div>
      </div>

      {headers.map((h: any, i: number) => {
        return (
          <div className="" key={i}>
            <div className="">{h.key}</div>
            <div className="">{h.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTab;
