// @ts-nocheck
import shallow from 'zustand/shallow';

import { ResStatus, ResSize, ResTime } from '@firecamp/ui-kit';
import Statuses from '../../../../common/responseStatus.json';

import { useGraphQLStore } from '../../../../../store';

const ResponseMetaData = () => {
  let { response = {}, playgroundTab = {} } = useGraphQLStore(
    (s) => ({
      response: s.playgrounds?.[s.runtime.activePlayground]?.response,
      playgroundTab: s.runtime.playgroundTabs.find(
        (t) => t.id == s.runtime.activePlayground
      ),
    }),
    shallow
  );

  let isRequestRunning = playgroundTab?.meta?.isRequestRunning;

  let { config, data, duration, size, status, headers, cookies } =
    response || {};

  let _getStatusObj = (status) => {
    return Statuses[status] || { status, color: 'gray', text: 'custom' };
  };

  //todo: need to rethink on where to show content-type at root tab or only i body tab
  // let contentType = '';
  // if (response &&response.headers) {
  //   if (Object.keys(response.headers).includes(`content-type`))
  //     contentType = response.headers[`content-type`];
  //   else if (Object.keys(response.headers).includes(`Content-Type`))
  //     contentType = response.headers[`Content-Type`];
  //   else
  //     contentType = response.headers[`content-type`];

  //   if (contentType && contentType.includes(';')) {
  //     let newContentType = contentType.split(';');
  //     if (newContentType && newContentType.length) contentType = newContentType[0];
  //   }
  // }

  return (
    <div className="flex flex-1 cursor-pointer">
      {/* {response && contentType && contentType.length
        ? (<div className="fc-response-header-stats-type" style={{ fontSize: '11px' }}>
              {contentType}
            </div>) : <></>} */}
      <div className="ml-auto flex text-appForegroundInActive text-sm leading-5">
        <ResStatus
          {..._getStatusObj(status)}
          isRequestRunning={isRequestRunning}
        />
        <ResTime duration={duration} isRequestRunning={isRequestRunning} />
        <ResSize size={size} isRequestRunning={isRequestRunning} />
      </div>
    </div>
  );
};

export default ResponseMetaData;
