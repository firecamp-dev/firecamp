import { useState } from 'react';
import { VscGithub } from '@react-icons/all-files/vsc/VscGithub';
import { VscLock } from '@react-icons/all-files/vsc/VscLock';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';

import { Modal, Button, FormField, Input, IModal } from '@firecamp/ui';

export default {
  title: 'UI-Kit/Modal',
  component: Modal,
  argTypes: {
    className: '',
  },
};

const Template = ({ opened, ...args }: IModal) => {
  const [isOpen, openModal] = useState(opened);

  return (
    <div>
      <Button text="Open Modal" onClick={() => openModal(true)} />
      <Modal opened={isOpen} onClose={() => openModal(false)} {...args} />
    </div>
  );
};

export const ModalDemo = Template.bind({});
ModalDemo.args = {
  opened: true,
  title: <div>SignIn to Firecamp</div>,
  children: <FormPreview />,
};

export const ModalTitleWithoutBorder = Template.bind({});
ModalTitleWithoutBorder.args = {
  opened: true,
  title: <div>SignIn to Firecamp</div>,
  classNames: {
    header: 'border-0',
  },
  children: <FormPreview />,
};
export const ModalContentOverflow = Template.bind({});
ModalContentOverflow.args = {
  opened: true,
  title: <div>SignIn to Firecamp</div>,
  children: (
    <>
      <FormPreview overflowContent />
      <FormPreview overflowContent />
    </>
  ),
};

function FormPreview({ overflowContent = false }) {
  return (
    <div className="pt-6">
      <div>
        <div className="">
          <a
            href="#"
            className="text-app-foreground flex items-center justify-center bg-focusColor !border-app-border border p-1.5 hover:bg-input-background-focus hover:border-transparent hover:text-modal-foreground-active mb-6"
          >
            {' '}
            <VscGithub size={20} className="mr-2" /> continue with{' '}
            <span className="text-modal-foreground-active ml-2">github</span>
          </a>
        </div>

        <div className="relative my-4 flex justify-center items-center">
          <hr className="border-t border-app-border w-full" />
          <span className="text-xs text-app-foreground-inactive bg-modal-background absolute px-1">
            OR
          </span>
        </div>
        <div className="">
          <div className="text-center w-full text-sm mb-5">
            Sign in again to continue
          </div>

          <Input
            label="Username or E-mail"
            value="dnishchit@gmail.com"
            icon={<VscAccount title="Account" size={16} />}
          />

          <Input
            label="password"
            placeholder="password"
            icon={<VscLock title="Account" size={16} />}
          />
          <a className="cursor-pointer text-app-foreground block pb-6 text-right text-sm">
            Forgot Password?
          </a>
          <Button text="sign in" fullWidth primary sm />
        </div>
      </div>

      {overflowContent ? (
        <>
          <hr className="border-modal-border -ml-8 -mr-8 mb-6 mt-6" />
          <div className="text-sm mt-6">
            <div className="text-center">SignOut Forcefully</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
