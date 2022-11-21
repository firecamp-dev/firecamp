//@ts-nocheck

import {
  Container,
  TabHeader,
  DocButton,
  Button,
  EButtonColor,
  EButtonSize,
  EButtonIconPosition,
  StatusBar,
} from '@firecamp/ui-kit';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';

const Footer = ({
  emitterName = '',
  showEmitButton = false,
  activeEmitter = '',
  saveButtonHandler = {},
  setToOriginal = () => {},
  onEmit = () => {},
}) => {
  return (
    <Container.Footer>
      <StatusBar>
        <StatusBar.PrimaryRegion>
          {activeEmitter &&
          activeEmitter.length &&
          saveButtonHandler.isMessageDirty === true ? (
            <Button
              key="original_button"
              text={'Set original'}
              onClick={setToOriginal}
              secondary
              sm
            />
          ) : (
            <DocButton
              key="doc_button"
              className={
                'transparent border-0 flex items-center btn text-secondaryBG px-3 py-1'
              }
              text={'Help'}
              link={
                'https://firecamp.io/docs/clients/socketio/configuring-socket-setting'
              }
              iconClassName={'iconv2-info-icon font-base mr-2'}
            />
          )}
        </StatusBar.PrimaryRegion>
        <StatusBar.SecondaryRegion>
          {showEmitButton === true ? (
            <Button
              icon={<IoSendSharp className="toggle-arrow" size={12} />}
              onClick={onEmit}
              disabled={!emitterName}
              primary
              iconLeft
              sm
            />
          ) : (
            <></>
          )}
        </StatusBar.SecondaryRegion>
      </StatusBar>
      {/* <TabHeader className="padding-small height-small">
        <TabHeader.Left>
         
        </TabHeader.Left>
        <TabHeader.Right>
        
        </TabHeader.Right>
      </TabHeader> */}
    </Container.Footer>
  );
};

export default Footer;
