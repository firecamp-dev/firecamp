import { FC, useState, useMemo } from 'react';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import { Dropdown, Button } from '@firecamp/ui-kit';
import { TId } from '@firecamp/types';
import Helper from './Helper';
import { useEnvStore } from '../../../../store/environment';

const EnvironmentDD: FC<IEnvironmentDD> = ({
  onChange = () => {},
  showFooter = true,
}) => {
  const { environments, activeEnvId } = useEnvStore(
    (s) => ({
      environments: s.environments,
      activeEnvId: s.activeEnvId,
    }),
    shallow
  );
  const [isOpen, toggleOpen] = useState(false);
  const menu = useMemo(
    () => Helper.generate.environmentsDD(environments, activeEnvId),
    [environments, activeEnvId]
  );
  console.log(menu, 778899);

  const _onSelectEnv = (env: { id: string }) => {
    //    console.log({ env });
    if (env === menu.selected) return;
    if (env && env.id) {
      onChange(env.id);
    }
  };

  const options = [
    {
      header: 'Environments',
      list: menu.options,
    },
  ];

  if (!menu?.selected) return <></>;
  const title = `${menu.selected.name}`;

  return (
    <Dropdown
      detach={false}
      isOpen={isOpen}
      onToggle={() => toggleOpen(!isOpen)}
      selected={menu?.selected?.name || ''}
    >
      <Dropdown.Handler>
        <Button
          text={title}
          className={classnames(
            // { '!text-primaryColor': true }
            { '!text-info': true }
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
  /** update action and payload */
  //TODO: add and import interface from zustand store
  onChange: (envId: string) => void;

  /**
   * whether want to show footer or not.
   * footer contains menu to open environment modal
   */
  showFooter?: boolean;
}
