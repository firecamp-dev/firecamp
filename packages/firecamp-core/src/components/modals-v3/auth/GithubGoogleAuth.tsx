import { FC, useState } from 'react';
import { VscGithub } from '@react-icons/all-files/vsc/VscGithub';
import { GrGoogle } from '@react-icons/all-files/gr/GrGoogle';

import _auth from '../../../services/auth';
import { Button, EButtonIconPosition, EButtonSize } from '@firecamp/ui-kit';
import { EProvider } from '../../../services/auth/types';
// import { PROVIDER } from '../../constants';

// const { GITHUB, GOOGLE } = PROVIDER;

const GithubGoogleAuth: FC<IGithubGoogleAuth> = ({ onClose }) => {
  let [disableSignInWithGoogleButton, setDisableSignInWithGoogleButton] =
    useState(false);

  let [disableSignInWithGitHubButton, setDisableSignInWithGitHubButton] =
    useState(false);

  const _initApp = async (response, provider) => {
    try {
      // Close auth modal on Sign In success
      onClose();

      // Initialize user information
      // await F.notification.asyncBlock(
      //   _auth.postSignIn({
      //     response,
      //     provider
      //   }),
      //   null,
      //   'Failed to initialize',
      //   'Initializing'
      // );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject({
        API: 'authModel._initApp',
        error,
      });
    }
  };

  const _githubOAuth = async (e: any) => {
    if (e) e.preventDefault();

    if (!!disableSignInWithGitHubButton) return Promise.reject('');
    setDisableSignInWithGitHubButton(true);

    _auth
      .signIn(EProvider.GITHUB)
      .then(async ({ response, provider }) => {
        console.log(response, 'response....');
        await _initApp(response, provider);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setDisableSignInWithGitHubButton(false);
      });
  };

  let _googleOAuth = (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();
    console.log(disableSignInWithGoogleButton, 'disableSignInWithGoogleButton');
    if (!!disableSignInWithGoogleButton) return Promise.reject('');

    setDisableSignInWithGoogleButton(true);

    _auth
      .signIn(EProvider.GOOGLE)
      .then(async ({ response, provider }) => {
        console.log(response, 'response....');
        await _initApp(response, provider);
      })
      .finally(() => {
        setDisableSignInWithGoogleButton(false);
      });

    return new Promise(async (resolve, reject) => {
      try {
        // await F.notification.asyncBlock(
        //   _auth.signIn(GOOGLE),
        //   async ({ response, provider }) => {
        //     // Enable to click sign up/ sign in button
        //     setDisableSignInWithGoogleButton(false);
        //     // Init App
        //     await _initApp(response, provider);
        //     resolve(response);
        //   },
        //   error => {
        //     // Enable to click sign up/ sign in button
        //     setDisableSignInWithGoogleButton(false);
        //     //todo: add logic to return error
        //     /* if (error.message) {
        //                     setErrorMsg(error.message);
        //                   } */
        //     console.log(error);
        //     reject(error);
        //   },
        //   '🔐 Authenticating'
        // );
      } catch (error) {
        // Enable to click sign up/ sign in button
        setDisableSignInWithGoogleButton(false);

        //todo: add logic to return error
        /* if (error.message) {
                    setErrorMsg(error.message);
                  } */

        reject(error);
      }
    });
  };

  return (
    <div className="">
      <Button
        text="Continue with Google"
        icon={<GrGoogle size={18} />}
        iconLeft
        size={EButtonSize.Medium}
        className="!w-full mb-5"
        onClick={_googleOAuth}
        transparent={true}
      />
      <Button
        text="Continue with Github"
        icon={<VscGithub size={18} />}
        iconLeft
        size={EButtonSize.Medium}
        className="!w-full mb-5"
        onClick={_githubOAuth}
      />
      {/* <a
        href="#"
        className="text-appForeground flex items-center justify-center bg-focusColor !border-appBorder border p-1.5 hover:bg-inputFocusBackground hover:border-transparent hover:text-modalActiveForeground mb-6"
        onClick={_githubOAuth}
      >
        <VscGithub size={20} className="mr-2" />
        continue with{' '}
        <span className="text-modalActiveForeground ml-1">github</span>
      </a>
      <a
        href="#"
        className="text-appForeground flex items-center justify-center bg-focusColor !border-appBorder border p-1.5 hover:bg-inputFocusBackground hover:border-transparent hover:text-modalActiveForeground mb-6"
        onClick={_googleOAuth}
      >
        <GrGoogle size={20} className="mr-2" />
        continue with{' '}
        <span className="text-modalActiveForeground ml-1">google</span>
      </a> */}
    </div>
  );
};

export default GithubGoogleAuth;

interface IGithubGoogleAuth {
  /**
   * A function to close modal
   */
  onClose?: () => void;
}
