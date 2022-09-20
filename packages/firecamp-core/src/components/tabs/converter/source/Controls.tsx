import { FC } from 'react';
import { Button, EButtonColor, EButtonSize, Column } from '@firecamp/ui-kit';

import SaveButton from '../../../common/save/SavePopover';
import { EConverterLang, ISourceState } from '../types';

import { ITabMeta } from '../../types/tab';
const { JSON: Json } = EConverterLang;

const Control: FC<IControl> = ({
  source,
  tabMeta,
  tabId,
  onDemoJsonRequest,
  onClearPanel,
  onPrettify,
  onSaveRequest,
  onUpdateRequest,
}) => {
  return (
    <Column
      className="tab-panel-header-button-wrapper align-right"
      width="100%"
    >
      {
        //sample json button when empty body
        !source.body && (
          <Button
            // TODO: add color="default"
            color={EButtonColor.Primary}
            onClick={onDemoJsonRequest}
            text="sample"
            style={{ float: 'left' }}
            size={EButtonSize.Small}
          />
        )
      }
      {source.type === Json && source.hasTypeDetected && !source.hasError ? (
        <Button
          text="Prettify"
          // TODO: add color="default"
          color={EButtonColor.Primary}
          onClick={onPrettify}
          size={EButtonSize.Small}
        />
      ) : (
        <span />
      )}
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
        isDisabled={source.hasError || !source.hasTypeDetected}
      />
      <Button
        color={EButtonColor.Secondary}
        size={EButtonSize.Small}
        text="Clear"
        onClick={onClearPanel}
      />
    </Column>
  );
};

export default Control;

interface IControl {
  /**
   * Converter tab source data
   */
  source?: ISourceState;

  /**
   * Reqeust tab meta
   */
  tabMeta?: ITabMeta;

  /**
   * Request tab unique identification
   */
  tabId?: string;

  /**
   * Set demo json payload to editor
   */
  onDemoJsonRequest?: () => void;

  /**
   * Clear editor
   */
  onClearPanel?: () => void;

  /**
   * Prettify serialize data from editor
   */
  onPrettify?: () => void;

  /**
   * Save request tab
   */
  onSaveRequest?: (saveRequestData: object) => void;

  /**
   * Update request tab
   */
  onUpdateRequest?: () => void;
}
