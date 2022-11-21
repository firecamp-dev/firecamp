//@ts-nocheck
import {
  Container,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  EButtonIconPosition,
  StatusBar,
} from '@firecamp/ui-kit';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';

import ConnectionButton from '../../../../../common/connection/ConnectionButton';

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
              // TODO: add color "primary-alt"
              color={EButtonColor.Primary}
              icon={<IoSendSharp className="toggle-arrow" size={12} />}
              iconPosition={EButtonIconPosition.Left}
              size={EButtonSize.Small}
              onClick={onEmit}
              disabled={!emitterName}
            />
          ) : (
            ''
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
