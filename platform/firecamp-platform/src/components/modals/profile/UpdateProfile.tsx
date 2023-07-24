import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@firecamp/ui';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../services/platform-context';

/**
 * Update Profile component
 */
const UpdateProfile = () => {
  const [isRequesting, setFlagIsRequesting] = useState(false);
  const [oldPassword, toggleOldPassword] = useState(false);
  const [showPassword, toggleShowPassword] = useState(false);
  const [confirmPassword, toggleConfirmPassword] = useState(false);

  const form = useForm();
  let { handleSubmit, errors } = form;

  const _onSubmit = async (payload: {
    name: string;
  }) => {
    if (isRequesting) return;
    let { name } = payload;

    // setFlagIsRequesting(true);
    // await Rest.auth
    //   .resetPassword({ token, new_password: password })
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
          placeholder="Enter name"
          key={'name'}
          name={'name'}
          type={'text'}
          label="Name"
          registerMeta={{
            required: true,
          }}
          useformRef={form}
          onKeyDown={_onKeyDown}
          error={
            errors?.name ? errors?.name?.message || 'Please enter name' : ''
          }
        />

        <Input
          placeholder="Enter email"
          key={'email'}
          name={'email'}
          label="Email"
          useformRef={form}
          onKeyDown={_onKeyDown}
        />

        <Button
          type="submit"
          text={isRequesting ? 'Updating...' : 'Update Name'}
          onClick={handleSubmit(_onSubmit)}
          fullWidth
          primary
          sm
        />
      </form>
    </>
  );
};

export default UpdateProfile;
