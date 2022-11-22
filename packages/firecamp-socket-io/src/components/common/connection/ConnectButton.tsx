import { Button } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import { EConnectionState } from '../../../constants';
import { ISocketStore, useSocketStore } from '../../../store';

const ConnectionButton = () => {
  let { connectionState, activePlayground, connect, disconnect } =
    useSocketStore(
      (s: ISocketStore) => ({
        connectionState:
          s.playgrounds[s.runtime.activePlayground]?.connectionState,
        activePlayground: s.runtime.activePlayground,
        connect: s.connect,
        disconnect: s.disconnect,
      }),
      shallow
    );

  let _renderConnectionButton = () => {
    switch (connectionState) {
      case EConnectionState.Open:
      case EConnectionState.Connecting:
        return (
          <Button
            text={
              connectionState === EConnectionState.Connecting
                ? 'Connecting'
                : 'Disconnect'
            }
            onClick={() => {
              disconnect(activePlayground);
            }}
            primary
            sm
            iconLeft
          />
        );
        break;
      case EConnectionState.Closing:
        return (
          <Button
            text="Connect"
            onClick={() => connect(activePlayground)}
            primary
            sm
            iconLeft
          />
        );
        break;
      case EConnectionState.Closed:
        return (
          <Button
            text="Disconnected"
            onClick={() => connect(activePlayground)}
            primary
            sm
            iconLeft
          />
        );
        break;
      default:
        return (
          <Button
            text="Connect"
            onClick={() => connect(activePlayground)}
            primary
            sm
            iconLeft
          />
        );
    }
  };

  return <div className="flex items-center">{_renderConnectionButton()}</div>;
};
export default ConnectionButton;
