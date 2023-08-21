import { FC } from 'react';
import {
  FileInputProps,
  FileInput as MantineFileInput,
  createStyles,
} from '@mantine/core';
import { IFileInput } from './interfaces/FileInput.interfaces';

const useStyles = createStyles((theme) => ({
  input: {
    border: 'none',
    background: 'transparent',
    paddingLeft: '4px',
    paddingRight: '16px',
    minHeight: 'auto',
    lineHeight: '21px',
    whiteSpace: 'pre',
  },
  placeholder: {
    color: `${
      theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.dark[5]
    } !important`,
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

const FileInput: FC<IFileInput> = ({ classNames = {}, ...props }) => {
  const { classes, cx } = useStyles();
  return (
    <MantineFileInput
      classNames={{
        input: cx(classes.input, classNames.input),
        placeholder: cx(classes.placeholder, classNames.placeholder),
      }}
      {...props}
      valueComponent={ValueComponent}
    />
  );
};
export default FileInput;
