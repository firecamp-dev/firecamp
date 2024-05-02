import { FC, useState } from 'react';
import { Button } from '@firecamp/ui';
import { VscGithub } from '@react-icons/all-files/vsc/VscGithub';
// import { GrGoogle } from '@react-icons/all-files/gr/GrGoogle';

import _auth from '../../../services/auth';
import { EProvider } from '../../../services/auth/types';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';
import platformContext from '../../../services/platform-context';
import AppService from '../../../services/app.service';

const GithubGoogleAuth: FC<IGithubGoogleAuth> = ({ onClose }) => {
  const [disableSignInWithGoogleButton, setDisableSignInWithGoogleButton] =
    useState(false);

  const [disableSignInWithGitHubButton, setDisableSignInWithGitHubButton] =
    useState(false);

  const closeModal = async () => {
    try {
      // close auth modal on sign in success
      typeof onClose == 'function' && onClose();
      return Promise.resolve();
    } catch (e) { }
  };

  const _githubOAuth = async (e: any) => {
    if (e) e.preventDefault();
    if (!!disableSignInWithGitHubButton) return Promise.reject('');
    setDisableSignInWithGitHubButton(true);

    if (_misc.firecampAgent() == EFirecampAgent.Web) {
      _auth.oauth2.githubAuth.authorize.web();
      return;
    }

    return _auth
      .signIn(EProvider.GITHUB)
      .then(async ({ response, provider }) => {
        platformContext.app.modals.close();
        // note: this'll be reachable only for desktop environment
        await platformContext.app.initApp().then(() => {
          AppService.notify.success(`You're signed in successfully.`, {
            labels: { alert: 'success' },
          });
        });
        await closeModal();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setDisableSignInWithGitHubButton(false);
      });
  };

  const _googleOAuth = (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();
    console.log(disableSignInWithGoogleButton, 'disableSignInWithGoogleButton');
    if (!!disableSignInWithGoogleButton) return Promise.reject('');

    setDisableSignInWithGoogleButton(true);

    _auth
      .signIn(EProvider.GOOGLE)
      .then(async ({ response, provider }) => {
        console.log(response, 'response....');
        await closeModal();
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
        //     await closeModal();
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
      {/* <Button
        text="Continue with Google"
        leftIcon={<GrGoogle size={18} />}
        className="mb-5"
        onClick={_googleOAuth}
        fullWidth
        transparent
        sm
      /> */}
      <Button
        text="Continue with GitHub"
        leftIcon={<VscGithub size={18} />}
        classNames={{ root: 'mb-5', inner: 'ml-[30%]' }}
        onClick={_githubOAuth}
        outline
        fullWidth
        sm
      />
      {/* <a
        href="#"
        className="text-app-foreground flex items-center justify-center bg-focusColor !border-app-border border p-1.5 hover:bg-input-background-focus hover:border-transparent hover:text-modal-foreground-active mb-6"
        onClick={_githubOAuth}
      >
        <VscGithub size={20} className="mr-2" />
        continue with{' '}
        <span className="text-modal-foreground-active ml-1">github</span>
      </a>
      <a
        href="#"
        className="text-app-foreground flex items-center justify-center bg-focusColor !border-app-border border p-1.5 hover:bg-input-background-focus hover:border-transparent hover:text-modal-foreground-active mb-6"
        onClick={_googleOAuth}
      >
        <GrGoogle size={20} className="mr-2" />
        continue with{' '}
        <span className="text-modal-foreground-active ml-1">google</span>
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
