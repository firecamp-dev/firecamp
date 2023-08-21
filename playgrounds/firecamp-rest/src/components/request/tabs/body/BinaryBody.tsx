import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { FileDrop } from 'react-file-drop';
import { Container, Button, FileInput } from '@firecamp/ui';

const BinaryTab = ({ body, onChange }) => {

  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    // console.log("file body--> component did mount");

    const _setFileName = async () => {
      const text: string = body?.value?.name || '';
      if (fileName !== text) {
        setFileName(text);
      }
    };
    setErrorMsg('');
    setButtonDisabled(false);
    _setFileName();
  }, [body]);

  const _onDropFile = async (files, event) => {
    console.log('files[0]', files[0]);
    if (!files || !files[0]) {
      setErrorMsg('File not found!');
      setFileName('');
      setButtonDisabled(true);
    } else {
      const file = files[0];
      setFileName(file.name);

      // console.log("r", text);
      // _import(raw_text);
      setErrorMsg('');
      setButtonDisabled(false);
      onChange(file);
    }
  };

  const _onSelectFile = async (file) => {
    if (!file) {
      setErrorMsg('File not found!');
      setFileName('');
      setButtonDisabled(true);
    } else {
      setFileName(file.name);

      // let text = await _readFile(file).then((r) => r);

      setErrorMsg('');
      setButtonDisabled(false);
      onChange(file);
    }
  };

  return (
    <Container>
      <Container.Body className="flex items-center justify-center">
        <FileDrop onDrop={_onDropFile}>
          <FileInput
            placeholder={'Drop File Here'}
            disabled={isButtonDisabled}
            onChange={_onSelectFile}
            accept='text'
            error={
              errorMsg ? <div className="fc-error">{errorMsg}</div> : undefined
            }
            value={
              fileName && !errorMsg ? ({ name: fileName } as File) : undefined
            }
            {...(!(fileName && !errorMsg)
              ? {
                  secondary: true,
                  icon: <Upload size={16} />,
                  iconWidth: 40,
                  size: 'xs',
                }
              : {
                  size: 'md',
                })}
          />

          
        </FileDrop>
      </Container.Body>
    </Container>
  );
};

export default BinaryTab;
