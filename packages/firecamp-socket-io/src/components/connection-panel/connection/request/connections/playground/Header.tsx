import {
  Container,
  Button,
  StatusBar,
} from '@firecamp/ui-kit';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';

import ConnectionButton from '../../../../../common/connection/ConnectButton';

const Header = ({
  emitterName = '',
  activeConnection = '',
  showEmitButton = true,
  onEmit = () => {},
}) => {
  return (
    <Container.Header className="with-divider">
      <StatusBar>
        <StatusBar.SecondaryRegion>
          <ConnectionButton
            key="message-tab"
            runtimeActiveConnection={activeConnection}
            meta={{
              closeButtonId: 'message-tab',
              closeManually: false,
              showConnectionsCount: false,
              showConnectIcons: false,
            }}
            transparent={true}
          />
          {showEmitButton === true ? (
            <Button
              icon={<IoSendSharp className="toggle-arrow" size={12} />}
              onClick={onEmit}
              disabled={!emitterName}
              primary
              sm
              iconLeft
            />
          ) : (
            <></>
          )}
        </StatusBar.SecondaryRegion>
      </StatusBar>
      {/* <TabHeader className="padding-small height-small padding-left-extra">
        <TabHeader.Right>
          
        </TabHeader.Right>
      </TabHeader> */}
    </Container.Header>
  );
};
export default Header;
