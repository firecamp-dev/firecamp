import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Input } from '@firecamp/ui';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../services/platform-context';
import { useUserStore } from '../../../store/user';

/**
 * Update Profile component
 */
const UpdateProfile = () => {
  const [isRequesting, setFlagIsRequesting] = useState(false);

  const { user, setUser } = useUserStore((s) => ({
    user: s.user,
    setUser: s.setUser,
  }));

  const { onSubmit, getInputProps, values } = useForm({
    initialValues: {
      name: user.name,
      username: user.username,
      email: user.email,
    },
    validate: {
      name: (value) => (!value.length ? 'Please enter name' : null),
    },
  });

  const _handleSubmit = async ({ name }) => {
    if (isRequesting) return;

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
          setUser({ ...user, name });
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

  const _onKeyDown = (e: any) => e.key === 'Enter' && onSubmit(_handleSubmit);

  return (
    <>
      <form onSubmit={onSubmit(_handleSubmit)} className="mx-2 mt-4">
        <Input
          placeholder="Enter name"
          key={'name'}
          name={'name'}
          type={'text'}
          label="Name"
          onKeyDown={_onKeyDown}
          data-autofocus
          {...getInputProps('name')}
        />

        <Input
          placeholder="Enter Username"
          key={'username'}
          name={'username'}
          label="Username"
          disabled
          {...getInputProps('username')}
        />

        <Input
          placeholder="Enter email"
          key={'email'}
          name={'email'}
          label="Email"
          value={user.email}
          disabled
          {...getInputProps('email')}
        />

        <Button
          type="submit"
          text={isRequesting ? 'Updating...' : 'Update Name'}
          onClick={onSubmit(_handleSubmit)}
          disabled={user.name === values.name}
          fullWidth
          primary
          sm
        />
      </form>
    </>
  );
};

export default UpdateProfile;
