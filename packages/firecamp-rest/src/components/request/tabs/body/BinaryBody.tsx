import { useEffect, useRef, useState } from 'react';
import { AiOutlineUpload } from '@react-icons/all-files/ai/AiOutlineUpload';
import { ERestBodyTypes } from '@firecamp/types';
import { FileDrop } from 'react-file-drop';

import {
  Container,
  Button,
  EButtonColor,
  EButtonSize,
  EButtonIconPosition,
} from '@firecamp/ui-kit';

const BinaryTab = ({ body, onChange }) => {
  const inputEle = useRef(null);
  // console.log({ body });

  let [fileName, setFileName] = useState('');
  let [errorMsg, setErrorMsg] = useState('');
  let [isButtonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    // console.log("file body--> component did mount");

    let _setFileName = async () => {
      // console.log({ body });

      let text: string = body?.value?.name || '';

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

  let _onDropFile = async (files, event) => {
    console.log('files[0]', files[0]);
    if (!files || !files[0]) {
      setErrorMsg('File not found!');
      setFileName('');
      setButtonDisabled(true);
    } else {
      let file = files[0];
      setFileName(file.name);

      // console.log("r", text);
      // _import(raw_text);
      setErrorMsg('');
      setButtonDisabled(false);
      _onChangeBinaryBodyValue(file);
    }
  };

  let _onSelectFile = async (e) => {
    let target = e.target;
    console.log(e, target.files[0]);
    if (!target || !target.files[0]) {
      setErrorMsg('File not found!');
      setFileName('');
      setButtonDisabled(true);
    } else {
      let file = target.files[0];
      setFileName(file.name);

      // let text = await _readFile(file).then((r) => r);

      setErrorMsg('');
      setButtonDisabled(false);
      _onChangeBinaryBodyValue(file);
    }
  };

  let _onChangeBinaryBodyValue = (text) => {
    onChange(ERestBodyTypes.Binary, text);
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
              secondary
              iconLeft
              sm
              text="Drop File Here"
              disabled={isButtonDisabled}
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
          {errorMsg ? <div className="fc-error">{errorMsg}</div> : ''}
        </FileDrop>
      </Container.Body>
    </Container>
  );
};

export default BinaryTab;
