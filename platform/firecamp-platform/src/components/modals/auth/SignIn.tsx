import { FC } from 'react';
import { Modal, IModal, Button, FcLogo } from '@firecamp/ui';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import platformContext from '../../../services/platform-context';

/**
 * User Sign in
 */
const SignIn: FC<IModal> = () => {
  return (
    <>
      <Modal.Body>
        {/* <img className="mx-auto w-12 mb-6" src={'img/firecamp-logo.svg'} /> */}
        <div className="mb-4">
          <FcLogo className="mx-auto w-14" size={80} />
        </div>
        <div className="text-xl mb-6 w-full text-center font-semibold">
          Sign in to Firecamp
        </div>
        <div className="">
          <GithubGoogleAuth />
          <Button
            text="Continue with Email"
            icon={<VscAccount size={18} />}
            className="!w-full mb-5"
            onClick={() => platformContext.app.modals.openSignInWithEmail()}
            transparent
            iconLeft
            md
          />
        </div>
        {/* <div className="mb-8 mt-8 flex justify-center items-center">
          <hr className="border-t border-appBorder w-full" />
          <span className="text-xs text-appForegroundInActive bg-modalBackground absolute px-1">OR</span>
        </div> */}
        <div className="flex-col">
          <div className="text-sm mt-6 text-center">
            Not have an account?
            <a
              href="#"
              id="sign-up"
              className="font-bold underline"
              onClick={(e) => {
                if (e) e.preventDefault();
                platformContext.app.modals.openSignUp();
              }}
              tabIndex={1}
            >
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
      </Modal.Body>
    </>
  );
};

export default SignIn;
