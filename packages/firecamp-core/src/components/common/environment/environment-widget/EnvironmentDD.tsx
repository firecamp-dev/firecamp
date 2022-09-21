import { FC, useState, useMemo } from 'react';
import { Dropdown, Button,  } from '@firecamp/ui-kit';
import classnames from 'classnames';
import { EEnvironmentScope, TId } from '@firecamp/types';

import Helper from './Helper';

const EnvironmentDD: FC<IEnvironmentDD> = ({
  collectionId = '',
  activeEnv: propActiveEnv = '',
  environments,
  scope = EEnvironmentScope.Workspace,
  onChange = () => {},
  showFooter = true,
}) => {
  let [isOpen, toggleOpen] = useState(false);

  let menu = useMemo(
    () => Helper.generate.environmentsDD(environments, propActiveEnv),
    [environments, propActiveEnv, collectionId]
  );

  if (
    !menu.options ||
    !menu.options.length ||
    !menu.selected ||
    !Object.keys(menu.selected).length
  ) {
    return <span />;
  }

  let _onSelectEnv = (env: { id: string }) => {
    //    console.log({ env });

    if (env === menu.selected) return;
    if (env && env.id) {
      onChange(env.id);
    }
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
        //   F.appStore.environment.update.activeProject(collectionId);
        //   F.ModalService.open(
        //     EModals.PROJECT_SETTING,
        //     ECollectionSettingTabs.ENVIRONMENT,
        //     { collectionId }
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
      <Dropdown.Handler>
        <Button
          text={menu?.selected?.name || ''}
          xs
          transparent={true}
          ghost={true}
          className={classnames(
            { '!text-primaryColor': scope === EEnvironmentScope.Workspace },
            { '!text-info': scope === EEnvironmentScope.Collection }
          )}
          withCaret={true}
        />
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

export default EnvironmentDD;

/**
 * Workspace environments
 * Update active environment for workspace
 */
interface IEnvironmentDD {
  collectionId?: TId;
  activeEnv: string;

  environments: any[];

  scope: EEnvironmentScope;

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
