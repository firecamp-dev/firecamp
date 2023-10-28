import { useEffect, useState } from 'react';
import { Button, ConfirmationPopover } from '@firecamp/ui';

const Controls = ({ isQueryDirty, toggleQueryDirty }) => {
  //todo: need to refactor
  const tabId = 123; // todo: this will be received from tab __meta
  const value = '';
  const prettifyQuery = (_) => {};
  const getOS = () => 'MacOS';

  const resetQuery = () => {};
  const onSaveQueriesToCollection = () => {};

  const [addNewQueryMessage, setAddNewQueryMessage] = useState('');
  const [isResetConfirmOpen, toggleResetConfirmPopover] = useState(false);

  const _setNewQueryMessage = () => {
    if (!value) {
      setAddNewQueryMessage(``);
    } else {
      setAddNewQueryMessage(
        `You have not saved queries to collection! Are you sure you want to reset?`
      );
    }
  };

  // console.log("addNewQueryMessage", addNewQueryMessage)

  useEffect(() => {
    _setNewQueryMessage();
  }, [value]);

  const _toggleResetConfirmPopover = (value) => {
    toggleResetConfirmPopover(value);
  };

  const _onReset = () => {
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
      {!!value ? (
        <ConfirmationPopover
          id={`reset-playground-${tabId}`}
          isOpen={isResetConfirmOpen}
          title={addNewQueryMessage}
          handler={
            <Button
              id={`confirm-popover-handler-reset-playground-${tabId}`}
              text="Reset"
              onClick={() =>
                isQueryDirty ? _toggleResetConfirmPopover(true) : _onReset()
              }
              disabled={!value ? true : false}
              secondary
              compact
              xs
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
      {!!value ? (
        <Button
          id={`prettify-${tabId}`}
          onClick={(_) => prettifyQuery(value)}
          disabled={!value ? true : false}
          text="Prettify"
          // tooltip={ getOS() === 'MacOS' ? 'shift + ⌘ + P' : 'shift + ctrl + P' } //todo: look thos type error
          secondary
          compact
          xs
        />
      ) : (
        ''
      )}
      {!!value && isQueryDirty ? (
        <Button
          id={`save-to-collection-${tabId}`}
          onClick={(_) => _onSaveToCollection()}
          text="Save to collection"
          disabled={!value ? true : false}
          secondary
          compact
          xs
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Controls;
