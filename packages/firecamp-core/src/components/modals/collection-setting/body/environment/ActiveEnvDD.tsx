// @ts-nocheck
import { FC, useState, useEffect } from 'react';

import { Dropdown, Button, EButtonColor, EButtonSize } from '@firecamp/ui-kit';
const ActiveEnvDD: FC<IActiveEnvDD> = ({
  environments = [],
  activeEnv = '',
  onSelect = () => {},
}) => {
  let [selected, setSelected] = useState(
    environments.find((env) => env?._meta?.id === activeEnv)
  );

  useEffect(() => {
    let selectedOpt = environments.find(
      (env) => env?._meta?.id === activeEnv
    ) || {
      name: environments?.[0]?.name || '',
      id: environments?.[0]?._meta?.id || '',
    };
    if (selectedOpt !== selected) {
      setSelected(selectedOpt);
    }
  }, [activeEnv, environments]);

  return (
    <Dropdown selected={selected}>
      <Dropdown.Handler
        className={`fc-dropdown-toggle fullwidth with-caret-v2 solid`}
      >
        <Button
          text={selected?.['name'] || ''}
          size={EButtonSize.Small}
          withCaret={true}
        />
      </Dropdown.Handler>
      <Dropdown.Options
        className={'width-full bg-appBackground2'}
        options={environments.map((env) => {
          return { name: env.name, id: env?._meta?.id };
        })}
        onSelect={(env) => {
          setSelected(env);
          onSelect(env);
        }}
      />
    </Dropdown>
  );
};

export default ActiveEnvDD;

interface IActiveEnvDD {
  environments: any[]; //todo: define a proper type here
  activeEnv: string;
  onSelect: Function;
}
