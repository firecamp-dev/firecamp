import { useState } from 'react';
import { ISwitchButton } from './interfaces/SwitchButtonV2.interfaces';
import SwitchButtonV2 from './SwitchButtonV2';

export default {
  title: 'UI-Kit/FormElement/SwitchButtonV2',
  component: SwitchButtonV2,
};

const Template = ({ checked, ...args }: ISwitchButton) => {
  const [isChecked, updateChecked] = useState(checked);
  return (
    <div className="bg-activityBarActiveBackground p-4 flex items-center">
      <label className="mr-4">Switch component</label>
      <SwitchButtonV2
        {...args}
        checked={isChecked}
        onChange={(value) => updateChecked(value)}
      />
    </div>
  );
};

export const SwitchButtonV2Demo = Template.bind({});
SwitchButtonV2Demo.args = {
  checked: true,
};
