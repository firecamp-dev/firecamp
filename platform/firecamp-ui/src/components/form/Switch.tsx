import { FC } from 'react';
import cx from 'classnames';
import {
  Switch as MantineSwitch,
  SwitchProps,
  PartialVarsResolver,
  SwitchFactory,
} from '@mantine/core';

export interface ISwitch extends SwitchProps {
  onToggleCheck: (v: boolean) => void;
}

const varsResolver: PartialVarsResolver<SwitchFactory> = (theme, props) => {
  if (props.size === 'xxs') {
    return {
      root: {
        '--switch-height': '10px',
        '--switch-width': '20px',
        '--switch-thumb-size': '6px',
        '--switch-track-label-padding': '2px',
        '--switch-label-font-size': '10px',
      },
    };
  }

  return { root: {} };
};
const Switch: FC<ISwitch> = ({ classNames = {}, onToggleCheck, ...props }) => {
  return (
    <MantineSwitch
      radius={'lg'}
      onChange={(e) => onToggleCheck(e.target.checked)}
      vars={varsResolver}
      classNames={{
        ...classNames,
        labelWrapper: cx(classNames.labelWrapper),
        thumb: cx('bg-app-background !border-app-background', classNames.thumb),
        input: cx('peer', classNames.input),
        track: cx(
          'bg-app-foreground border-app-foreground shadow-md peer-checked:bg-primaryColor peer-checked:border-primaryColor',
          classNames.track
        ),
        trackLabel: cx(classNames.trackLabel),
      }}
      data-testid="switch"
      {...props}
    />
  );
};

export default Switch;
