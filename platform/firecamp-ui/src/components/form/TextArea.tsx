import { FC } from 'react';
import { Textarea, TextareaProps, createStyles } from '@mantine/core';

export interface ITextArea extends TextareaProps {}

const useStyles = createStyles((theme) => ({
  root: {
    fontFamily: 'inherit',
    marginBottom: '0.5rem',
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

/**
 * TextArea form element
 */
const TextArea: FC<ITextArea> = ({ classNames = {}, ...props }) => {
  const { cx, classes } = useStyles();

  return (
    <Textarea
      classNames={{
        ...classNames,
        root: cx(classes.root, classNames.root),
        label: cx(classes.label, classNames.label),
        input: cx(classes.input, classNames.input),
        error: cx(classes.error, classNames.error),
      }}
      radius={'xs'}
      variant="filled"
      {...props}
    />
  );
};

export default TextArea;