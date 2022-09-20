import { useEffect, useState } from 'react';
import {
  Button,
  EButtonColor,
  EButtonSize,
  ConfirmationPopover,
} from '@firecamp/ui-kit';

const Controls = ({ isQueryDirty, toggleQueryDirty }) => {
  //todo: need to refactor
  let tabId = 123; // todo: this will be received from tab meta
  let body = '';
  let prettifyQuery = (_) => {};
  let getOS = () => 'MacOS';

  let resetQuery = () => {};
  let onSaveQueriesToCollection = () => {};

  let [addNewQueryMessage, setAddNewQueryMessage] = useState('');

  let [isResetConfirmOpen, toggleResetConfirmPopover] = useState(false);

  let _setNewQueryMessage = () => {
    if (!body) {
      setAddNewQueryMessage(``);
    } else {
      setAddNewQueryMessage(
        `You have not saved quries to collection! Are you sure you want to reset?`
      );
    }
  };

  // console.log("addNewQueryMessage", addNewQueryMessage)

  useEffect(() => {
    _setNewQueryMessage();
  }, [body]);

  let _toggleResetConfirmPopover = (value) => {
    toggleResetConfirmPopover(value);
  };

  let _onReset = () => {
    resetQuery();
    setAddNewQueryMessage('');
    _toggleResetConfirmPopover(false);

    toggleQueryDirty(false);
  };

  const _onSaveToCollection = () => {
    onSaveQueriesToCollection();
    toggleQueryDirty(false);
  };

  return (
    <div className="GraphQL-content-body-request-body-query-editor-container-save">
      {!!body ? (
        <ConfirmationPopover
          id={`reset-playground-${tabId}`}
          isOpen={isResetConfirmOpen}
          title={addNewQueryMessage}
          handler={
            <Button
              id={`confirm-popover-handler-reset-playground-${tabId}`}
              color={EButtonColor.Secondary}
              size={EButtonSize.Small} // TODO: add class for exsmall
              onClick={() =>
                isQueryDirty ? _toggleResetConfirmPopover(true) : _onReset()
              }
              disabled={!body ? true : false}
              text="Reset"
            />
          }
          _meta={{
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            tooltip: 'new playground',
          }}
          onConfirm={() => _onReset()}
        />
      ) : (
        ''
      )}
      {!!body ? (
        <Button
          id={`prettify-${tabId}`}
          color={EButtonColor.Secondary}
          size={EButtonSize.Small} // TODO: add class for exsmall
          onClick={(_) => prettifyQuery(body)}
          disabled={!body ? true : false}
          text="Prettify"
          // tooltip={ getOS() === 'MacOS' ? 'shift + ⌘ + P' : 'shift + ctrl + P' } //todo: look thos type error
        />
      ) : (
        ''
      )}
      {!!body && isQueryDirty ? (
        <Button
          id={`save-to-collection-${tabId}`}
          color={EButtonColor.Secondary}
          size={EButtonSize.Small} // TODO: add class for exsmall
          onClick={(_) => _onSaveToCollection()}
          text="Save to collection"
          disabled={!body ? true : false}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Controls;
