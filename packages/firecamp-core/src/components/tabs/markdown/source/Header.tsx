// @ts-nocheck
import { FC } from 'react';
import { Button, EButtonColor, EButtonSize, TabHeader } from '@firecamp/ui-kit';
import { ITabMeta } from '../../types/tab';
import { ISourceState } from './Source';

import SaveButton from '../../../common/save/SavePopover';

const Header: FC<IHeader> = ({
  source: { body = '' },
  tabMeta = {},
  tabId = '',
  requestMeta = {},

  onSaveRequest = (_) => {},
  onUpdateRequest = (_) => {},
  onDemoMDRequest = (_) => {},
  onClearPanel = (_) => {},
}) => {
  return (
    <TabHeader className="converter-left-header">
      <div className="flex text-base items-center flex-1">
        <div className="selected border-primaryColor mx-2 border-b-2">
          Markdown
        </div>
        <div className="border-transparent mx-2 border-b-2">
          {requestMeta?.name || 'Untitled-1'}
        </div>
        <div className="border-transparent mx-2 border-b-2 ml-auto flex">
          {
            //sample json button when empty body
            !body && (
              <Button
                // TODO: add color="default"
                primary
                text="sample"
                onClick={onDemoMDRequest}
                style={{ float: 'left' }}
                sm
                className="mr-2"
              />
            )
          }
          <SaveButton
            onSave={onSaveRequest}
            onUpdate={onUpdateRequest}
            tabMeta={tabMeta}
            tabId={tabId}
            meta={{
              formTitle: 'Save data payload',
              namePlaceholder: 'Title',
              descPlaceholder: 'Description',
            }}
            isDisabled={body ? false : true}
          />
          <Button
            secondary
            // TODO: add className="bordered"
            text="Clear"
            onClick={onClearPanel}
            sm
            className="ml-2"
          />
        </div>
      </div>
    </TabHeader>
  );
};
export default Header;

interface IHeader {
  source: ISourceState;
  tabMeta: ITabMeta;
  tabId: string;
  requestMeta: object;

  /**
   * Set demo json payload to editor
   */
  onDemoJsonRequest?: () => void;

  /**
   * Clear editor
   */
  onClearPanel?: () => void;

  /**
   * Save request tab
   */
  onSaveRequest?: (saveRequestData: object) => void;

  /**
   * Update request tab
   */
  onUpdateRequest?: () => void;
}
