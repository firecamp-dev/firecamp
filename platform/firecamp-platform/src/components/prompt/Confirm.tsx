import { FC } from 'react';
import { Button, TabHeader } from '@firecamp/ui';

const _labels: IConfirm['labels'] = {
  confirm: 'Create',
  cancel: 'Cancel',
};

const ConfirmationModal: FC<IConfirm> = ({
  message = '',
  labels,
  onConfirm = () => { },
  onCancel = () => { },
}) => {

  const l = { ..._labels, ...labels };
  return (
    <div>
      <div className="mb-4">{message}</div>
      <TabHeader className="!px-0">
        <TabHeader.Right>
          <Button
            text={l?.cancel || `Cancel`}
            onClick={() => onCancel()}
            secondary
            xs
          />
          <Button
            text={l?.confirm || 'Confirm'}
            onClick={() => onConfirm()}
            primary
            xs
          />
        </TabHeader.Right>
      </TabHeader>
    </div>
  );
};

export default ConfirmationModal;

export interface IConfirm {
  /** message for the confirmation popup */
  message: string;

  /** btn labels */
  labels?: { confirm?: string; cancel?: string; };

  /** show a specific note in eye caching note box */
  note?: string;

  /** callback function on successful confirmation */
  onConfirm?: () => any;

  /** callback function on rejected confirmation */
  onCancel?: () => any;
}
