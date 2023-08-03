import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Checkbox, Button, Input } from '../../ui-kit';

export default {
  title: 'UI-Kit/Forms',
};

export function ForgetPasswordForm() {
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

export function FormWithCheckBox() {
  const [checkBoxItem, updateCheckBoxItem] = useState({
    id: 'polling',
    isChecked: false,
    label: 'Polling',
    showLabel: true,
    disabled: false,
  });

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      namespace: '',
    },
    validate: {
      namespace: (value) => (!value ? 'Value is required' : null),
    },
  });

  const _onSubmit = (data: { [k: string]: any }) =>
    console.log(`on-form-submit`, { ...data, polling: checkBoxItem.isChecked });
  const onErrors = (errors: { [k: string]: any }) =>
    console.log('on-form-error', errors);

  const _handleCheckBoxAction = () => {
    updateCheckBoxItem((item) => ({ ...item, isChecked: !item.isChecked }));
  };

  return (
    <form
      className="fc-form grid max-w-sm bg-app-background-secondary"
      onSubmit={onSubmit(_onSubmit, onErrors)}
    >
      <br />
      <Input
        classNames={{
          root: 'fc-input',
        }}
        autoFocus={false}
        name={'namespace'}
        label={'Namespace'}
        {...getInputProps('namespace')}
      />
      <Checkbox
        isChecked={checkBoxItem.isChecked || false}
        label={checkBoxItem.label || ''}
        showLabel={checkBoxItem.showLabel || false}
        disabled={checkBoxItem.disabled || false}
        onToggleCheck={_handleCheckBoxAction}
        className="mr-2 mb-2"
        labelPlacing="left"
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
