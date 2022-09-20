import { FC, useCallback, useState } from 'react';
import { Dropdown } from '@firecamp/ui-kit';
import { EEnvironmentScope, TId } from '@firecamp/types';
import classnames from 'classnames';
import Helper from './Helper';

const WorkspaceEnvDD: FC<IWorkspaceEnvDD> = ({
  id = '',
  activeEnv: propActiveEnv = '',
  environments,
  scope = EEnvironmentScope.Workspace,
  // envVariableProvider = {},
  onChange = () => {},
  showFooter = true,
}) => {
  let [isOpen, toggleOpen] = useState(false);

  let [menu, setMenu] = useState(
    useCallback(
      () => Helper.generate.environmentsDD(environments, propActiveEnv),
      [environments, propActiveEnv]
    )
  );

  // console.log(menu);

  if (
    !menu.options ||
    !menu.options.length ||
    !menu.selected ||
    !Object.keys(menu.selected).length
  ) {
    return <span />;
  }

  let _onSelectEnv = (env: { id: string }) => {
    if (env === menu.selected) return;
    if (env && env.id) {
      // console.log({ env });

      // envVariableProvider.setDefaultEnvironment('global', env.id);
      onChange(env.id);
    }
    setMenu((ps) => {
      return {
        ...ps,
        selected: env,
      };
    });
  };

  let options = [
    {
      header:
        scope === EEnvironmentScope.Workspace
          ? 'Workspace Environment'
          : 'Collection Environment',
      list: menu.options,
    },
    {
      name:
        scope === EEnvironmentScope.Workspace
          ? 'Manage Workspace Environment'
          : 'Manage Collection Environment',
      onClick: () => {
        // if (scope === EEnvironmentScope.Workspace) {
        //   F.appStore.environment.update.activeProject('global');
        //   F.ModalService.open(
        //     EModals.WORKSPACE_SETTING,
        //     EWorkspaceSettingTabs.ENVIRONMENT
        //   );
        // } else {
        //   F.appStore.environment.update.activeProject(id);
        //   F.ModalService.open(
        //     EModals.PROJECT_SETTING,
        //     ECollectionSettingTabs.ENVIRONMENT,
        //     { id }
        //   );
        // }
      },
    },
  ];

  return (
    <Dropdown
      detach={false}
      isOpen={isOpen}
      onToggle={() => {
        toggleOpen(!isOpen);
      }}
      selected={menu?.selected?.name || ''}
    >
      <Dropdown.Handler
        className={classnames(
          { 'without-border global-snippet sm': showFooter },
          'cursor-pointer font-ex-bold transparent small with-caret-v2 without-border font-sm btn-sky fc-button select-box-title'
        )}
      >
        {menu?.selected?.name || ''}
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        onSelect={_onSelectEnv}
        headerMeta={{ applyUpperCase: true }}
        hasDivider={true}
        className="type-1"
      />
    </Dropdown>
  );
};

export default WorkspaceEnvDD;

/**
 * Workspace environments
 * Update active environment for workspace
 */
interface IWorkspaceEnvDD {
  id: TId;
  activeEnv: string;

  environments: any[];

  scope: EEnvironmentScope;

  // envVariableProvider: any //TODO: add interface
  /**
   * Update action and payload
   */
  //TODO: add and import interface from zustand store
  onChange: (envId: string) => void;
  /**
   * Boolean value whether want to show footer or not.
   * Footer contains menu to open environment modal
   */
  showFooter?: boolean;
}
