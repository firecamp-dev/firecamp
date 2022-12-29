import { useEffect, useState } from 'react';
import {
  Button,
  ConfirmationPopover,
} from '@firecamp/ui-kit';

const Controls = ({ isQueryDirty, toggleQueryDirty }) => {
  //todo: need to refactor
  const tabId = 123; // todo: this will be received from tab __meta
  const body = '';
  const prettifyQuery = (_) => {};
  const getOS = () => 'MacOS';

  const resetQuery = () => {};
  const onSaveQueriesToCollection = () => {};

  const [addNewQueryMessage, setAddNewQueryMessage] = useState('');
  const [isResetConfirmOpen, toggleResetConfirmPopover] = useState(false);

  const _setNewQueryMessage = () => {
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
      {!!body ? (
        <ConfirmationPopover
          id={`reset-playground-${tabId}`}
          isOpen={isResetConfirmOpen}
          title={addNewQueryMessage}
          handler={
            <Button
              id={`confirm-popover-handler-reset-playground-${tabId}`}
              secondary
              sm // TODO: add class for exsmall
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
          secondary
          sm // TODO: add class for exsmall
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
          secondary
          sm // TODO: add class for exsmall
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
