import { useCallback, FC } from 'react';
import { useDropzone } from 'react-dropzone';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

const ImportDropZone: FC<{
  importCollection: (payload: any) => void;
  isImporting: boolean;
}> = ({ importCollection, isImporting = false }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles?.length) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // do whatever you want with the file contents
      const fileContent = reader.result;
      // console.log(fileContent, typeof fileContent, reader);
      importCollection(fileContent);
    };
    reader.readAsText(file);
  }, []);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      accept: {
        'application/json': ['.json'],
      },
      onDrop,
      disabled: isImporting,
    });

  if (fileRejections?.length) {
    console.log(fileRejections);
    //TODO: show error message
  }

  if (acceptedFiles?.length) {
    // console.log(acceptedFiles)
  }

  return (
    <div className="h-full w-full dropzone-wrapper">
      <div {...getRootProps({ className: 'dropzone cursor-pointer ' })}>
        <input {...getInputProps()} />
        <h1 className="text-base text-appForeground font-semibold">
          {isImporting
            ? 'Importing the API collection...'
            : 'DROP API COLLECTION HERE'}
        </h1>
        {!isImporting ? (
          <span className="text-sm text-appForegroundInActive">
            Firecamp, Postman formats are supported
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default ImportDropZone;
