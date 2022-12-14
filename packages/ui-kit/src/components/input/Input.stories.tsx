//@ts-nocheck
import Input from './Input';
import Button from '../buttons/Button'
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';

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


const Inputv2 =
  (
    {
      wrapperClassName = '',
      label = '',

      icon = '',
      iconPosition = 'left',

      id = '',
      autoFocus = false,
      className = '',
      placeholder = '',
      value = '',
      defaultValue,
      name = '',
      type = '',
      disabled = false,
      onChange = () => { },
      onKeyDown = () => { },
      onBlur = () => { },
      onFocus = () => { },

      isEditor = false,
      registerMeta = {},
      useformRef = () => { },

      postComponents = [],
      error = '',
      note = '',

      ...domProps
    }
  ) => {
    // TODO: discuss 'useformRef' prop

    const [inputMeta, setInputMeta] = useState({});
    let hasIconLeft = icon && iconPosition == 'left';
    let hasIconRight = icon && iconPosition == 'right';

    /**
     * HACK: manage input props to manage { useForm } from 'react-hook-form'
     * If useformRef is been passed then use useformRef as reference
     * Else, use value as useformRef uses reference instead value
     */
    let watchAllFields;
    useEffect(() => {

      if (useformRef?.register) {
        const { watch, handleSubmit, errors, register } = useformRef;
        setInputMeta({ ref: register?.(name,registerMeta) });

      } else {
        if (defaultValue === undefined) setInputMeta({ value });
        else setInputMeta({ defaultValue });
      }

    }, []);
    // console.log(`form-ref-here`, useformRef);

    return (
      <div
        className={cx(
          'relative items-center text-inputText text-sm w-full mb-5',
          wrapperClassName
        )}
      >
        {label !== '' && (
          <label
            className="text-appForeground text-sm mb-1 block"
            htmlFor={label}
          >
            {label}
          </label>
        )}
        {!!icon && (
          <span
            className={cx(
              'absolute flex items-center top-2',
              { 'left-3': hasIconLeft },
              { 'right-3': hasIconRight },
              { 'text-inputText': value != '' },
              { 'text-inputPlaceholder': value == '' }
            )}
          ></span>
        )}
        <div
          className={cx('w-full relative', { flex: postComponents != '' })}
        >
          <input
            type="text"
            className={cx(
              'border !border-inputBorder rounded-sm p-2 leading-5 outline-none placeholder-inputPlaceholder text-base focus:bg-inputFocusBackground w-full bg-inputBackground',
              { '!pl-9': hasIconLeft },
              { '!pr-9': hasIconRight },
              className
            )}
            // name={name}
            {...useformRef.register(name, registerMeta)} 
            // {...inputMeta}
            />
          {/* <input
            // {...domProps}
            // ref={ref}
            id={id}
            key={name}

            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            tabIndex={1}
            

          /> */}
        </div>
      </div>
    );
  };


export const TemplateWithFormHook = (args) => {

    const form = useForm();
    const [formSubmit, setFormSubmit] = useState(false);
    const { watch, handleSubmit, errors, register } = form;

    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

    const onFormSubmit = data => {
        if (formSubmit) return;

        console.log('on-submit', data)
        setFormSubmit(true)
        setTimeout(() => setFormSubmit(false), 5000)
    };

    const onErrors = errors => { console.error('on-error', errors) };

    const _onKeyDown = (e: any) => e.key === 'Enter' && handleSubmit(onFormSubmit);

    console.log("'on-submit'", watchAllFields);

    return (<form onSubmit={handleSubmit(onFormSubmit, onErrors)}>

        {/* <input type="text" name="showAge" ref={register} /> */}
        {/* <Input type="text" useformRef={form} name="lastName" /> */}
        <Inputv2
            placeholder="Enter E-mail"
            key={'email'}
            name={'email'}
            label="Email"
            type='text'
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
            text={`Send`}
            fullWidth={true}
            size="md"
            onClick={handleSubmit(onFormSubmit)}
        />
    </form>);
}