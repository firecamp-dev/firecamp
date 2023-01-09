import { FC, useState, useMemo } from 'react';
import classnames from 'classnames';
import { Dropdown, Button } from '@firecamp/ui-kit';
import { EEnvironmentScope, TId } from '@firecamp/types';
import Helper from './Helper';
import { useWorkspaceStore } from '../../../../store/workspace';

const EnvironmentDD: FC<IEnvironmentDD> = ({
  activeCollectionId,
  activeEnvId,
  environments,
  scope = EEnvironmentScope.Collection,
  onChange = () => {},
  showFooter = true,
}) => {
  const [isOpen, toggleOpen] = useState(false);
  const menu = useMemo(
    () => Helper.generate.environmentsDD(environments, activeEnvId),
    [environments, activeEnvId]
  );
  console.log(menu, 778899)
  const collection = useMemo(() => {
    const wStore = useWorkspaceStore.getState();
    return wStore.explorer.collections.find(
      (c) => c.__ref.id == activeCollectionId
    );
  }, [activeCollectionId]);

  if (
    !menu.options ||
    !menu.options.length ||
    !menu.selected ||
    !Object.keys(menu.selected).length
  ) {
    return <span />;
  }

  const _onSelectEnv = (env: { id: string }) => {
    //    console.log({ env });

    if (env === menu.selected) return;
    if (env && env.id) {
      onChange(env.id);
    }
  };

  const options = [
    {
      header:
        scope === EEnvironmentScope.Collection ? 'Collection Environment' : '',
      list: menu.options,
    }
  ];

  if (!collection || !menu?.selected) return <></>;
  const title = `${collection.name} / ${menu.selected.name}`;

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
          text={title}
          className={classnames(
            { '!text-primaryColor': scope === EEnvironmentScope.Workspace },
            { '!text-info': scope === EEnvironmentScope.Collection }
          )}
          withCaret
          transparent
          ghost
          xs
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

interface IEnvironmentDD {
  activeCollectionId: TId;
  activeEnvId: TId;
  environments: any[];
  scope?: EEnvironmentScope;

  /**
   * update action and payload
   */
  //TODO: add and import interface from zustand store
  onChange: (envId: string) => void;
  /**
   * whether want to show footer or not.
   * footer contains menu to open environment modal
   */
  showFooter?: boolean;
}
