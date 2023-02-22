import { useEffect, useRef, useState } from 'react';
import { AiOutlineUpload } from '@react-icons/all-files/ai/AiOutlineUpload';
import { FileDrop } from 'react-file-drop';
import { Container, Button } from '@firecamp/ui-kit';

const BinaryTab = ({ body, onChange }) => {
  const inputEle = useRef(null);
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

  const _onButtonClick = () => {
    inputEle.current.click();
  };

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

  const _onSelectFile = async (e) => {
    let target = e.target;
    console.log(e, target.files[0]);
    if (!target || !target.files[0]) {
      setErrorMsg('File not found!');
      setFileName('');
      setButtonDisabled(true);
    } else {
      const file = target.files[0];
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
          {fileName && !errorMsg ? (
            <div style={{ fontSize: '17px' }} onClick={_onButtonClick}>
              {fileName}
            </div>
          ) : (
            <Button
              onClick={_onButtonClick}
              icon={<AiOutlineUpload className="mr-2" size={16} />}
              text="Drop File Here"
              disabled={isButtonDisabled}
              secondary
              iconLeft
              sm
            />
          )}

          <input
            style={{ display: 'none' }}
            ref={inputEle}
            id="file"
            accept="text"
            type="file"
            onChange={_onSelectFile}
          />
          {errorMsg ? <div className="fc-error">{errorMsg}</div> : <></>}
        </FileDrop>
      </Container.Body>
    </Container>
  );
};

export default BinaryTab;
