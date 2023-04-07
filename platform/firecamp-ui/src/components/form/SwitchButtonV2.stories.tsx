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
    <SwitchButtonV2
      {...args}
      checked={isChecked}
      onChange={(value) => updateChecked(value)}
    />
  );
};

export const SwitchButtonDemo = Template.bind({});
SwitchButtonDemo.args = {
  checked: true,
  md: true,
};
export const SwitchButtonSizes = () => (
  <div className="flex flex-col gap-2">
    <div>
      <Template xs checked={false} onChange={(value) => {}} />
      <Template xs checked={true} onChange={(value) => {}} />
    </div>
    <div>
      <Template sm checked={false} onChange={(value) => {}} />
      <Template sm checked={true} onChange={(value) => {}} />
    </div>
    <div>
      <Template md checked={false} onChange={(value) => {}} />
      <Template md checked={true} onChange={(value) => {}} />
    </div>
    <div>
      <Template lg checked={false} onChange={(value) => {}} />
      <Template lg checked={true} onChange={(value) => {}} />
    </div>
  </div>
);
