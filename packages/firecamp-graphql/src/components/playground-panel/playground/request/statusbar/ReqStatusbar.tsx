import { useState } from 'react';
import shallow from 'zustand/shallow';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { Button, Dropdown, StatusBar, ToolBar } from '@firecamp/ui-kit';
import EditPlaygroundName from './EditPlaygroundName';
import { IStore, useStore } from '../../../../../store';
import { isValid } from '../../../../../services/GraphQLservice';

const ReqStatusBar = ({}) => {
  const {
    context,
    isRequestSaved,
    playground,
    playgroundMeta,
    undoPlaygroundChanges,
    updateItem,
    setPlaygroundOperation,
    execute,
    getPlgNameSuggestion,
    savePlg,
  } = useStore(
    (s: IStore) => ({
      context: s.context,
      isRequestSaved: s.runtime.isRequestSaved,
      playground: s.playgrounds[s.runtime.activePlayground],
      playgroundMeta: s.runtime.playgroundsMeta[s.runtime.activePlayground],
      undoPlaygroundChanges: s.undoPlaygroundChanges,
      updateItem: s.updateItem,
      setPlaygroundOperation: s.setPlaygroundOperation,
      execute: s.execute,
      getPlgNameSuggestion: s.prepareRuntimeActivePlgName,
      savePlg: s.addItem,
    }),
    shallow
  );
  const [isOpen, toggleOpen] = useState(false);

  const plgOperations = playgroundMeta.operationNames.map((n) => ({ name: n })); //[{ name: 'MyCompany', __meta: { type: 'q' } }];
  const currentOps = playgroundMeta.activeOperation
    ? { name: playgroundMeta.activeOperation }
    : plgOperations[0];

  const onSelectOperation = (operation: { name: string }) => {
    setPlaygroundOperation(operation.name, playground.request.__ref.id);
  };

  const _savePlg = async () => {
    if (!isRequestSaved) {
      context.app.notify.info('Please save the graphql request first.');
      return;
    }
    const isQueryValid = await isValid(playground.request.body);
    if (isQueryValid == false) {
      context.app.notify.alert('The playground query is not valid.');
      return;
    }
    const plgName = getPlgNameSuggestion();
    context.window
      .promptInput({
        header: 'SAVE PLAYGROUND',
        value: plgName,
        validator: (value) => {
          const name = value.trim();
          if (!name) {
            return {
              isValid: false,
              message: 'The playground name is reuquired',
            };
          } else if (name?.length <= 3) {
            return {
              isValid: false,
              message: 'The playground name must have minimum 3 characters',
            };
          } else {
            return { isValid: true, message: '' };
          }
        },
        executor: (plgName) => {
          return savePlg(plgName);
        },
      })
      .then((res) => {
        // console.log(res)
      });
  };

  const _execute = async () => {
    const isQueryValid = await isValid(playground.request.body);
    console.log(isQueryValid, 'isQueryValid...');
    if (isQueryValid == false) {
      context.app.notify.alert('The playground query is not valid.');
      return;
    }
    execute(
      currentOps.name,
      playground.request.body,
      playground.request.__meta.variables
    );
  };

  return (
    <>
      <StatusBar className="fc-statusbar large">
        {/* <StatusBar.PrimaryRegion> */}
        <div className="flex items-center whitespace-pre overflow-hidden overflow-ellipsis text-appForegroundInActive">
          {/* root */}
          {/* <VscChevronRight /> */}
          ./{playground.request.name}
          <ToolBar className="ml-2 visible">
            {playgroundMeta.isSaved ? <EditPlaygroundName /> : <></>}
          </ToolBar>
        </div>
        <div className="flex ml-auto mr-1">
          <Dropdown isOpen={isOpen} detach={false} onToggle={toggleOpen}>
            <Dropdown.Handler>
              <Button
                text={currentOps?.name || ''}
                xs
                secondary
                withCaret={true}
                className="!rounded-br-none !rounded-tr-none"
              />
            </Dropdown.Handler>
            <Dropdown.Options
              options={plgOperations || []}
              // displayKey="name"
              className={'without-arrow width-full bg-appBackground2'}
              emptyMessage="No queries"
              onSelect={onSelectOperation}
            ></Dropdown.Options>
          </Dropdown>
          <Button
            text=""
            primary
            sm
            // TODO: add class opacity and square
            icon={<IoSendSharp />}
            iconLeft
            onClick={_execute}
            className="!rounded-bl-none !rounded-tl-none"
            // disabled={_object.isEmpty(getPlaygroundQueries())}
          />
        </div>
        {/* </StatusBar.PrimaryRegion> */}
      </StatusBar>

      <StatusBar className="pr-1">
        <StatusBar.SecondaryRegion>
          {playgroundMeta.hasChange && playgroundMeta.isSaved ? (
            <>
              <Button
                text="Undo changes"
                className="!border-0 hover:!bg-focus2"
                onClick={() =>
                  undoPlaygroundChanges(playground.request?.__ref.id)
                }
                secondary
                transparent
                ghost
                xs
              />
              <Button
                text="Save changes"
                className="!border-0 hover:!bg-focus2"
                onClick={updateItem}
                secondary
                transparent
                ghost
                xs
              />
            </>
          ) : (
            <></>
          )}
          {!playgroundMeta.isSaved ? (
            <Button
              text="Save playground"
              className="!border-0 hover:!bg-focus2"
              onClick={_savePlg}
              transparent
              secondary
              ghost
              xs
            />
          ) : (
            <></>
          )}
        </StatusBar.SecondaryRegion>
      </StatusBar>
    </>
  );
};

export default ReqStatusBar;
