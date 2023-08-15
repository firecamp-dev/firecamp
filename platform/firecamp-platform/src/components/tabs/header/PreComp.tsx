import { FC } from 'react';
import classNames from 'classnames';
import { ArrowDown, Braces, FolderOpen, Folder } from 'lucide-react';

import { EHttpMethod, ERequestTypes } from '@firecamp/types';
import {
  FcIconGraphQL,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui';
import { ETabEntityTypes } from '../types';

const PreComp: FC<{ entity: any; entityType: string }> = ({
  entity,
  entityType,
}) => {
  switch (entityType) {
    case ETabEntityTypes.Request:
      switch (entity.__meta.type) {
        case ERequestTypes.Rest:
          const method = entity?.method || EHttpMethod.GET;
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
            <div className="SOCKETIO text-xs font-bold w-5 tab-icon">
              <FcIconSocketIoSquare size={24} />
            </div>
          );
        case ERequestTypes.WebSocket:
          return (
            <div className="WEBSOCKET text-xs font-bold w-5 tab-icon">
              <FcIconWebSocket size={24} />
            </div>
          );
        default:
          return <span />;
      }

    case ETabEntityTypes.Environment:
      return (
        <div className="environment text-xs font-bold w-5 tab-icon">
          <Braces size={16} />
        </div>
      );
    case ETabEntityTypes.Collection:
      return (
        <div className="collection text-xs font-bold w-5 tab-icon">
          <Folder size={16} />
        </div>
      );
    case ETabEntityTypes.Folder:
      return (
        <div className="folder text-xs font-bold w-5 tab-icon">
          <FolderOpen size={16} />
        </div>
      );
    case ETabEntityTypes.Import:
      return (
        <div className="text-xs font-bold w-5 tab-icon">
          <ArrowDown size={16} />
        </div>
      );
    default:
      return <></>;
  }
};

export default PreComp;
