import { FC, useState, useMemo, useEffect, memo } from 'react';
import isEqual from 'react-fast-compare';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { Dropdown, Button } from '@firecamp/ui';
import { TId } from '@firecamp/types';
import Helper from './Helper';
import { useEnvStore } from '../../../../store/environment';
import platformContext from '../../../../services/platform-context';

const EnvironmentDD: FC<IEnvironmentDD> = ({ onChange = () => {} }) => {
  const { environments, activeEnvId } = useEnvStore(
    (s) => ({
      environments: s.environments,
      activeEnvId: s.activeEnvId,
    }),
    shallow
  );
  const { createEnvironmentPrompt } = platformContext.platform;
  useEffect(() => {
    // console.log('env selector rendering the first time');
  }, []);
  const [isOpen, toggleOpen] = useState(false);
  const menu = useMemo(
    () => Helper.generate.environmentsDD(environments, activeEnvId),
    [environments, activeEnvId]
  );
  // console.log(menu, 778899);

  const _onSelectEnv = (env: { id: string }) => {
    console.log({ env });
    if (env === menu.selected) return;
    if (env.id == 'fc-new-environment') {
      createEnvironmentPrompt();
    } else {
      onChange(env.id);
    }
  };

  const options = [
    {
      header: 'Select Environment',
      list: menu.options,
    },
    {
      header: 'Create New',
      list: [{ id: 'fc-new-environment', name: 'Create New Environment' }],
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
          className={cx(
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
export default memo(EnvironmentDD, (n, p) => !isEqual(n, p));

interface IEnvironmentDD {
  onChange: (envId: TId) => void;
}
