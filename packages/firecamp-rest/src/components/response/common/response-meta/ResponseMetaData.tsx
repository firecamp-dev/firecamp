import shallow from 'zustand/shallow';
import { ResStatus, ResSize, ResTime } from '@firecamp/ui';
import Statuses from '../../../common/responseStatus.json';
import { IStore, useStore } from '../../../../store';

const ResponseMetaData = () => {
  const { response, isRequestRunning } = useStore(
    (s: IStore) => ({
      response: s.response,
      isRequestRunning: s.runtime.isRequestRunning,
    }),
    shallow
  );
  const { responseTime, responseSize, code } = response || {};
  const _getStatusObj = (code) => {
    return (
      Statuses[code] || { code, color: 'gray', text: 'custom' }
    );
  };

  let contentType = '';
  if (response && response.headers) {
    if (Object.keys(response.headers).includes(`content-type`)) {
      contentType = response.headers[`content-type`];
    } else if (Object.keys(response.headers).includes(`Content-Type`)) {
      contentType = response.headers[`Content-Type`];
    } else {
      contentType = response.headers[`content-type`];
    }

    if (contentType && contentType.includes(';')) {
      let newContentType = contentType.split(';');
      if (newContentType && newContentType.length) {
        contentType = newContentType[0];
      }
    }
  }

  return (
    <div>
      {/* <div>Response</div> */}
      {response && contentType && contentType.length ? (
        <div
          className="whitespace-nowrap text-xs text-primaryColor w-fit overflow-hidden ml-4 overflow-ellipsis"
          style={{ fontSize: '11px' }}
        >
          {contentType}
        </div>
      ) : (
        <></>
      )}ƒ
      <div>
        <ResStatus
          {..._getStatusObj(code)}
          isRequestRunning={isRequestRunning}
        />
        <ResTime time={responseTime} isRequestRunning={isRequestRunning} />
        <ResSize size={responseSize} isRequestRunning={isRequestRunning} />
      </div>
    </div>
  );
};

export default ResponseMetaData;
