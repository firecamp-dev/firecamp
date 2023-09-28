import { FC } from 'react';
import cx from 'classnames';
import { Textarea, TextareaProps } from '@mantine/core';

export interface ITextArea extends TextareaProps {}

/**
 * TextArea form element
 */
const TextArea: FC<ITextArea> = ({ classNames = {}, ...props }) => {
  return (
    <Textarea
      styles={{
        root: {
          fontFamily: 'inherit',
        },
      }}
      classNames={{
        ...classNames,
        root: cx('mb-2', classNames.root),
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
      {...props}
    />
  );
};

export default TextArea;
