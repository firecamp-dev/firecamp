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
  onEmit = () => {}
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
              color={EButtonColor.Secondary}
              text={'Set original'}
              size={EButtonSize.Small}
              onClick={setToOriginal}
            />
          ) : (
            <DocButton
              key="doc_button"
              classname={
                'transparent border-0 flex items-center btn text-secondaryBG px-3 py-1'
              }
              text={'Help'}
              link={
                'https://firecamp.io/docs/clients/socketio/configuring-socket-setting'
              }
              iconClassname={'iconv2-info-icon font-base mr-2'}
            />
          )}
        </StatusBar.PrimaryRegion>
        <StatusBar.SecondaryRegion>
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
