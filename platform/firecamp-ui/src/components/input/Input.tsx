import { createStyles } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { ForwardedRef, forwardRef } from 'react';
import { IInput } from './interfaces/input.interfaces';

const useStyles = createStyles((theme) => ({
  root: {
    fontFamily: 'inherit',
    marginBottom: '1.25rem',
  },
  label: {
    fontSize: '0.75rem',
    color:
      theme.colorScheme === 'light'
        ? theme.colors.dark[5]
        : theme.colors.gray[4],
  },
  input: {
    padding: '0.5rem',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
    border: `0.063rem solid ${
      theme.colorScheme === 'light'
        ? theme.colors.gray[4]
        : theme.colors.dark[4]
    }`,
    outline: '2px solid transparent',
    '::placeholder': {
      color:
        theme.colorScheme === 'light'
          ? theme.colors.gray[6]
          : theme.colors.dark[3],
    },
    '&:disabled, &[data-disabled]': {
      backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
      color: 'inherit',
    },
    '&:focus': {
      border: `0.063rem solid ${theme.colors.blue[8]}`,
    },
    '&[data-invalid]': {
      color: 'inherit',
    },
  },
  error: {
    fontWeight: 300,
    color: theme.colors.red[7],
  },
}));

const Input = forwardRef(
  (
    { classNames = {}, ...props }: IInput,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { cx, classes } = useStyles();

    return (
      <TextInput
        classNames={{
          ...classNames,
          root: cx(classes.root, classNames.root),
          label: cx(classes.label, classNames.label),
          input: cx(classes.input, classNames.input),
          error: cx(classes.error, classNames.error),
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
