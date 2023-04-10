import { FC } from 'react';
import { Button } from '@firecamp/ui';
import shallow from 'zustand/shallow';
import CloseConnection from './CloseConnection';
import { EConnectionState } from '../../../types';
import { IStore, useStore } from '../../../store';

const ConnectButton: FC<{ sm?: boolean; xs?: boolean }> = (props) => {
  if (!props.hasOwnProperty('sm')) props.xs = true;
  const { sm, xs } = props;
  const { tabId, connectionState, connect, disconnect } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      connectionState: s.playground.connectionState,
      connect: s.connect,
      disconnect: s.disconnect,
    }),
    shallow
  );

  const _renderConnectionButton = () => {
    switch (connectionState) {
      case EConnectionState.Open:
        return (
          <CloseConnection
            buttonId={`close-connection-${tabId}`}
            id={tabId}
            onClose={disconnect}
            sm={sm}
            xs={xs}
          />
        );
        break;
      case EConnectionState.Connecting:
        return (
          <Button
            text="Connecting"
            onClick={(_) => {
              disconnect();
            }}
            iconLeft
            primary
            sm={sm}
            xs={xs}
          />
        );
        break;
      case EConnectionState.Closing:
        return <Button text="Connect" primary xs iconLeft />;
        break;
      case EConnectionState.Closed:
        return (
          <Button
            text="Disconnected"
            onClick={(_) => connect()}
            primary
            sm={sm}
            xs={xs}
            iconLeft
          />
        );
        break;
      default:
        return (
          <Button
            text="Connect"
            onClick={(_) => connect()}
            iconLeft
            primary
            sm={sm}
            xs={xs}
          />
        );
    }
  };
  return <div className="flex items-center">{_renderConnectionButton()}</div>;
};
export default ConnectButton;
