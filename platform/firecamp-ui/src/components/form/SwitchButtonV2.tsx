import { FC } from 'react';
import cx from 'classnames';
import * as Switch from '@radix-ui/react-switch';
import { ISwitchButton } from './interfaces/SwitchButtonV2.interfaces';

const SwitchButtonV2: FC<ISwitchButton> = ({
  id,
  checked,
  onChange,
  xs,
  md,
  sm,
  lg,
  className
}) => {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cx(
        'rounded-2xl bg-appForeground shadow-md',
        { 'w-5 h-[10px]': xs },
        { 'w-10 h-5': sm },
        { 'w-[60px] h-[30px]': md },
        { 'w-20 h-10': lg },
        className
      )}
      id={id}
    >
      <Switch.Thumb
        className={cx(
          'block bg-appBackground rounded-2xl  duration-100	',
          { 'w-2 h-2': xs },
          { 'w-4 h-4': sm },
          { 'h-6 w-6': md },
          { 'h-8 w-8': lg }
        )}
        style={{
          transform: checked ? 'translateX(130%)' : 'translateX(20%)',
        }}
      />
    </Switch.Root>
  );
};
export default SwitchButtonV2;
