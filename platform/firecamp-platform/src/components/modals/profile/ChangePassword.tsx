import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Input } from '@firecamp/ui';
import { Eye, EyeOff } from 'lucide-react';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../services/platform-context';

/**
 * Change Password component
 */
const ChangePassword = () => {
  const [isRequesting, setFlagIsRequesting] = useState(false);
  const [oldPassword, toggleOldPassword] = useState(false);
  const [showPassword, toggleShowPassword] = useState(false);
  const [confirmPassword, toggleConfirmPassword] = useState(false);

  const { onSubmit, getInputProps, reset } = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) =>
        !value.length
          ? 'Please enter your current password'
          : value.length < 8
          ? 'Password should be at least 8 character'
          : value.length > 50
          ? 'Password should not exceed 50 character'
          : null,
      newPassword: (value) =>
        !value.length
          ? 'Please enter your current password'
          : value.length < 8
          ? 'Password should be at least 8 character'
          : value.length > 50
          ? 'Password should not exceed 50 character'
          : null,
      confirmPassword: (value, { newPassword }) =>
        value !== newPassword ? 'Passwords should match' : null,
    },
  });

  const _handleSubmit = async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (isRequesting) return;

    setFlagIsRequesting(true);

    await Rest.user
      .changePassword({
        currentPassword,
        newPassword,
      })
      .then((res) => res.data)
      .then(({ error, message }) => {
        if (!error) {
          reset();
          platformContext.app.notify.success(message);
        } else {
          platformContext.app.notify.alert(
            message ?? `Failed to change password!`
          );
        }
      })
      .catch((e) => {
        platformContext.app.notify.alert(
          e?.response?.data?.message || e.message,
          {
            labels: { alert: 'error!' },
          }
        );
      })
      .finally(() => {
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e: any) => e.key === 'Enter' && onSubmit(_handleSubmit);

  return (
    <>
      <form onSubmit={onSubmit(_handleSubmit)} className="mx-2 mt-4">
        <Input
          placeholder="Enter old password"
          name={'currentPassword'}
          type={oldPassword ? 'text' : 'password'}
          label="Old Password"
          onKeyDown={_onKeyDown}
          rightSection={
            <div
              className="cursor-pointer"
              onClick={() => toggleOldPassword(!oldPassword)}
            >
              {oldPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </div>
          }
          data-autofocus
          {...getInputProps('currentPassword')}
        />

        <Input
          placeholder="Enter new password"
          name={'newPassword'}
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          onKeyDown={_onKeyDown}
          rightSection={
            <div
              className="cursor-pointer"
              onClick={() => toggleShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </div>
          }
          {...getInputProps('newPassword')}
        />

        <Input
          placeholder="Enter password again"
          name={'confirmPassword'}
          type={confirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          onKeyDown={_onKeyDown}
          rightSection={
            <div
              className="cursor-pointer"
              onClick={() => toggleConfirmPassword(!confirmPassword)}
            >
              {confirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </div>
          }
          {...getInputProps('confirmPassword')}
        />
        <Button
          type="submit"
          text={isRequesting ? 'Updating Password...' : 'Update Password'}
          onClick={onSubmit(_handleSubmit)}
          fullWidth
          primary
          sm
        />
      </form>
    </>
  );
};

export default ChangePassword;
