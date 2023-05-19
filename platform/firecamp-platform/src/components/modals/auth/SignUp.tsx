import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, IModal, Button, Input, FcLogo } from '@firecamp/ui';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import platformContext from '../../../services/platform-context';

/**
 * User Sign up
 */
const SignUp: FC<IModal> = () => {
  const [showPassword, toggleShowPassword] = useState(false);
  const [isRequesting, setFlagIsRequesting] = useState(false);

  const form = useForm();
  const { handleSubmit, errors } = form;

  const _onSignUp = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (isRequesting) return;
    const { username, email, password } = payload;
    const _username = username.trim();
    if (_username.length < 6) {
      platformContext.app.notify.alert(
        `Username must have minimum 6 characters`
      );
      return;
    }
    if (/^[a-zA-Z0-9\_]{6,20}$/.test(_username) == false) {
      platformContext.app.notify.alert(
        `The username name must not be containing any spaces or special characters. The range should be from 6 to 20 characters`
      );
      return;
    }
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

  const _onKeyDown = (e) => e.key === 'Enter' && handleSubmit(_onSignUp);

  return (
    <>
      <Modal.Body>
        {/* <img className="mx-auto w-12 mb-6" src={'img/firecamp-logo.svg'} /> */}
        <div className="mb-3">
          <FcLogo className="mx-auto w-14" size={80} />
        </div>
        <div className="text-xl mb-4 w-full text-center font-semibold">
          Create a firecamp account
        </div>
        <div className="">
          <GithubGoogleAuth />
        </div>
        <div className="mb-6 mt-6 flex justify-center items-center">
          <hr className="border-t border-app-border w-full" />
          <span className="text-xs text-app-foreground-inactive bg-modal-background absolute px-1">
            OR
          </span>
        </div>
        <div className="text-sm text-app-foreground-inactive max-w-xs mx-auto mb-6 text-center px-16">
          Give us some of your information to get free access to Firecamp
        </div>
        <div className="">
          <form onSubmit={handleSubmit(_onSignUp)}>
            <Input
              placeholder="Enter Username"
              key={'username'}
              name={'username'}
              id={'username'}
              label="Username"
              type="text"
              registerMeta={{
                required: true,
                maxLength: 50,
                minLength: 1,
                pattern: /^[0-9a-zA-Z ]+$/,
              }}
              useformRef={form}
              onKeyDown={_onKeyDown}
              error={
                errors?.username
                  ? errors?.username?.message || 'Invalid username'
                  : ''
              }
              wrapperClassName="!mb-2"
            />
            <Input
              placeholder="Enter your email"
              key={'email'}
              name={'email'}
              id={'email'}
              label="Email"
              registerMeta={{
                required: true,
                maxLength: 50,
                minLength: 1,
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
              }}
              useformRef={form}
              onKeyDown={_onKeyDown}
              error={
                errors?.email ? errors?.email?.message || 'Invalid email' : ''
              }
              wrapperClassName="!mb-2"
            />
            <Input
              placeholder="Enter password"
              key={'password'}
              name={'password'}
              id={'password'}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              registerMeta={{
                required: true,
                maxLength: 50,
                minLength: 8,
              }}
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
              useformRef={form}
              onKeyDown={_onKeyDown}
              error={
                errors?.password
                  ? errors?.password?.message || 'Invalid password'
                  : ''
              }
            />

            <Button
              text={isRequesting ? 'Signing up...' : 'Sign up'}
              onClick={handleSubmit(_onSignUp)}
              fullWidth={true}
              primary
              md
            />
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex-col">
          <div className="text-sm mt-6 text-center">
            Already have an account
            <a
              href="#"
              id="signup"
              className="font-bold underline"
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
          <div className="text-sm mt-6 text-center text-app-foreground-inactive">
            By moving forward, you acknowledge that you have read and accept the
            <a
              href="https://firecamp.io/legals/privacy-policy/"
              tabIndex={1}
              className="font-bold underline"
              target={'_blank'}
            >
              Term of Service
            </a>
            and
            <a
              href="https://firecamp.io/legals/privacy-policy/"
              tabIndex={1}
              className="font-bold underline"
              target={'_blank'}
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </Modal.Footer>
    </>
  );
};

export default SignUp;
