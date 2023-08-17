import { useState } from 'react';
import Checkbox2, { ICheckbox } from './Checkbox2';

export default {
  title: 'UI-Kit/Checkbox2',
  component: Checkbox2,
};

const Template = ({ checked, ...args }: ICheckbox) => {
  const [isChecked, updateChecked] = useState(checked);
  return (
    <Checkbox2
      checked={isChecked}
      {...args}
      onToggleCheck={(l, v) => {
        updateChecked(v);
      }}
    />
  );
};
export const PossiblePrimaryStates = () => {
  return (
    <div className="flex flex-col">
      <Checkbox2 classNames={{ body: 'p-1' }} label="Unchecked State" />
      <Checkbox2 classNames={{ body: 'p-1' }} label="Checked State" checked />
      <Checkbox2
        classNames={{ body: 'p-1' }}
        label="Disabled Unchecked State"
        disabled
      />
      <Checkbox2
        classNames={{ body: 'p-1' }}
        label="Disabled Checked State"
        checked
        disabled
      />
    </div>
  );
};
export const PossibleSecondaryStates = () => {
  return (
    <div className="flex flex-col">
      <Checkbox2
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Unchecked State"
      />
      <Checkbox2
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Checked State"
        checked
      />
      <Checkbox2
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Disabled Unchecked State"
        disabled
      />
      <Checkbox2
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Disabled Checked State"
        checked
        disabled
      />
    </div>
  );
};
export const LabelPlacement = () => {
  return (
    <div className="flex flex-col">
      <Checkbox2
        classNames={{ body: 'p-1' }}
        labelPosition="right"
        label="Right Side State (default)"
      />
      <Checkbox2
        classNames={{ body: 'p-1' }}
        labelPosition="left"
        label="Left Side State"
      />
    </div>
  );
};
export const LabelVisibility = () => {
  return (
    <div className="flex flex-col">
      <Checkbox2 classNames={{ body: 'p-1' }} label="Label Visible" />
      <Checkbox2
        classNames={{ body: 'p-1' }}
        label="Label Hidden"
        showLabel={false}
      />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'CheckBox Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'CheckBox Secondary',
  primary: false,
};
