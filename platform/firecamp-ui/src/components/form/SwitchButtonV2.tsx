import { FC } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { ISwitchButton } from './interfaces/SwitchButtonV2.interfaces';

const SwitchButtonV2: FC<ISwitchButton> = ({ id, checked, onChange }) => {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      className="rounded-2xl w-12 h-7 bg-appForeground shadow-md"
      id={id}
    >
      <Switch.Thumb
        className={'block bg-appBackground rounded-2xl h-5 w-5 duration-100	'}
        style={{
          transform: checked ? 'translateX(25px)' : 'translateX(5px)',
        }}
      />
    </Switch.Root>
  );
};
export default SwitchButtonV2;
