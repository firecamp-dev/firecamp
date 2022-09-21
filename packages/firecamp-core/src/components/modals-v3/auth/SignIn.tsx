import { FC } from 'react';
import {
  Modal,
  IModal,
  Button,
  EButtonIconPosition,
  
} from '@firecamp/ui-kit';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import AppService from '../../../services/app';

/**
 * User Sign in
 */
const SignIn: FC<IModal> = () => {
  return (
    <>
      <Modal.Body>
        <img className="mx-auto w-12 mb-6" src={'img/fire-icon.png'} />
        <div className="text-xl mb-6 w-full text-center font-semibold">
          Sign in to firecamp
        </div>
        <div className="">
          <GithubGoogleAuth />
          <Button
            text="Continue with Email"
            icon={<VscAccount size={18} />}
            iconLeft
            md
            className="!w-full mb-5"
            onClick={() => AppService.modals.openSignInWithEmail()}
            transparent={true}
          />
        </div>
        {/* <div className="mb-8 mt-8 flex justify-center items-center">
          <hr className="border-t border-appBorder w-full" />
          <span className="text-xs text-appForegroundInActive bg-modalBackground absolute px-1">OR</span>
        </div> */}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex-col">
          <div className="text-sm mt-6 text-center">
            Not have an account?
            <a
              href="#"
              id="signup"
              className="font-bold underline"
              onClick={(e) => {
                if (e) e.preventDefault();
                AppService.modals.openSignUp();
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
      </Modal.Footer>
    </>
  );
};

export default SignIn;
