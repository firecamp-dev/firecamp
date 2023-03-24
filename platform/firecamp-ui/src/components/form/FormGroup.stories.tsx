import { useState } from 'react';
import Button from '../buttons/Button';
import DropDownV2 from '../dropdown/DropdownV2';
import Input from '../input/Input';
import FormGroup from './FormGroup';
import { IFormGroup } from './interfaces/FormGroup.interfaces';
import { IFormGroup } from './interfaces/FormGroup.interfaces';

export default {
  title: 'UI-Kit/FormGroup',
  component: FormGroup,
  argTypes: {
    label: 'Firecamp',
  },
  title: 'UI-Kit/FormGroup',
  component: FormGroup,
  argTypes: {
    label: 'Firecamp',
  },
};

const Template = (args: IFormGroup: IFormGroup) => (
  (
  <div className="bg-activityBarActiveBackground p-4 w-96">
    
    <FormGroup {...args} />
  
  </div>
)
);

export const InputDemo = Template.bind({});
InputDemo.args = {
  label: 'Label',
  children: [<Input placeholder="Sample Input" />],
};

export const FromGroupCheckBoxDemo = Template.bind({});
FromGroupCheckBoxDemo.args = {
  label: 'Label',
  children: [<Input placeholder="Sample Input" />],
};

const DropdownElement = () => {
  const [selected, setSelected] = useState('API style');

  return (
    <DropDownV2
      displayDefaultOptionClassName={1}
      handleRenderer={() => (
        <Button
          id={'button'}
          text={selected}
          transparent
          sm
          className="rounded p-2"
          uppercase={true}
          withCaret={true}
          fullWidth
        />
      )}
      option={[
        {
          id: '1',
          name: 'Rest',
        },
        {
          id: '2',
          name: 'GraphQL',
        },
        {
          id: '3',
          name: 'Socket.io',
        },
        {
          id: '4',
          name: 'Websocket',
        },
      ]}
      onSelect={(value) => setSelected(value.name)}
      optionContainerClassName={'ml-2'}
      showOptionArrow={true}
    />
  );
};
export const FromGroupDropdownDemo = Template.bind({});
FromGroupDropdownDemo.args = {
  label: 'Label',
  children: <DropdownElement />,
};
