import { FC, useState } from 'react';
import { useForm } from '@mantine/form';
import { Drawer, IModal, Button, Input, FcLogo } from '@firecamp/ui';
import { Eye, EyeOff } from 'lucide-react';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import platformContext from '../../../services/platform-context';
import { Regex } from '../../../constants';

/**
 * User Sign up
 */
const SignUp: FC<IModal> = ({ opened, onClose }) => {
  const [showPassword, toggleShowPassword] = useState(false);
  const [isRequesting, setFlagIsRequesting] = useState(false);

  const form = useForm({
    initialValues: { username: '', email: '', password: '' },

    validate: {
      username: (value) =>
        value.length < 6 || value.length > 20
          ? 'Please enter a username between 6 and 20 characters.'
          : !Regex.Username.test(value)
          ? 'The username should not have any special characters'
          : null,
      email: (value) =>
        !Regex.Email.test(value) ? 'Please enter a valid email address.' : null,
      password: (value) =>
        value.length < 8 || value.length > 50
          ? 'Please enter a password between 8 and 50 characters.'
          : null,
    },
  });

  const { onSubmit, getInputProps } = form;

  const _onSignUp = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (isRequesting) return;
    const { username, email, password } = payload;
    const _username = username.trim();
    const _email = email.trim();

    setFlagIsRequesting(true);
    _auth
      .signUp({ username: _username, email: _email, password })
      .then(({ response }) => {
        // console.log(res);
        localStorage.setItem('socketId', response?.__meta?.accessToken);
        platformContext.app.initApp();
        platformContext.app.notify.success(`You have signed up successfully`, {
          labels: { alert: 'success' },
        });
        platformContext.app.modals.close();
      })
      .catch((e) => {
        // console.log(e.response)
        platformContext.app.notify.alert(
          e.response?.data?.message || e.message,
          {
            labels: { alert: 'error!' },
          }
        );
      })
      .finally(() => {
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e) => e.key === 'Enter' && onSubmit(_onSignUp);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size={440}
      classNames={{ body: 'mt-[10vh]' }}
    >
      {/* <img className="mx-auto w-12 mb-6" src={'img/firecamp-logo.svg'} /> */}
      <div className="-mt-4">
        <FcLogo className="mx-auto w-14" size={80} />
      </div>
      <div className="text-xl mb-2 w-full text-center font-semibold">
        Create a firecamp account
      </div>
      <div className="">
        <GithubGoogleAuth />
      </div>
      <div className="relative my-3 flex justify-center items-center">
        <hr className="border-t border-app-border w-full" />
        <span className="text-xs text-app-foreground-inactive bg-modal-background absolute px-1">
          OR
        </span>
      </div>
      <div className="text-sm text-app-foreground-inactive max-w-sm mx-auto mb-3 text-center">
        Give us some of your information to get free access to Firecamp
      </div>
      <div className="">
        <form onSubmit={onSubmit(_onSignUp)}>
          <Input
            placeholder="Enter Username"
            key={'username'}
            name={'username'}
            id={'username'}
            label="Username"
            type="text"
            data-autofocus
            onKeyDown={_onKeyDown}
            classNames={{ root: '!mb-4' }}
            {...getInputProps('username')}
          />
          <Input
            placeholder="Enter your email"
            key={'email'}
            name={'email'}
            id={'email'}
            label="Email"
            onKeyDown={_onKeyDown}
            classNames={{ root: '!mb-4' }}
            {...getInputProps('email')}
          />
          <Input
            placeholder="Enter password"
            key={'password'}
            name={'password'}
            id={'password'}
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
            classNames={{ root: '!mb-4' }}
            {...getInputProps('password')}
          />

          <Button
            type="submit"
            text={isRequesting ? 'Signing up...' : 'Sign up'}
            onClick={onSubmit(_onSignUp)}
            fullWidth
            primary
            sm
          />
        </form>
      </div>

      <div className="flex-col">
        <div className="text-sm mt-3 text-center">
          Already have an account
          <a
            href="#"
            id="signup"
            className="font-bold underline px-1"
            onClick={(e) => {
              if (e) e.preventDefault();
              platformContext.app.modals.openSignIn();
            }}
            tabIndex={1}
          >
            {' '}
            Sign In
          </a>
        </div>
        <div className="text-sm mt-3 text-center text-app-foreground-inactive">
          By moving forward, you acknowledge that you have read and accept the
          <a
            href="https://firecamp.io/legal/privacy-policy/"
            tabIndex={1}
            className="font-bold underline px-1"
            target={'_blank'}
          >
            Term of Service
          </a>
          and
          <a
            href="https://firecamp.io/legal/privacy-policy/"
            tabIndex={1}
            className="font-bold underline px-1"
            target={'_blank'}
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </Drawer>
  );
};

export default SignUp;
