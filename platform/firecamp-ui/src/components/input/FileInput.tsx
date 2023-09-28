import { FC } from 'react';
import cx from 'classnames';
import { FileInputProps, FileInput as MantineFileInput } from '@mantine/core';
import { IFileInput } from './interfaces/FileInput.interfaces';

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
  return (
    <MantineFileInput
      classNames={{
        ...classNames,
        root: cx(classNames.root),
        icon: cx(
          { '!text-secondaryColor-text px-2.5': secondary },
          classNames.icon
        ),
        input: cx(
          ' !border-transparent',
          {
            '!text-secondaryColor-text bg-secondaryColor min-h-[30px] px-2.5 data-[disabled=true]:!text-secondaryColor-text data-[disabled=true]:bg-secondaryColor':
              secondary,
          },
          {
            'text-app-foreground bg-transparent border-none	leading-[21px] whitespace-pre	min-h-[auto] pl-1 pr-4':
              !secondary,
          },
          classNames.input
        ),
        placeholder: cx(
          { '!text-app-foreground ': !secondary },
          {
            '!text-secondaryColor-text bg-secondaryColor': secondary,
          },
          classNames.placeholder
        ),
      }}
      radius={'sm'}
      {...props}
      valueComponent={ValueComponent}
    />
  );
};
export default FileInput;
