import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Drawer, Button, Input, IModal } from '@firecamp/ui';
import { Mail } from 'lucide-react';
import _auth from '../../../services/auth';
import platformContext from '../../../services/platform-context';
/**
 * ForgotPassword component
 */
const ForgotPassword: FC<IModal> = ({ opened = false, onClose = () => {} }) => {
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
          platformContext.app.notify.success(res?.data?.message || '', {
            labels: { success: 'token sent!' },
          });
          platformContext.app.modals.openResetPassword();
        } else {
          platformContext.app.notify.alert(
            `Failed to send token, please try again!`,
            {
              labels: { alert: 'Forgot password' },
            }
          );
        }
      })
      .catch((e) => {
        console.log(e);
        platformContext.app.notify.alert(
          e.response?.data?.message || e.message,
          {
            labels: { alert: 'error' },
          }
        );
      })
      .finally(() => {
        setFlagIsRequesting(false);
      });
  };

  const _onKeyDown = (e: any) => e.key === 'Enter' && handleSubmit(_onSubmit);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size={440}
      classNames={{ body: 'mt-[10vh]' }}
    >
      <Mail
        size="48"
        className="mb-6 mx-auto text-activityBar-foreground-inactive"
      />
      <div className="text-xl mb-2 w-full text-center font-semibold">
        Enter your Email Address
      </div>
      <div className="text-sm text-app-foreground-inactive max-w-xs mx-auto mb-6 text-center px-16">
        You’ll get the password recovery token in your inbox.
      </div>
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
            onKeyDown={_onKeyDown}
            error={
              errors?.email ? errors?.email?.message || 'Invalid email' : ''
            }
          />
          <Button
            text={isRequesting ? `Sending...` : `Send`}
            onClick={handleSubmit(_onSubmit)}
            fullWidth
            primary
            sm
          />
        </form>
      </div>

      <div className="text-sm p-4">
        <a
          className="text-base text-center block"
          href="#"
          id="forgotPasswordToken"
          onClick={(e) => {
            if (e) e.preventDefault();
            platformContext.app.modals.openResetPassword();
          }}
          tabIndex={1}
        >
          Already have a token?
        </a>
      </div>
    </Drawer>
  );
};

export default ForgotPassword;
