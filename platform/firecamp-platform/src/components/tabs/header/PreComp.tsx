import classNames from 'classnames';
import { EHttpMethod, ERequestTypes } from '@firecamp/types';
import {
  FcIconGraphQL,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui-kit';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { FC } from 'react';

const PreComp: FC<{ entity: { type: string; info: any } }> = ({ entity }) => {
  const { type, info } = entity;

  switch (type) {
    case 'request':
      switch (info.type) {
        case ERequestTypes.Rest:
          const method = info?.method || EHttpMethod.GET;
          return (
            <div className={classNames(`${method} text-xs font-bold tab-icon`)}>
              {method}
            </div>
          );
        case ERequestTypes.GraphQL:
          return (
            <div className="GRAPHQL text-xs font-bold w-5 tab-icon">
              <FcIconGraphQL size={20} />
            </div>
          );
        case ERequestTypes.SocketIO:
          return (
            <div className="SOCKETIO text-xs font-bold w-5 invert tab-icon">
              <FcIconSocketIoSquare size={24} />
            </div>
          );
        case ERequestTypes.WebSocket:
          return (
            <div className="WEBSOCKET text-xs font-bold w-5 invert tab-icon">
              <FcIconWebSocket size={24} />
            </div>
          );
        default:
          return <span />;
      }
      break;
    case 'environment':
      return (
        <div className="environment text-xs font-bold w-5 invert tab-icon">
          <VscJson size={20} />
        </div>
      );
      break;
    default:
      return <></>;
  }
};

export default PreComp;
