import { FC, useState } from 'react';
import { useForm } from '@mantine/form';
import { Eye, EyeOff } from 'lucide-react';
import { Modal, IModal, Button, Input } from '@firecamp/ui';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../services/platform-context';
import { Regex } from '../../../constants';

/**
 * ResetPassword component
 */
const ResetPassword: FC<IModal> = ({ opened = false, onClose = () => {} }) => {
  const [isRequesting, setFlagIsRequesting] = useState(false);
  const [showPassword, toggleShowPassword] = useState(false);

  const form = useForm({
    initialValues: { token: '', email: '', password: '' },
    validate: {
      token: (value) =>
        value.length < 4 || value.length > 50
          ? 'Please enter a token value between 4 and 50 characters.'
          : null,
      email: (value) =>
        value.length > 50
          ? 'Please enter a valid email address with a maximum of 50 characters.'
          : !Regex.Email.test(value)
          ? 'Please enter a valid email address.'
          : null,
      password: (value) =>
        value.length < 8 || value.length > 50
          ? 'Please enter a password between 8 and 50 characters.'
          : null,
    },
  });

  const { onSubmit, getInputProps } = form;

  const _onSubmit = async (payload: {
    token: string;
    email: string;
    password: string;
  }) => {
    if (isRequesting) return;
    let { token, email, password } = payload;

    setFlagIsRequesting(true);
    await Rest.auth
      .resetPassword({ token, new_password: password })
      .then((res) => {
        if ([200, 201].includes(res?.status)) {
          platformContext.app.notify.success(res.data?.message, {
            labels: { success: 'Reset password' },
          });
          platformContext.app.modals.openSignIn();
        } else {
          platformContext.app.notify.alert(`Failed to reset password!`, {
            labels: { alert: 'Reset password' },
          });
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

  const _onKeyDown = (e: any) => e.key === 'Enter' && onSubmit(_onSubmit);

  return (
    <Modal opened={opened} onClose={onClose} size={440}>
      <>
        {/* <img className="mx-auto w-12 mb-6" src={'img/reset-icon.png'} /> */}
        <div className="text-xl mb-6 w-full text-center font-semibold">
          Reset Password
        </div>
      </>
      <div className="">
        <form onSubmit={onSubmit(_onSubmit)}>
          <Input
            placeholder="Enter E-mail"
            key={'email'}
            name={'email'}
            label="Email"
            onKeyDown={_onKeyDown}
            data-autofocus
            classNames={{ root: '!mb-2' }}
            {...getInputProps('email')}
          />
          <Input
            placeholder="Enter Token"
            key={'token'}
            name={'token'}
            label="Token"
            type="text"
            onKeyDown={_onKeyDown}
            classNames={{ root: '!mb-2' }}
            {...getInputProps('token')}
          />
          <Input
            placeholder="Enter password"
            key={'password'}
            name={'password'}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            rightSection={
              <div
                className="cursor-pointer"
                onClick={() => toggleShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </div>
            }
            onKeyDown={_onKeyDown}
            {...getInputProps('password')}
          />
          <Button
            type="submit"
            text={isRequesting ? `Resetting password...` : 'Reset Password'}
            onClick={onSubmit(_onSubmit)}
            fullWidth
            primary
            sm
          />
        </form>
      </div>

      <div className="flex-col">
        <div className="text-sm mt-6 text-center text-app-foreground-inactive">
          Not have an account?
          <a
            href="#"
            onClick={(e) => {
              if (e) e.preventDefault();
              platformContext.app.modals.openSignUp();
            }}
            tabIndex={1}
            className="font-bold underline"
          >
            {' '}
            Sign Up
          </a>
        </div>
        <div className="text-sm text-center text-app-foreground-inactive">
          Already have an account?
          <a
            href="#"
            onClick={(e) => {
              if (e) e.preventDefault();
              platformContext.app.modals.openSignIn();
            }}
            tabIndex={1}
            className="font-bold underline"
          >
            {' '}
            Sign In
          </a>
        </div>
      </div>
      {/* <div className="text-sm mt-6">

      <a
        href="#"
        id="Signup"
        className="fc-auth-footer-link with-underline"
        onClick={e => {
          if (e) e.preventDefault();
          platformContext.app.modals.openSignUp();
        }}>
        Not have an account? Sign Up
      </a>
      <a
        href="#"
        id="signin"
        className="fc-auth-footer-link with-underline"
        onClick={e => {
          if (e) e.preventDefault();
          platformContext.app.modals.openSignIn();
        }}
      >
        Already have an account? Sign In
      </a>
    </div> */}
    </Modal>
  );
};

export default ResetPassword;
