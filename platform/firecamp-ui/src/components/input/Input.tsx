import React, { FC } from 'react';
import cx from 'classnames';
import { SingleLineEditor } from '@firecamp/ui';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';

import { IInput } from './interfaces/input.interfaces';
import './InputBox.sass';
import { EEditorLanguage } from '@firecamp/types';

const Input: FC<IInput> = React.forwardRef(
  (
    {
      id = '',
      autoFocus = false,
      className = '',
      wrapperClassName = '',
      placeholder = '',
      value = '',
      defaultValue,
      icon = '',
      iconPosition = 'left',
      registerMeta = {},
      useformRef,
      name = '',
      label = '',
      error = '',
      note = '',
      type = '',
      isEditor = false,
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
    // TODO: review/discuss 'useformRef' prop

    let hasIconLeft = icon && iconPosition == 'left';
    let hasIconRight = icon && iconPosition == 'right';

    /**
     * HACK: manage input props to manage { useForm } from 'react-hook-form'
     * If useformRef is been passed then use useformRef as reference
     * Else, use value as useformRef uses reference instead value
     */
    let inputMeta = {};
    if (useformRef?.register) {
      inputMeta = { ref: useformRef?.register?.(registerMeta) };
    } else {
      if (defaultValue === undefined) inputMeta = { value };
      else inputMeta = { defaultValue };
    }

    return (
      <div
        className={cx(
          'relative items-center text-inputText text-sm w-full mb-5',
          wrapperClassName
        )}
      >
        {label !== '' && (
          <label
            className="text-app-foreground text-sm mb-1 block"
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
        {isEditor === false ? (
          <div
            className={cx('w-full relative', { flex: postComponents?.length })}
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
              {...inputMeta}
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
            {postComponents || <></>}
            {error && <ErrorMessage error={error} />}
            {note && <Note note={note} />}
          </div>
        ) : (
          <div>
            <SingleLineEditor
              id={id}
              className={cx('border px-2 py-1 border-inputBorder', className)}
              autoFocus={autoFocus}
              type={type == 'number' ? 'number' : 'text'}
              value={value}
              name={name}
              disabled={disabled}
              height="21px"
              language={EEditorLanguage.FcText}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              // onKeyDown={onKeyDown}
            />
            {postComponents || ''}
            {error && <ErrorMessage error={error} />}
            {note && <Note note={note} />}
          </div>
        )}
      </div>
    );
  }
);

export default Input;

const ErrorMessage: FC<{ error: string | JSX.Element }> = ({ error }) => {
  return (
    <div className={cx('text-sm font-light text-error block absolute')}>
      {error}
    </div>
  );
};

const Note = ({ note = '' }) => {
  return (
    <div className="text-xs text-app-foreground  flex items-center">
      <VscInfo />
      {note}
    </div>
  );
};
