import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { FileDrop } from 'react-file-drop';
import { Container, Button, FileInput } from '@firecamp/ui';

const BinaryTab = ({ body, onChange }) => {

  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    // console.log("file body--> component did mount", file, body);

    const _checkFileName = async () => {
      const text: string = body?.value?.name || '';
      if (file?.name !== text) {
        setFile(body.value);
      }
    };
    setErrorMsg('');
    setButtonDisabled(false);
    _checkFileName();
  }, [body]);

  const _onDropFile = async (files, event) => {
    console.log('files[0]', files[0]);
    if (!files || !files[0]) {
      setErrorMsg('File not found!');
      setFile(null);
      setButtonDisabled(true);
    } else {
      const file = files[0];
      setFile(file);

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
      setFile(null);
      setButtonDisabled(true);
    } else {
      setFile(file);

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
            accept="text/*"
            error={
              errorMsg ? <div className="fc-error">{errorMsg}</div> : undefined
            }
            value={
              file && !errorMsg ? file : undefined
            }
            {...((file && !errorMsg)
              ? {
                size: 'md',
              } : {
                  secondary: true,
                  icon: <Upload size={16} />,
                  iconWidth: 40,
                  size: 'xs',
                }
              )}
          />
        </FileDrop>
      </Container.Body>
    </Container>
  );
};

export default BinaryTab;
