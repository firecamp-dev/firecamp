import { useState } from 'react';
import {
  Button,
 
  
  Dropdown,
  StatusBar,
  ToolBar
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';

import SavePlayground from './SavePlayground';
import EditPlaygroundName from './EditPlaygroundName';

import { useGraphQLStore } from '../../../../../store';
import { isValid } from '../../../../../services/GraphQLservice';

const ReqStatusBar = ({}) => {
  let {
    context,
    playground,
    playgroundMeta,
    undoPlaygroundChanges,
    updateItem,
    setPlaygroundOperation,
    execute,
  } = useGraphQLStore(
    (s: any) => ({
      context: s.context,
      playground: s.playgrounds[s.runtime.activePlayground],
      playgroundMeta: s.runtime.playgroundsMeta[s.runtime.activePlayground],
      undoPlaygroundChanges: s.undoPlaygroundChanges,
      updateItem: s.updateItem,
      setPlaygroundOperation: s.setPlaygroundOperation,
      execute: s.execute,
    }),
    shallow
  );
  const [isOpen, toggleOpen] = useState(false);

  const plgOperations = playgroundMeta.operationNames.map((n) => ({ name: n })); //[{ name: 'MyCompany', meta: { type: 'q' } }];
  const currentOps = playgroundMeta.activeOperation? { name: playgroundMeta.activeOperation }: plgOperations[0];

  const onSelectOperation = (operation: { name: string}) => {
    setPlaygroundOperation(operation.name, playground.request._meta.id);
  };

  const savePlg = async() => {
    const isQueryValid = await isValid(playground.request.body);
    if(isQueryValid == false) {
      context.appService.notify.alert("The playground query is not valid.")
      return;
    }
    execute(currentOps.name, playground.request.body, playground.request.meta.variables);
  };

  const _execute = async () => {
    const isQueryValid = await isValid(playground.request.body);
    console.log(isQueryValid, "isQueryValid...")
    if(isQueryValid == false) {
      context.appService.notify.alert("The playground query is not valid.")
      return;
    }
    execute(currentOps.name, playground.request.body, playground.request.meta.variables);
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
              { playgroundMeta.isSaved? <EditPlaygroundName/>: <></> }
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
            iconPosition="left"
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
                secondary
                xs
                ghost={true}
                transparent={true}
                className="!border-0 hover:!bg-focus2"
                onClick={() =>
                  undoPlaygroundChanges(playground.request?._meta.id)
                }
              />
              <Button
                text="Save changes"
                secondary
                xs
                ghost={true}
                transparent={true}
                className="!border-0 hover:!bg-focus2"
                onClick={updateItem}
              />
            </>
          ) : (
            <></>
          )}
          {!playgroundMeta.isSaved ? <SavePlayground isOpen={false} /> : <></>}
        </StatusBar.SecondaryRegion>
      </StatusBar>
    </>
  );
};

export default ReqStatusBar;
