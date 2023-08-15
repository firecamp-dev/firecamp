import { shallow } from 'zustand/shallow';
import { Button } from '@firecamp/ui';
import { EConnectionState } from '../../../types';
import { IStore, useStore } from '../../../store';

const ConnectionButton = () => {
  const { connectionState, connect, disconnect } = useStore(
    (s: IStore) => ({
      connectionState: s.playground.connectionState,
      connect: s.connect,
      disconnect: s.disconnect,
    }),
    shallow
  );

  const _renderConnectionButton = () => {
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
            onClick={disconnect}
            primary
            xs
          />
        );
        break;
      case EConnectionState.Closing:
        return <Button text="Connect" onClick={connect} primary xs />;
        break;
      case EConnectionState.Closed:
        return <Button text="Disconnected" onClick={connect} primary xs />;
        break;
      default:
        return <Button text="Connect" onClick={connect} primary xs />;
    }
  };

  return <div className="flex items-center">{_renderConnectionButton()}</div>;
};
export default ConnectionButton;
