import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, IModal, Button, Input } from '@firecamp/ui';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';
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

  const form = useForm();
  const { handleSubmit, errors, getValues } = form;

  const _onSubmit = async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (isRequesting) return;

    setFlagIsRequesting(true);
    // await Rest.auth
    //   .resetPassword({...payload})
    //   .then((res) => {
    //     if ([200, 201].includes(res?.status)) {
    //       platformContext.app.notify.success(res.data?.message, {
    //         labels: { success: 'Reset password' },
    //       });
    //       platformContext.app.modals.openSignIn();
    //     } else {
    //       platformContext.app.notify.alert(`Failed to reset password!`, {
    //         labels: { alert: 'Reset password' },
    //       });
    //     }
    //   })
    //   .catch((e) => {
    //     platformContext.app.notify.alert(
    //       e?.response?.data?.message || e.message,
    //       {
    //         labels: { alert: 'error!' },
    //       }
    //     );
    //   })
    //   .finally(() => {
    //     setFlagIsRequesting(false);
    //   });
  };

  const _onKeyDown = (e: any) => e.key === 'Enter' && handleSubmit(_onSubmit);

  return (
    <>
      <form onSubmit={handleSubmit(_onSubmit)} className="mx-2 mt-4">
        <Input
          placeholder="Enter old password"
          key={'currentPassword'}
          name={'currentPassword'}
          type={oldPassword ? 'text' : 'password'}
          label="Old Password"
          iconPosition="right"
          icon={
            <VscEye
              title="password"
              size={16}
              onClick={() => {
                toggleOldPassword(!oldPassword);
              }}
            />
          }
          registerMeta={{
            required: 'Please enter your current password',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 character',
            },
            maxLength: {
              value: 50,
              message: 'Password should not exceed 50 character',
            },
          }}
          useformRef={form}
          onKeyDown={_onKeyDown}
          error={
            errors?.currentPassword
              ? errors?.currentPassword?.message || 'Invalid password'
              : ''
          }
        />

        <Input
          placeholder="Enter new password"
          key={'newPassword'}
          name={'newPassword'}
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          iconPosition="right"
          icon={
            <VscEye
              title="password"
              size={16}
              onClick={() => {
                toggleShowPassword(!showPassword);
              }}
            />
          }
          registerMeta={{
            required: 'Please enter your new password',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 character',
            },
            maxLength: {
              value: 50,
              message: 'Password should not exceed 50 character',
            },
          }}
          useformRef={form}
          onKeyDown={_onKeyDown}
          error={
            errors?.newPassword
              ? errors?.newPassword?.message || 'Invalid password'
              : ''
          }
        />

        <Input
          placeholder="Enter password again"
          key={'confirmPassword'}
          name={'confirmPassword'}
          type={confirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          iconPosition="right"
          icon={
            <VscEye
              title="password"
              size={16}
              onClick={() => {
                toggleConfirmPassword(!confirmPassword);
              }}
            />
          }
          registerMeta={{
            required: 'Please enter password again',
            validate: (value) => {
              const { newPassword } = getValues();
              return newPassword === value || 'Passwords should match';
            },
          }}
          useformRef={form}
          onKeyDown={_onKeyDown}
          error={
            errors?.confirmPassword
              ? errors?.confirmPassword?.message || 'Invalid password'
              : ''
          }
        />
        <Button
          type="submit"
          text={isRequesting ? 'Updating Password...' : 'Update Password'}
          onClick={handleSubmit(_onSubmit)}
          fullWidth
          primary
          sm
        />
      </form>
    </>
  );
};

export default ChangePassword;
