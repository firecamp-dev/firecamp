import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, IModal, Button, Input } from '@firecamp/ui-kit';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import { EProvider } from '../../../services/auth/types';
import platformContext from '../../../services/platform-context';

/**
 * User Sign in
 */
const SignInWithEmail: FC<IModal> = () => {
  const form = useForm();
  const [isRequesting, setFlagIsRequesting] = useState(false);
  let {
    handleSubmit,
    formState: { errors },
  } = form;

  const _onSignIn = async (
    payload: { username: string; password: string },
    e
  ) => {
    if (isRequesting) return;
    let { username, password } = payload;

    setFlagIsRequesting(true);
    _auth
      .signIn(EProvider.LOCAL, { username, password })
      .then(({ response }) => {
        // console.log(response.accessToken, response.user, response.workspace, "sign in response")

        localStorage.setItem('token', response.__meta.accessToken);
        // localStorage.setItem('workspace', res.response.workspace.__ref.id); //handled at initWorkspace fn
        platformContext.app.initApp();
        platformContext.app.modals.close();
        platformContext.app.notify.success(`You have signed in successfully`, {
          labels: { alert: 'success' },
        });
      })
      .catch((e) => {
        // console.log(e.response)
        platformContext.app.notify.alert(e.response?.data?.message || e.message, {
          labels: { alert: 'error!' },
        });
      })
      .finally(() => {
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e) => {
    try {
      if (e.key === 'Enter') {
        handleSubmit(_onSignIn);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <Modal.Body>
        <img className="mx-auto w-12 mb-6" src={'img/fire-icon.png'} />
        <div className="text-xl mb-6 w-full text-center font-semibold">
          Sign in to firecamp
        </div>
        <div className="">
          <GithubGoogleAuth />
        </div>
        <div className="mb-8 mt-8 flex justify-center items-center">
          <hr className="border-t border-appBorder w-full" />
          <span className="text-xs text-appForegroundInActive bg-modalBackground absolute px-1">
            OR
          </span>
        </div>
        <div className="text-sm text-appForegroundInActive max-w-xs mx-auto mb-6 text-center px-16">
          Welcome back! enter your email and password below to sign in.
        </div>
        <div className="">
          <form onSubmit={handleSubmit(_onSignIn)}>
            <Input
              placeholder="Enter Username"
              key={'username'}
              name={'username'}
              id={'username'}
              label="email"
              type="text"
              registerMeta={{
                required: true,
                maxLength: 50,
                minLength: 1,
                pattern:
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+|^[0-9a-zA-Z ]+$/,
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
              placeholder="Enter password"
              key={'password'}
              name={'password'}
              id={'password'}
              type={'password'}
              label="password"
              registerMeta={{
                required: true,
                maxLength: 50,
                minLength: 8,
              }}
              iconPosition="right"
              icon={<VscEye title="password" size={16} />}
              useformRef={form}
              onKeyDown={_onKeyDown}
              error={
                errors?.password
                  ? errors?.password?.message || 'Invalid password'
                  : ''
              }
              wrapperClassName="!mb-2"
            />
            <div className="flex justify-end">
              <a
                href="#"
                id="forgotPassword"
                className="!text-primaryColor text-sm mb-4 -mt-1"
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
              text={isRequesting ? `Singing...` : `Sign in`}
              onClick={handleSubmit(_onSignIn)}
              fullWidth={true}
              primary
              md
            />
          </form>
        </div>
        <div className="flex-col">
          <div className="text-sm mt-6 text-center">
            Not have an account?
            <a
              href="#"
              id="signup"
              className="font-bold underline"
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
          <div className="text-sm mt-6 text-center text-appForegroundInActive">
            By moving forward, you acknowledge that you have read and accept the
            <a
              href="https://firecamp.io/legals/privacy-policy/"
              tabIndex={1}
              className="font-bold underline"
              target={'_blank'}
            >
              {' '}
              Term of Service
            </a>{' '}
            and
            <a
              href="https://firecamp.io/legals/privacy-policy/"
              tabIndex={1}
              className="font-bold underline"
              target={'_blank'}
            >
              {' '}
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
       
      </Modal.Footer>
    </>
  );
};

export default SignInWithEmail;
