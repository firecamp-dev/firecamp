//@ts-nocheck
import Input, { Inputv2 } from './Input';
import Button from '../buttons/Button'
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default {
  title: "UI-Kit/Input",
  component: Input,
  argTypes: {
    placeholder: "Firecamp",
    value: "Firecamp value"
  }
};

const Template = (args) => <div className="bg-activityBarBackground p-4 w-96"> <Input {...args} /></div>;
const Template2 = (args) => <div className="bg-activityBarBackground p-4 w-96 flex"> <Input {...args} /> <Button color="primary" text="Send" size="md" /> </div>;

export const InputDemo = Template.bind({});
InputDemo.args = { placeholder: 'Sample Button', value: '' };

export const withIcon = Template.bind({});
withIcon.args = { placeholder: 'Sample Button', value: '', icon: () => <VscMenu title="Account" size={16} />, iconPosition: 'left' };

export const withIconRight = Template.bind({});
withIconRight.args = { placeholder: 'Sample Button', value: '', icon: () => <VscMenu title="Account" size={16} />, iconPosition: 'right' };

export const withText = Template.bind({});
withText.args = { placeholder: 'Sample Button', value: 'Sample Text', icon: () => <VscMenu title="Account" size={16} />, iconPosition: 'right' };

// export const withButton = Template2.bind({});
// withButton.args = {placeholder: 'Sample Button', value: 'Sample Text', className: 'h-full border-r-0'};

export const withLeftComp = Template.bind({});
withLeftComp.args = {
  placeholder: 'Sample Button',
  value: 'Sample Text',
  className: 'h-full border-r-0',
  // leftComp: () => <Button color="primary" text="left" size="md" onClick={console.log}/>
};

export const withRightComp = Template.bind({});
withRightComp.args = {
  placeholder: 'Sample Button',
  value: 'Sample Text',
  className: 'h-full border-r-0',
  // rightComp: () => <Button color="primary" text="right" size="md" onClick={console.log}/>
};


export function TemplateWithReactHookForm() {

  const additionalRef = useRef();
  const [dummyInput, setDummyInput] = useState('');
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => console.log(`on-form-submit`, data);
  const onErrors = (errors) => console.error('on-form-error', errors);

  return (<form onSubmit={handleSubmit(onSubmit, onErrors)}>
    <Inputv2
      placeholder="Enter E-mail"
      name={'email'}
      label="Email"
      id='user-email'
      ref={
        register({
          required: {
            value: true,
            message: "Email is required"
          },
          maxLength: 50,
          minLength: 5,
          pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
        })
      }
      autoFocus={true}
      error={
        (errors?.email) ? errors?.email?.message || 'Invalid email' : ''
      }
    />
    <Inputv2 type="password"
      id='user-password'
      label='Password'
      placeholder='Enter Password'
      name="password"
      ref={register({ required: true, minLength: 6 })}
      error={
        (errors?.password) ?
          (errors.password.type === "required" ? "Password is required." : "Password should be at-least 6 characters.") : ''
      }
    />
    <Inputv2
      id='extra-details'
      label='Dummy input - not added in form submit'
      placeholder='Enter Password'
      name="dummy input"
      ref={additionalRef}
      note={"Note preview"}
      value={dummyInput}
      onChange={({ target: { value } }) => setDummyInput(value)}
    />
    <div className="form-control">
      <Button
        color="primary"
        text={`Submit`}
        fullWidth={true}
        size="md"
        onClick={() => handleSubmit(onSubmit, onErrors)}
      />
    </div>
  </form>);
}