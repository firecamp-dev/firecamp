import { FC } from 'react';
import classNames from 'classnames';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { EHttpMethod, ERequestTypes } from '@firecamp/types';
import {
  FcIconGraphQL,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui-kit';
import { ETabEntityTypes } from '../types';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';
import { VscFolderOpened } from '@react-icons/all-files/vsc/VscFolderOpened';

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

    case ETabEntityTypes.Environment:
      return (
        <div className="environment text-xs font-bold w-5 invert tab-icon">
          <VscJson size={20} />
        </div>
      );
    case ETabEntityTypes.Collection:
      return (
        <div className="collection text-xs font-bold w-5 invert tab-icon">
          <VscFolder size={20} />
        </div>
      );
    case ETabEntityTypes.Folder:
      return (
        <div className="folder text-xs font-bold w-5 invert tab-icon">
          <VscFolderOpened size={20} />
        </div>
      );
    default:
      return <></>;
  }
};

export default PreComp;
