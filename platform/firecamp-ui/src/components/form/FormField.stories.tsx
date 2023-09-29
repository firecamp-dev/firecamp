import { useState } from 'react';
import Button from '../buttons/Button';
import DropdownMenu from '../dropdown/DropdownMenu';
import Input from '../input/Input';
import FormField from './FormField';
import { IFormField } from './interfaces/FormField.interfaces';

export default {
  title: 'UI-Kit/FormField',
  component: FormField,
  argTypes: {
    label: 'Firecamp',
  },
};

const Template = (args: IFormField) => (
  <div className="bg-activityBar-background-active p-4 w-96">
    <FormField {...args} />
  </div>
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
    <DropdownMenu
      handler={() => (
        <Button
          id={'button'}
          text={selected}
          classNames={{ root: 'rounded p-2' }}
          tt={'uppercase'}
          transparent
          fullWidth
          xs
        />
      )}
      options={[
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
    />
  );
};
export const FromGroupDropdownDemo = Template.bind({});
FromGroupDropdownDemo.args = {
  label: 'Label',
  children: <DropdownElement />,
};
