import { useState } from "react";
import { VscGithub } from "@react-icons/all-files/vsc/VscGithub";
import { VscLock } from "@react-icons/all-files/vsc/VscLock";
import { VscAccount } from "@react-icons/all-files/vsc/VscAccount";
import { GrGoogle } from "@react-icons/all-files/gr/GrGoogle";

import { default as Modal } from './Modal';
import { default as Button } from '../buttons/Button';
import { default as FormField } from '../form/FormField';
import { default as Input } from '../input/Input';

export default {
    title: "UI-Kit/Modal",
    component: Modal,
    argTypes: {
        className: ""
    }
};

const Template = (args: any) => {
    const [isOpen, toggleOpen] = useState(true);

    return <div className="bg-appBackground h-screen w-screen block">
        <Button text="Open Modal" onClick={() => toggleOpen(true)} />
        <Modal {...args} isOpen={isOpen} onClose={() => toggleOpen(false)}>
            <Modal.Header >
                {args?.header() || ''}
            </Modal.Header>
            <Modal.Body >
                {args?.body() || ''}
            </Modal.Body>
            <Modal.Footer >
                {args?.footer() || ''}
            </Modal.Footer>
        </Modal>
    </div>
};

export const ModalDemo = Template.bind({});

ModalDemo.args = {
    className: 'test',
    header: () => <ModalHeader />,
    body: () => <ModalBody />,
    footer: () => <ModalFooter />
};

export const SignUpDemo = Template.bind({});

SignUpDemo.args = {
    className: 'test',
    header: () => <SignUpHeader />,
    body: () => <SignUpBody />,
    footer: () => <SignUpFooter />
};

const SignUpHeader = () => {
    return (
        <div className="text-modalActiveForeground text-lg text-center mb-6">sign in to your firecamp account</div>
    )
}

const SignUpBody = () => {
    return (
        <div>
            <div className="" >
                <div className="text-center w-full mb-5">new to firecamp? <a className="text-primaryColor cursor-pointer">sign up</a></div>
                <a href="#" className="text-appForeground flex items-center justify-center bg-focusColor !border-appBorder border p-1.5 hover:bg-inputFocusBackground hover:border-transparent hover:text-modalActiveForeground mb-6"> <VscGithub size={20} className="mr-2" /> continue with <span className="text-modalActiveForeground ml-2">github</span></a>
                <a href="#" className="text-appForeground flex items-center justify-center bg-focusColor !border-appBorder border p-1.5 hover:bg-inputFocusBackground hover:border-transparent hover:text-modalActiveForeground mb-6"> <GrGoogle size={20} className="mr-2" /> continue with <span className="text-modalActiveForeground ml-2">google</span></a>
            </div>
            <hr className="border-modalBorder -ml-8 -mr-8 mb-6" />
            <div className="">
                <FormField label="Username or E-mail" >
                    <Input
                        placeholder='Username or E-mail'
                        iconPosition='left'
                        icon={<VscAccount title="Account" size={16} />} />
                </FormField>
                <FormField label="password">
                    <Input placeholder='password' iconPosition='left' icon={<VscLock title="Account" size={16} />} />
                </FormField>
                <Button primary={true} text="sign in" fullWidth={true} md={true} />
                <a className="cursor-pointer text-appForeground block pb-6 text-right text-sm -mt-4">Already have an account? Sign In</a>
            </div>
        </div>
    )
}

const SignUpFooter = () => {
    return (
        <div className="text-sm mt-6">
            By moving forward, you acknowledge that you have read and accept the <a className="text-modalActiveForeground cursor-pointer">Terms of Service</a> and <a className="text-modalActiveForeground">Privacy Policy.</a>
        </div>
    )
}

const ModalHeader = () => {
    return (
        <div className="text-modalActiveForeground text-lg mb-6">Modal Header</div>
    )
}

const ModalBody = () => {
    return (
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </div>
    )
}

const ModalFooter = () => {
    return (
        <div className="text-sm mt-6">
            Modal Footer
        </div>
    )
}