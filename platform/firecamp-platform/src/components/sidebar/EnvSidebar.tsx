import { FC, useState, useEffect } from 'react';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import { IoMdCopy } from '@react-icons/all-files/io/IoMdCopy';
import classnames from 'classnames';
import isEqual from 'react-fast-compare';
import shallow from 'zustand/shallow';
import {
  Resizable,
  Container,
  Editor,
  TabHeader,
  Button,
  Notes
} from '@firecamp/ui-kit';
import { EEditorLanguage } from '@firecamp/types';
import EnvironmentDD from '../common/environment/selector/EnvironmentDD';
import { useEnvStore, IEnvironmentStore } from '../../store/environment';
import platformContext from '../../services/platform-context';

const EnvSidebar: FC<any> = ({ expanded }) => {
  const { activeEnvId, toggleEnvSidebar } = useEnvStore(
    (s: IEnvironmentStore) => ({
      activeEnvId: s.activeEnvId,
      toggleEnvSidebar: s.toggleEnvSidebar,
    }),
    shallow
  );

  return (
    <Resizable
      width={'400'}
      height="100%"
      left={true}
      minWidth={'250'}
      maxWidth={'600'}
      className={classnames(
        '!absolute border-l border-appBorder bg-activityBarBackground top-0 right-0 bottom-0 z-30 expandable-right-pane',
        { expanded: expanded }
      )}
    >
      <Container>
        <Container.Header className="flex !p-2 bg-focus1">
          <div className="flex-1 mr-2 text-base p-2 font-bold">
            Variables
          </div>
          <div
            className="ml-auto flex-none text-base flex justify-center items-center cursor-pointer"
            onClick={toggleEnvSidebar}
          >
            <VscClose size={16} />
          </div>
        </Container.Header>
        <Container.Body className="flex flex-col">
          {/* {!!activeEnvId ? <EnvVarPreview /> : <></>} */}
          <div>
          <div className="flex-1 text-sm px-2 py-1 font-bold border-b border-appBorder">
          Active Environment
          </div>
          <div className="table text-sm border-collapse w-full m-3">
            <div className="table-row">
              <label className="px-3 py-1 table-cell border border-appBorder" >
                <div className="flex items-center"> <span>airtable_base</span>
                <IoMdCopy className="table-action ml-2 cursor-pointer" />
              </div>
              </label>
              <span className="px-3 py-1 text-appForegroundInActive table-cell border border-appBorder">add your airtable base</span>
            </div>
            <div className="table-row">
              <label className="px-3 py-1 table-cell border border-appBorder">
              <div className="flex items-center"> <span>airtable_key</span>
                <IoMdCopy className="table-action ml-2 cursor-pointer" />
                </div>
              </label>
              <span className="px-3 py-1 text-appForegroundInActive table-cell border border-appBorder">add your airtable key</span>
            </div>
            <div className="table-row">
              <label className="px-3 py-1 table-cell border border-appBorder">
              <div className="flex items-center"> <span>airtable_token</span>
                <IoMdCopy className="table-action ml-2 cursor-pointer" />
                </div>
                </label>
              <span className="px-3 py-1 text-appForegroundInActive table-cell border border-appBorder" >add your airtable token</span>
            </div>
          </div>
          </div>
          <div>
          <div className="flex-1 text-sm px-2 py-1 font-bold border-b border-appBorder">
          Global Variables
          </div>
          <div className="table text-sm border-collapse w-full m-3">
            <div className="table-row">
              <label className="px-3 py-1 table-cell border border-appBorder" >
                <div className="flex items-center"> <span>airtable_base</span>
                <IoMdCopy className="table-action ml-2 cursor-pointer" />
              </div>
              </label>
              <span className="px-3 py-1 text-appForegroundInActive table-cell border border-appBorder">add your airtable base</span>
            </div>
            <div className="table-row">
              <label className="px-3 py-1 table-cell border border-appBorder">
              <div className="flex items-center"> <span>airtable_key</span>
                <IoMdCopy className="table-action ml-2 cursor-pointer" />
                </div>
              </label>
              <span className="px-3 py-1 text-appForegroundInActive table-cell border border-appBorder">add your airtable key</span>
            </div>
            <div className="table-row">
              <label className="px-3 py-1 table-cell border border-appBorder">
              <div className="flex items-center"> <span>airtable_token</span>
                <IoMdCopy className="table-action ml-2 cursor-pointer" />
                </div>
                </label>
              <span className="px-3 py-1 text-appForegroundInActive table-cell border border-appBorder" >add your airtable token</span>
            </div>
          </div>
          </div>
        </Container.Body>
        <Container.Footer className="text-sm">
          <Notes title="Use Variables to reuse values and protect sensitive data" description="Store sensitive data in variable type secret to keep its values masked on the screens. Work with current value of variable to prevent sharing sensitive values with your team" />
        </Container.Footer>
      </Container>
    </Resizable>
  );
};

const EnvSidebarContainer = () => {
  const { isEnvSidebarOpen } = useEnvStore(
    (s: IEnvironmentStore) => ({
      isEnvSidebarOpen: s.isEnvSidebarOpen,
    }),
    shallow
  );
  if (!isEnvSidebarOpen) return <></>;
  return <EnvSidebar expanded={isEnvSidebarOpen} />;
};
export { EnvSidebar, EnvSidebarContainer };

const EnvVarPreview = () => {
  const { activeEnvId, environments, updateEnvironment, setActiveEnv } =
    useEnvStore(
      (s) => ({
        activeEnvId: s.activeEnvId,
        environments: s.environments,
        updateEnvironment: s.updateEnvironment,
        setActiveEnv: s.setActiveEnv,
      }),
      shallow
    );
  const [variables, setVariables] = useState<string>('');
  const [isVarUpdated, setIsVarUpdated] = useState<boolean>(false);

  /** if variables changed then show save/undo buttons */
  useEffect(() => {
    try {
      const vars = JSON.parse(variables || '{}');
      // const _isEqual = isEqual(vars, activeEnvironment.variables);
      // setIsVarUpdated(!_isEqual);
    } catch (e) {
      console.log({ e });
    }
  }, [variables, environments]);

  const onChangeVariable = (variables: string) => {
    setVariables(variables); // even if the payload is not a JSON, still it needs to be render in Editor
  };

  const onUndoChanges = () => {
    // let variablesString = JSON.stringify(
    //   activeEnvironment.variables || [],
    //   null,
    //   2
    // );
    // setVariables(variablesString);
  };

  const onUpdate = async () => {
    let vars = {};
    try {
      vars = JSON.parse(variables);
    } catch (e) {
      platformContext.app.notify.alert('The variables are not valid JSON.');
    }

    /** update env vars */
    await updateEnvironment(activeEnvId, { variables: vars });
    setIsVarUpdated(false);

    // get environment changes and emit to request tab
    // pltContext.environment.setVarsToProvidersAndEmitEnvsToTa();
  };

  const _setActiveEnv = (envId) => {
    setActiveEnv(envId);
    // get environment changes and emit to request tab
    // pltContext.environment.setVarsToProvidersAndEmitEnvsToTa();
  };

  return (
    <div className="flex-1">
      <div className="border-b border-t border-appBorder flex">
        <TabHeader className="height-ex-small">
          <TabHeader.Left className="text-base font-normal">
            Environments
          </TabHeader.Left>
          <TabHeader.Right className="env-popover-nested">
            <EnvironmentDD
              key={`env-dd-${activeEnvId}`}
              onChange={_setActiveEnv}
            />
          </TabHeader.Right>
        </TabHeader>
      </div>
      <div style={{ height: 'calc(50vh - 100px)' }}>
        <Editor
          autoFocus={true}
          language={EEditorLanguage.Json}
          value={variables}
          placeholder="{ variableKey: variableValue}"
          onChange={(e) => {
            onChangeVariable(e.target.value);
          }}
          onCtrlS={onUpdate}
          monacoOptions={{
            wordWrap: 'off',
          }}
        />
      </div>

      <div>
        {isVarUpdated === true ? (
          <TabHeader>
            <TabHeader.Right>
              <Button
                text={'Undo Changes'}
                onClick={onUndoChanges}
                disabled={!isVarUpdated}
                primary
                transparent
                sm
              />
              <Button
                text={'Update'}
                onClick={onUpdate}
                disabled={!isVarUpdated}
                primary
                sm
              />
            </TabHeader.Right>
          </TabHeader>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
