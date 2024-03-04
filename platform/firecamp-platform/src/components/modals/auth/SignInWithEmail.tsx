import { FC, useState } from 'react';
import { useForm } from '@mantine/form';
import { Eye, EyeOff } from 'lucide-react';
import { Drawer, IModal, Button, Input, FcLogo } from '@firecamp/ui';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import { EProvider } from '../../../services/auth/types';
import platformContext from '../../../services/platform-context';
import { Regex } from '../../../constants';

/** User Sign in */
const SignInWithEmail: FC<IModal> = ({ opened, onClose }) => {
  const [isRequesting, setFlagIsRequesting] = useState(false);
  const [showPassword, toggleShowPassword] = useState(false);

  const form = useForm({
    initialValues: { username: '', password: '' },

    validate: {
      username: (value) =>
        value.length < 6 || value.length > 50
          ? 'Please enter a username between 6 and 50 characters.'
          : !Regex.EmailOrUsername.test(value)
          ? 'Please enter valid username or email'
          : null,
      password: (value) =>
        value.length < 8 || value.length > 50
          ? 'Please enter a password between 8 and 50 characters.'
          : null,
    },
  });

  const { onSubmit, getInputProps } = form;

  const _onSignIn = async (
    payload: { username: string; password: string },
    e
  ) => {
    if (isRequesting) return;
    const { username, password } = payload;

    setFlagIsRequesting(true);
    _auth
      .signIn(EProvider.LOCAL, { username, password })
      .then(({ response }) => {
        // console.log(response.accessToken, response.user, response.workspace, "sign in response")
        // localStorage.setItem('workspace', response.workspace.__ref.id); //handled at initWorkspace fn
        platformContext.app.initApp();
        platformContext.app.modals.close();
        platformContext.app.notify.success(`You have signed in successfully`, {
          labels: { alert: 'success' },
        });
      })
      .catch((e) => {
        // console.log(e.response)
        platformContext.app.notify.alert(
          e.response?.data?.message || e.message,
          {
            labels: { alert: 'error!' },
          }
        );
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e) => {
    try {
      if (e.key === 'Enter') {
        onSubmit(_onSignIn);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const onInputChange = ({ target: { name, value } }) => {
    form.setFieldValue(name, value.trim());
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size={440}
      classNames={{ body: 'mt-[10vh]' }}
    >
      <div className="mb-2">
        <FcLogo className="mx-auto w-14" size={80} />
      </div>
      <div className="text-xl mb-3 w-full text-center font-semibold">
        Sign in to Firecamp
      </div>
      <div className="">
        <GithubGoogleAuth />
      </div>
      <div className="relative my-4 flex justify-center items-center">
        <hr className="border-t border-app-border w-full" />
        <span className="text-xs text-app-foreground-inactive bg-modal-background absolute px-1">
          OR
        </span>
      </div>
      {/* <div className="text-sm text-app-foreground-inactive max-w-sm mx-auto mb-3 text-center">
          Welcome back! enter your email and password below to sign in.
        </div> */}
      <div className="">
        <form onSubmit={onSubmit(_onSignIn)}>
          <Input
            placeholder="Enter Username"
            key={'username'}
            name={'username'}
            id={'username'}
            label="Email or Username"
            type="text"
            onKeyDown={_onKeyDown}
            data-autofocus
            classNames={{ root: '!mb-2' }}
            {...getInputProps('username')}
            onChange={onInputChange}
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
            classNames={{ root: '!mb-2' }}
            {...getInputProps('password')}
          />
          <div className="flex justify-end">
            <a
              href="#"
              id="forgotPassword"
              className="!text-primaryColor text-sm mb-2 -mt-1"
              onClick={(e) => {
                if (e) e.preventDefault();
                platformContext.app.modals.openForgotPassword();
              }}
              tabIndex={1}
            >
              Forgot password
            </a>
          </div>
          <Button
            type="submit"
            text={isRequesting ? `Signing in...` : `Sign in`}
            onClick={onSubmit(_onSignIn)}
            fullWidth
            primary
            sm
          />
        </form>
      </div>
      <div className="flex-col">
        <div className="text-sm mt-3 text-center">
          Not have an account?
          <a
            href="#"
            id="signup"
            className="font-bold underline px-1"
            onClick={(e) => {
              if (e) e.preventDefault();
              platformContext.app.modals.openSignUp();
            }}
            tabIndex={1}
          >
            {' '}
            Sign Up
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
            {' '}
            Term of Service
          </a>{' '}
          and
          <a
            href="https://firecamp.io/legal/privacy-policy/"
            tabIndex={1}
            className="font-bold underline px-1"
            target={'_blank'}
          >
            {' '}
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </Drawer>
  );
};

export default SignInWithEmail;
