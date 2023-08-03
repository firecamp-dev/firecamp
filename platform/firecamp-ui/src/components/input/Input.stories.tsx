import { VscMenu } from '@react-icons/all-files/vsc/VscMenu';
import { useForm } from '@mantine/form';
import { Button, Input } from '@firecamp/ui';
import { IInput } from './interfaces/input.interfaces';

export default {
  title: 'UI-Kit/Input',
  component: Input,
  argTypes: {
    placeholder: 'Firecamp',
    value: 'Firecamp value',
  },
};

const Template = (args: IInput) => (
  <div className="p-4">
    <Input {...args} />
  </div>
);

export const InputDemo = Template.bind({});
InputDemo.args = { placeholder: 'Sample Button', value: '' };

export const withIcon = Template.bind({});
withIcon.args = {
  placeholder: 'Sample Button',
  value: '',
  icon: <VscMenu title="Account" size={16} />,
};

export const withIconRight = Template.bind({});
withIconRight.args = {
  placeholder: 'Sample Button',
  value: '',
  rightSection: <VscMenu title="Account" size={16} />,
};

export const withText = Template.bind({});
withText.args = {
  placeholder: 'Sample Button',
  value: 'Sample Text',
  rightSection: <VscMenu title="Account" size={16} />,
};

export const withErrorText = Template.bind({});
withErrorText.args = {
  placeholder: 'Sample Button',
  defaultValue: 'Sample Text',
  rightSection: <VscMenu title="Account" size={16} />,
  error: 'Error Message',
};

export const withDescriptionText = Template.bind({});
withDescriptionText.args = {
  placeholder: 'Sample Button',
  defaultValue: 'Sample Text',
  label: 'Label',
  rightSection: <VscMenu title="Account" size={16} />,
  description: 'Description Text',
};

export function TemplateWithMantineHookForm() {
  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) =>
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(value)
          ? 'Please enter a valid email address.'
          : null,
      password: (value) =>
        value.length < 8 || value.length > 50
          ? 'Please enter a password between 8 and 50 characters.'
          : null,
    },
  });

  const _onSubmit = (data: { [k: string]: any }) =>
    console.log(`on-form-submit`, data);
  const onErrors = (errors: { [k: string]: any }) =>
    console.log('on-form-error', errors);

  return (
    <form onSubmit={onSubmit(_onSubmit, onErrors)}>
      <Input
        placeholder="Enter E-mail"
        name={'email'}
        label="Email"
        id="user-email"
        autoFocus={true}
        {...getInputProps('email')}
      />
      <Input
        type="password"
        id="user-password"
        label="Password"
        placeholder="Enter Password"
        name="password"
        {...getInputProps('password')}
      />
      <div className="form-control">
        <Button
          type="submit"
          text={`Submit`}
          onClick={() => onSubmit(_onSubmit, onErrors)}
          fullWidth
          primary
          sm
        />
      </div>
    </form>
  );
}

export const WithPostfixExample = () => {
  return (
    <div className="flex items-center p-2">
      <Input
        autoFocus={true}
        type="text"
        name="status"
        id="status"
        placeholder="Name"
        classNames={{
          root: '!mb-0 w-full !rounded-br-none !rounded-tr-none',
        }}
        size="xs"
      />

      <Button
        text="Add"
        classNames={{ root: '!rounded-bl-none !rounded-tl-none' }}
        onClick={() => {}}
        animate={false}
        secondary
        xs
      />
    </div>
  );
};
