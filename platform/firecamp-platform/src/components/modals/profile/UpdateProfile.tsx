import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@firecamp/ui';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../services/platform-context';
import { useUserStore } from '../../../store/user';

/**
 * Update Profile component
 */
const UpdateProfile = () => {
  const [isRequesting, setFlagIsRequesting] = useState(false);

  const form = useForm();
  let { handleSubmit, errors, setValue } = form;

  const { user, setUser } = useUserStore((s) => ({
    user: s.user,
    setUser: s.setUser
  }));

  // set the initial value for the form
  useEffect(() => {
    setValue("name", user.name);
  },[user]);

  const _onSubmit = async (payload: { name: string }) => {
    let { name } = payload;
    if (isRequesting || user.name === name) return;
    

    setFlagIsRequesting(true);

    await Rest.user
      .updateProfile({ name })
      .then((res) => res.data)
      .then(({ error, message }) => {
        if (!error) {
          platformContext.app.notify.success(
            `Your profile details are updated`
          );
          // update the user store
          setUser({...user, name})
        } else {
          platformContext.app.notify.alert(message);
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
          placeholder="Enter Username"
          key={'username'}
          name={'username'}
          label="Username"
          value={user.username}
          disabled
        />

        <Input
          placeholder="Enter email"
          key={'email'}
          name={'email'}
          label="Email"
          value={user.email}
          disabled
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
