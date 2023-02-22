import { FC, useState } from 'react';
import shallow from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { Modal, IModal, Button, Input } from '@firecamp/ui-kit';
import { VscLock } from '@react-icons/all-files/vsc/VscLock';

import GithubGoogleAuth from './GithubGoogleAuth';
import _auth from '../../../services/auth';
import { useUserStore } from '../../../store/user';

// TODO: add isSubmitted to check and prevent multiple click on submit button

/**
 * RefreshToken component for user to autenticate.
 */
const RefreshToken: FC<IModal> = ({ onClose = () => {} }) => {
  return (
    <>
      <Modal.Header>
        <Header />
      </Modal.Header>
      <Modal.Body>
        <Body onClose={onClose} />
      </Modal.Body>
      <Modal.Footer>
        <Footer />
      </Modal.Footer>
    </>
  );
};

/**
 * Header component for SignUp modal
 */
const Header: FC<any> = () => {
  return (
    <div>
      <img className="mx-auto w-12 mb-6" src={'img/reset-icon.png'} />
      <div className="text-xl mb-6 w-full text-center font-semibold">
        Reset Password
      </div>
    </div>
  );
};

/**
 * Body component for RefreshToken modal contains all main functionalities to signUp
 */
const Body: FC<any> = ({ onClose = () => {} }) => {
  const { user } = useUserStore(
    (s) => ({
      user: s.user,
    }),
    shallow
  );

  // Hook to handle form inputs
  const form = useForm();
  let { handleSubmit, errors } = form;

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
        handleSubmit(_onSubmit);
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
      <hr className="border-modalBorder -ml-8 -mr-8 mb-6" />
      <div className="">
        <form onSubmit={handleSubmit(_onSubmit)}>
          <div className="fc-input-label flex align-center  text-appForegroundInActive ">
            <span className="iconv2-info-icon" />
            <span>{user.email || ''}</span>
          </div>
          <div className="form-group relative">
            <Input
              placeholder="password"
              key={'password'}
              name={'password'}
              type={'password'}
              iconPosition="left"
              icon={<VscLock title="Account" size={16} />}
              registerMeta={{
                required: true,
                maxLength: 50,
                minLength: 8,
              }}
              useformRef={form}
              onKeyDown={_onKeyDown}
              error={
                errors?.password
                  ? errors?.password?.message || 'Invalid password'
                  : ''
              }
            />
          </div>

          <Button
            color="primary"
            text="Sign in"
            fullWidth={true}
            size="md"
            onClick={handleSubmit(_onSubmit)}
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
