import classNames from 'classnames';
import { EHttpMethod, ERequestTypes } from '@firecamp/types';

const PreComp = ({ method = '', type = '' }) => {
  switch (type) {
    case ERequestTypes.Rest:
      if (!method) method = EHttpMethod.GET;
      return (
        <div
          className={classNames(
            { '': method === EHttpMethod.GET },
            `${method} text-xs font-bold`
          )}
        >
          {method}
        </div>
      );
    case ERequestTypes.GraphQL:
      return (
        <div className="GRAPHQL text-xs font-bold w-5">
          <img src={'icon/png/icons-color/graphql.png'} />
        </div>
      );
    case ERequestTypes.SocketIO:
      return (
        <div className="SOCKETIO text-xs font-bold w-5 invert">
          <img src={'icon/png/icons-color/socketio.png'} />
        </div>
      );
    case ERequestTypes.WebSocket:
      return (
        <div className="WEBSOCKET text-xs font-bold w-5 invert">
          <img src={'icon/png/icons-color/websocket.png'} />
        </div>
      );
    default:
      return <span />;
  }
};

export default PreComp;
