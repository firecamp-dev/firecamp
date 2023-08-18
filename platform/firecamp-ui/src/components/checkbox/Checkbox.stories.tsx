import { useState } from 'react';
import Checkbox, { ICheckbox } from './Checkbox';

export default {
  title: 'UI-Kit/Checkbox',
  component: Checkbox,
};

const Template = ({ checked, ...args }: ICheckbox) => {
  const [isChecked, updateChecked] = useState(checked);
  return (
    <Checkbox
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
      <Checkbox classNames={{ body: 'p-1' }} label="Unchecked State" />
      <Checkbox classNames={{ body: 'p-1' }} label="Checked State" checked />
      <Checkbox
        classNames={{ body: 'p-1' }}
        label="Disabled Unchecked State"
        disabled
      />
      <Checkbox
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
      <Checkbox
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Unchecked State"
      />
      <Checkbox
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Checked State"
        checked
      />
      <Checkbox
        primary={false}
        classNames={{ body: 'p-1' }}
        label="Disabled Unchecked State"
        disabled
      />
      <Checkbox
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
      <Checkbox
        classNames={{ body: 'p-1' }}
        labelPosition="right"
        label="Right Side State (default)"
      />
      <Checkbox
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
      <Checkbox classNames={{ body: 'p-1' }} label="Label Visible" />
      <Checkbox
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
