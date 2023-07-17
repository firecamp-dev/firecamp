//@ts-nocheck
import Input from './Input';
import Inputv2 from './Inputv2';
import Button from '../buttons/Button';
import { VscMenu } from '@react-icons/all-files/vsc/VscMenu';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default {
  title: 'UI-Kit/Input',
  component: Input,
  argTypes: {
    placeholder: 'Firecamp',
    value: 'Firecamp value',
  },
};

const Template = (args) => (
  <div className="bg-activityBar-background p-4 w-96">
    {' '}
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
  iconPosition: 'left',
};

export const withIconRight = Template.bind({});
withIconRight.args = {
  placeholder: 'Sample Button',
  value: '',
  icon: <VscMenu title="Account" size={16} />,
  iconPosition: 'right',
};

export const withText = Template.bind({});
withText.args = {
  placeholder: 'Sample Button',
  value: 'Sample Text',
  icon: <VscMenu title="Account" size={16} />,
  iconPosition: 'right',
};

export const withErrorText = Template.bind({});
withErrorText.args = {
  placeholder: 'Sample Button',
  value: 'Sample Text',
  icon: <VscMenu title="Account" size={16} />,
  iconPosition: 'right',
  error: 'Error Message',
};

export const withNoteText = Template.bind({});
withNoteText.args = {
  placeholder: 'Sample Button',
  value: 'Sample Text',
  icon: <VscMenu title="Account" size={16} />,
  iconPosition: 'right',
  note: 'Note Text',
};

export function TemplateWithReactHookForm() {
  const additionalRef = useRef();
  const [dummyInput, setDummyInput] = useState('');
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data: { [k: string]: any }) =>
    console.log(`on-form-submit`, data);
  const onErrors = (errors: { [k: string]: any }) =>
    console.log('on-form-error', errors);

  return (
    <form onSubmit={handleSubmit(onSubmit, onErrors)}>
      <Inputv2
        placeholder="Enter E-mail"
        name={'email'}
        label="Email"
        id="user-email"
        ref={register({
          required: {
            value: true,
            message: 'Email is required',
          },
          maxLength: 50,
          minLength: 5,
          pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
        })}
        autoFocus={true}
        error={errors?.email ? errors?.email?.message || 'Invalid email' : ''}
      />
      <Inputv2
        type="password"
        id="user-password"
        label="Password"
        placeholder="Enter Password"
        name="password"
        ref={register({ required: true, minLength: 6 })}
        error={
          errors?.password
            ? errors.password.type === 'required'
              ? 'Password is required.'
              : 'Password should be at-least 6 characters.'
            : ''
        }
      />
      <Inputv2
        id="extra-details"
        label="Dummy input - not added in form submit"
        placeholder="Enter Password"
        name="dummy input"
        ref={additionalRef}
        note={'Note preview'}
        value={dummyInput}
        onChange={({ target: { value } }) => setDummyInput(value)}
      />
      <div className="form-control">
        <Button
          type="submit"
          text={`Submit`}
          onClick={() => handleSubmit(onSubmit, onErrors)}
          fullWidth
          primary
          sm
        />
      </div>
    </form>
  );
}
