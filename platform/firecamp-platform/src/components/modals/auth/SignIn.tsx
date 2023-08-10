import { FC } from 'react';
import { Mail } from 'lucide-react';
import { Drawer, IModal, Button, FcLogo } from '@firecamp/ui';

import _auth from '../../../services/auth';
import GithubGoogleAuth from './GithubGoogleAuth';
import platformContext from '../../../services/platform-context';

/**
 * User Sign in
 */
const SignIn: FC<IModal> = ({ opened, onClose }) => {
  return (
    <Drawer opened={opened} onClose={onClose} size={440} classNames={{body: 'mt-[10vh]'}}>
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
          text="Sign In with Email"
          leftIcon={<Mail size={18} />}
          classNames={{ 
            root: 'mb-5',
            inner: 'ml-[30%]'
           }}
          onClick={() => platformContext.app.modals.openSignInWithEmail()}
          outline
          fullWidth
          sm
        />
      </div>
      {/* <div className="mb-8 mt-8 flex justify-center items-center">
          <hr className="border-t border-app-border w-full" />
          <span className="text-xs text-app-foreground-inactive bg-modal-background absolute px-1">OR</span>
        </div> */}
      <div className="pt-px">
        <div className="text-sm mt-6 text-center">
          Not have an account?
          <a
            href="#"
            id="sign-up"
            className="font-bold underline px-1"
            onClick={(e) => {
              if (e) e.preventDefault();
              platformContext.app.modals.openSignUp();
            }}
            tabIndex={1}
          >
            Sign Up
          </a>
        </div>
        <div className="text-sm mt-6 text-center text-app-foreground-inactive">
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

export default SignIn;
