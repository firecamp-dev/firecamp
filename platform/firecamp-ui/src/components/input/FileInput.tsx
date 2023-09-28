import { FC } from 'react';
import cx from 'classnames';
import {
  FileInputProps,
  FileInput as MantineFileInput,
  createStyles,
} from '@mantine/core';
import { IFileInput } from './interfaces/FileInput.interfaces';

const useStyles = createStyles((theme, { secondary }: IFileInput) => ({
  root: {},
  input: {
    background: 'transparent',
    borderColor: 'transparent !important',

    // same color for both light/dark color variant
    ...(secondary
      ? {
          color: `${theme.white} !important`,
          backgroundColor: theme.colors.dark[4],
          ':hover': {
            backgroundColor: theme.colors.dark[5],
          },
        }
      : {
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.gray[4]
              : theme.colors.dark[5],
        }),
    '&:disabled, &[data-disabled]': {
      ...(secondary
        ? {
            color: `${theme.white} !important`,
            backgroundColor: theme.colors.dark[4],
          }
        : {}),
    },

    ...(secondary
      ? {
          minHeight: '1.875rem',
          paddingLeft: 'calc(1.875rem / 3)',
          paddingRight: 'calc(1.875rem / 3)',
        }
      : {
          border: 'none',
          lineHeight: '21px',
          whiteSpace: 'pre',

          minHeight: 'auto',
          paddingLeft: '4px',
          paddingRight: '16px',
        }),
  },
  icon: {
    ...(secondary
      ? {
          color: `${theme.white} !important`,
          paddingLeft: 'calc(0.875rem  / 1.5)',
          paddingRight: 'calc(0.875rem  / 1.5)',
        }
      : {}),
  },
  placeholder: {
    color: `${
      theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.dark[5]
    } !important`,
    ...(secondary
      ? {
          color: `${theme.white} !important`,
        }
      : {}),
  },
}));

const Value = ({ file }: { file: File }) => {
  return <span>file: {file.name}</span>;
};

const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((file, index) => (
          <Value file={file} key={index} />
        ))}
      </>
    );
  }

  return <Value file={value} />;
};

const FileInput: FC<IFileInput> = ({
  classNames = {},
  secondary = false,
  ...props
}) => {
  const { classes } = useStyles({ secondary });
  return (
    <MantineFileInput
      classNames={{
        ...classNames,
        root: cx(classes.root, classNames.root),
        icon: cx(classes.icon, classNames.icon),
        input: cx(classes.input, classNames.input),
        placeholder: cx(classes.placeholder, classNames.placeholder),
      }}
      radius={'sm'}
      {...props}
      valueComponent={ValueComponent}
    />
  );
};
export default FileInput;
