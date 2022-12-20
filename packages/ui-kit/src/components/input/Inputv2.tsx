//@ts-nocheck
import React, { FC } from 'react';
import cx from 'classnames';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';

import { IInput } from './interfaces/input.interfaces';
import './InputBox.sass';

/**
* Inputv2: To use input field with "react-hook-form" functionality: 
* 1. Pass the ref with register function of 'useForm' hook 
* 2. The value prop should not be passed from parent component
* So that the input field will remain in un-controlled state 
**/
export const Input: FC<IInput> = React.forwardRef(
  (
    {
      id = '',
      autoFocus = false,
      className = '',
      wrapperClassName = '',
      placeholder = '',
      value,
      defaultValue,
      icon = '',
      iconPosition = 'left',
      name = '',
      label = '',
      error = '',
      note = '',
      type = '',
      disabled = false,
      postComponents = [],
      onChange = () => { },
      onKeyDown = () => { },
      onBlur = () => { },
      onFocus = () => { },
      ...domProps
    },
    ref
  ) => {

    let hasIconLeft = icon && iconPosition == 'left';
    let hasIconRight = icon && iconPosition == 'right';

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
        
        <div
          className={cx('w-full relative', { flex: postComponents != '' })}
        >
          <input
            {...domProps}
            ref={ref}
            id={id}
            key={name}
            name={name}
            type={type}
            className={cx(
              'border !border-inputBorder rounded-sm p-2 leading-5 outline-none placeholder-inputPlaceholder text-base focus:bg-inputFocusBackground w-full bg-inputBackground',
              { '!pl-9': hasIconLeft },
              { '!pr-9': hasIconRight },
              className
            )}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            tabIndex={1}
          />
          <span
            className={cx(
              'absolute top-3 cursor-pointer',
              { 'left-2': hasIconLeft },
              { 'right-2': hasIconRight }
            )}
          >
            {icon}
          </span>
          {postComponents || ''}
          {error && <ErrorMessage error={error} />}
          {note && <Note note={note} />}
        </div>
      </div>
    );
  }
);
export default Input;

const ErrorMessage = ({ error = '', className }) => {
  return (
    <div className={cx('text-sm font-light text-error block absolute')}>
      {error}
    </div>
  );
};

const Note = ({ note = '' }) => {
  return (
    <div className="text-xs text-appForeground  flex items-center">
      <VscInfo title='info-icon'/>
      {note}
    </div>
  );
};
