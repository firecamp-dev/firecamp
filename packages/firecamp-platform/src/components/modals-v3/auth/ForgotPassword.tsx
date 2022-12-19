import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input, IModal } from '@firecamp/ui-kit';

import _auth from '../../../services/auth';
import AppService from '../../../services/app';

/**
 * ForgotPassword component
 */
const ForgotPassword: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const [isRequesting, setFlagIsRequesting] = useState(false);
  const form = useForm();
  let { handleSubmit, errors } = form;

  const _onSubmit = async (payload: { email: string }) => {
    if (isRequesting) return;
    let { email } = payload;

    setFlagIsRequesting(true);
    await _auth
      .forgotPassword(email)
      .then((res) => {
        if ([200, 201].includes(res?.status)) {
          AppService.notify.success(res?.data?.message || '', {
            labels: { success: 'token sent!' },
          });
          AppService.modals.openResetPassword();
        } else {
          AppService.notify.alert(`Failed to send token, please try again!`, {
            labels: { alert: 'Forgot password' },
          });
        }
      })
      .catch((e) => {
        console.log(e);
        AppService.notify.alert(e.response?.data?.message || e.message, {
          labels: { alert: 'error' },
        });
      })
      .finally(() => {
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e: any) => e.key === 'Enter' && handleSubmit(_onSubmit);

  return (
    <>
      <Modal.Header>
        <img className="mx-auto w-12 mb-6" src={'img/mail-send.png'} />
        <div className="text-xl mb-2 w-full text-center font-semibold">
          Enter your Email Address
        </div>
        <div className="text-sm text-appForegroundInActive max-w-xs mx-auto mb-6 text-center px-16">
          You’ll get the password recovery token in your inbox.
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <form onSubmit={handleSubmit(_onSubmit)}>
            <Input
              placeholder="Enter E-mail"
              key={'email'}
              name={'email'}
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
            />
            <Button
              color="primary"
              text={isRequesting ? `Sending...` : `Send`}
              fullWidth={true}
              size="md"
              onClick={handleSubmit(_onSubmit)}
            />
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-sm mt-6">
          <a
            className="text-base text-center block"
            href="#"
            id="forgotPasswordToken"
            onClick={(e) => {
              if (e) e.preventDefault();
              AppService.modals.openResetPassword();
            }}
            tabIndex={1}
          >
            Already have a token?
          </a>
        </div>
      </Modal.Footer>
    </>
  );
};

export default ForgotPassword;
