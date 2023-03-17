import { FC } from 'react';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import {
  Resizable,
  Container,
  Notes,
  CopyButton,
  Button,
  PlainTable,
} from '@firecamp/ui';
import { useEnvStore, IEnvironmentStore } from '../../store/environment';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';

const EnvSidebar: FC<any> = ({ expanded }) => {
  const { activeEnv, globalEnv, toggleEnvSidebar } = useEnvStore(
    (s: IEnvironmentStore) => ({
      activeEnvId: s.activeEnvId,
      activeEnv: s.activeEnv,
      globalEnv: s.globalEnv,
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
            Variables Preview
          </div>
          <div
            className="ml-auto flex-none text-base flex justify-center items-center cursor-pointer"
            onClick={toggleEnvSidebar}
          >
            <VscClose size={16} />
          </div>
        </Container.Header>
        <Container.Body className="flex flex-col overflow-visible">
          <EnvPreviewTable
            name={activeEnv.name}
            variables={activeEnv.variables}
            title={'Active Environment'}
          />
          <EnvPreviewTable variables={globalEnv.variables} title={'Globals'} />
        </Container.Body>
        <Container.Footer className="text-sm">
          <Notes
            title="Use Variables to reuse values in Firecamp"
            description="use {{variable_name}} anywhere in the Firecamp to use its value"
          />
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

const EnvPreviewTable: FC<any> = ({ title, name, variables }) => {
  variables = variables.filter((v) => v.key); //only show those rows which has key
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="text-base px-2 py-1 font-bold border-b border-appBorder bg-focus2 flex items-center flex-row">
        {title}{' '}
        {name ? (
          <>
            : <span className="text-info">{name}</span>{' '}
          </>
        ) : (
          <></>
        )}
        <div className="flex items-center ml-auto">
          <Button text="Edit" secondary xs />
          <VscEdit className="table-action ml-2 cursor-pointer" />
        </div>
      </div>
      <div className="flex-1 overflow-auto visible-scrollbar">

        {variables.length > 0 && (
          <PlainTable
            columns={[
              { id: 'key', key: 'key', name: 'Variable Name', width: '120px' },
              {
                id: 'value',
                key: 'initialValue',
                name: 'Variable Value',
                width: '200px',
                resizeWithContainer: true,
              },
            ]}
            classes={{  table: '!m-0 !min-w-full' }}
            rows={variables}
            onChange={() => {}}
            onMount={() => {}}
          />
        )}
      </div>
    </div>
  );
};
