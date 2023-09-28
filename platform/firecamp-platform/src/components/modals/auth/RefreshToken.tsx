import { FC, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useForm } from '@mantine/form';
import { Lock } from 'lucide-react';
import { Modal, IModal, Button, Input } from '@firecamp/ui';

import GithubGoogleAuth from './GithubGoogleAuth';
import _auth from '../../../services/auth';
import { useUserStore } from '../../../store/user';

// TODO: add isSubmitted to check and prevent multiple click on submit button

/**
 * RefreshToken component for user to authenticate.
 */
const RefreshToken: FC<IModal> = ({ opened, onClose = () => { } }) => {
  return (
    <Modal opened={opened} onClose={onClose} closeOnEscape={false}>
      <Header />
      <Body onClose={onClose} />
      <Footer />
    </Modal>
  );
};

/**
 * Header component for SignUp modal
 */
const Header: FC<any> = () => {
  return (
    <div>
      {/* <img className="mx-auto w-12 mb-6" src={'img/reset-icon.png'} /> */}
      <div className="text-xl mb-6 w-full text-center font-semibold">
        Reset Password
      </div>
    </div>
  );
};

/**
 * Body component for RefreshToken modal contains all main functionalities to signUp
 */
const Body: FC<any> = ({ onClose = () => { } }) => {
  const { user } = useUserStore(
    (s) => ({
      user: s.user,
    }),
    shallow
  );


  const form = useForm({
    initialValues: { password: '' },

    validate: {
      password: (value) =>
        value.length < 8 || value.length > 50
          ? 'Please enter a password between 8 and 50 characters.'
          : null,
    },
  });
  const { onSubmit, getInputProps } = form;

  let [errorMsg, setErrorMsg] = useState('');

  let _onSubmit = async (onSubmit, onError = {}) => {
    console.log({ onSubmit, onError });
    let { password } = onSubmit;
    let { provider } = user;
    if (!provider) return;

    // F.notification.asyncBlock(
    //   _auth.refreshToken({
    //     provider,
    //     email: user.email,
    //     password: password
    //   }),
    //   response => {
    //     onClose();
    //     return {};
    //   },
    //   error => {
    //     setErrorMsg(error?.data?.message || 'Failed to re-login');
    //     return {};
    //   },
    //   'Loading'
    // );
  };

  let _onKeyDown = (e) => {
    try {
      if (e.key === 'Enter') {
        onSubmit(_onSubmit);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
      <div className="">
        <GithubGoogleAuth />
        {errorMsg ? (
          <div className="text-error text-sm text-center mb-6">
            {errorMsg || ''}
          </div>
        ) : (
          ''
        )}
      </div>
      <hr className="border-modal-border -ml-8 -mr-8 mb-6" />
      <div className="">
        <form onSubmit={onSubmit(_onSubmit)}>
          <div className="fc-input-label flex align-center  text-app-foreground-inactive ">
            {/* // TODO: icon: add info icon */}
            <span>{user.email || ''}</span>
          </div>
          <div className="form-group relative">
            <Input
              placeholder="password"
              key={'password'}
              name={'password'}
              type={'password'}
              icon={<Lock size={16} />}
              onKeyDown={_onKeyDown}
              {...getInputProps('password')}
            />
          </div>

          <Button
            text="Sign in"
            onClick={onSubmit(_onSubmit)}
            fullWidth
            sm
          />
        </form>
      </div>
    </div>
  );
};

/**
 * Footer component for RefreshToken modal to reach firecamp terms, services, and privacy policy.
 */
const Footer: FC<any> = () => {
  let _onForcefullyLogoutAndReLogin = async (e) => {
    if (e) e.preventDefault();

    await _auth.signOut(true).then((d) => {
      // F.ModalService.open(EModals.AUTHENTICATION);
    });
  };

  let _openForgotPwdModal = async (e) => {
    if (e) e.preventDefault();

    // if (F.userMeta?.id) {
    //   F.ModalService.open(EModals.AUTHENTICATION, '', {
    //     auth: EAuthenticationModals.FORGOT_PASSWORD
    //   });
    // }
  };

  return (
    <div className="text-sm mt-6">
      <a
        href="#"
        id="Forgotpassword"
        className="fc-auth-footer-link with-underline"
        onClick={(e) => {
          if (e) e.preventDefault();
          _openForgotPwdModal(e);
        }}
      >
        Forgot password
      </a>
      <a
        href="#"
        id="forcefullyLogoutAndReLogin"
        className="fc-auth-footer-link with-underline"
        onClick={(e) => {
          if (e) e.preventDefault();
          _onForcefullyLogoutAndReLogin(e);
        }}
      >
        Sign Out Forcefully
      </a>
    </div>
  );
};

export default RefreshToken;
