import { ForwardedRef, forwardRef } from 'react';
import cx from 'classnames';
import { TextInput } from '@mantine/core';
import { IInput } from './interfaces/input.interfaces';

const Input = forwardRef(
  (
    { classNames = {}, ...props }: IInput,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <TextInput
        styles={{
          root: {
            fontFamily: 'inherit',
          },
        }}
        classNames={{
          ...classNames,
          root: cx('mb-5', classNames.root),
          label: cx('text-xs text-app-foreground', classNames.label),
          input: cx(
            'p-2 text-app-foreground bg-input-background border border-tab-border',
            'outline outline-2 outline-transparent',
            'placeholder:text-input-placeholder',
            'disabled:bg-input-background disabled:text-inherit',
            'data-[disabled=true]:bg-input-background data-[disabled=true]:text-inherit',
            'data-[invalid=true]:text-inherit',
            classNames.input
          ),
          error: cx('font-light text-error', classNames.error),
        }}
        radius={'xs'}
        variant="filled"
        ref={ref}
        {...props}
      />
    );
  }
);

export default Input;
