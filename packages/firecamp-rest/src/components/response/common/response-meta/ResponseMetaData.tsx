import shallow from 'zustand/shallow';

import Statuses from '../../../common/responseStatus.json';

import { ResStatus, ResSize, ResTime } from '@firecamp/ui-kit';
import { IStore, useRestStore } from '../../../../store/slices';

const ResponseMetaData = () => {
  let { response, isRequestRunning } = useRestStore(
    (s: IStore) => ({
      response: s.response,
      isRequestRunning: s.runtime.isRequestRunning,
    }),
    shallow
  );

  let { duration, size, statusCode } = response || {};

  let _getStatusObj = (statusCode) => {
    return (
      Statuses[statusCode] || { statusCode, color: 'gray', text: 'custom' }
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
    <div className="fc-response-header-stats">
      {/* <div>Response</div> */}
      {response && contentType && contentType.length ? (
        <div
          className="fc-response-header-stats-type whitespace-nowrap text-xs text-primaryColor w-fit overflow-hidden ml-4 overflow-ellipsis"
          style={{ fontSize: '11px' }}
        >
          {contentType}
        </div>
      ) : (
        ''
      )}
      <div className="fc-response-header-stats-results">
        <ResStatus
          {..._getStatusObj(statusCode)}
          isRequestRunning={isRequestRunning}
        />
        <ResTime duration={duration} isRequestRunning={isRequestRunning} />
        <ResSize size={size} isRequestRunning={isRequestRunning} />
      </div>
    </div>
  );
};

export default ResponseMetaData;
