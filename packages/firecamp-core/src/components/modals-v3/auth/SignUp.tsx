import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, IModal, Button, Input } from '@firecamp/ui-kit';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import AppService from '../../../services/app';

/**
 * User Sign up
 */
const SignUp: FC<IModal> = () => {
  const [isRequesting, setFlagIsRequesting] = useState(false);

  const form = useForm();
  let { handleSubmit, errors } = form;

  const _onSignUp = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (isRequesting) return;
    let { username, email, password } = payload;

    setFlagIsRequesting(true);
    _auth
      .signUp({ username, email, password })
      .then((res) => {
        console.log(res);
        localStorage.setItem('token', res.response.__meta.access_token);
        AppService.initApp();
        AppService.notify.success(`You have signed up successfully`, {
          labels: { alert: 'success' },
        });
        AppService.modals.close();
      })
      .catch((e) => {
        // console.log(e.response)
        AppService.notify.alert(e.response?.data?.message || e.message, {
          labels: { alert: 'error!' },
        });
      })
      .finally(() => {
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e) => e.key === 'Enter' && handleSubmit(_onSignUp);

  return (
    <>
      <Modal.Body>
        <img className="mx-auto w-12 mb-6" src={'img/fire-icon.png'} />
        <div className="text-xl mb-6 w-full text-center font-semibold">
          Create a firecamp account
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
          Give us some of your information to get free access to Firecamp
        </div>
        <div className="">
          <form onSubmit={handleSubmit(_onSignUp)}>
            <Input
              placeholder="Enter Username"
              key={'username'}
              name={'username'}
              id={'username'}
              label="User Name"
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
              placeholder="Enter E-mail"
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
              type={'password'}
              label="Password"
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
            />

            <Button
              color="primary"
              text={isRequesting ? 'Signing up...' : 'Sign up'}
              fullWidth={true}
              size="md"
              onClick={handleSubmit(_onSignUp)}
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
                AppService.modals.openSignIn();
              }}
              tabIndex={1}
            >
              {' '}
              Sign In
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
      </Modal.Footer>
    </>
  );
};

export default SignUp;
