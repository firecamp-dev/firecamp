// @ts-nocheck

import { FC, useRef, useState } from 'react';

import { FileDrop } from 'react-file-drop';

import ImportingToBlackhole from './ImportingToBlackhole';

const Blackhole: FC<IBlackhole> = ({
  isImporting = false,
  importNotification = {},
  addProjectInArray = () => {},
}) => {
  let [fileData, setFileData] = useState({
    name: '',
    raw_text: '',
  });
  const inputEle = useRef(null);

  let _onButtonClick = () => {
    inputEle.current.click();
  };

  let _readFile = (file) => {
    return new Promise(async (rs, rj) => {
      let reader = new FileReader();
      reader.onload = () => {
        let text = reader.result;
        rs(text);
      };
      reader.readAsText(file);
    });
  };

  let _onDropFile = async (files, event) => {
    // console.log("files[0]", files[0]);

    event.preventDefault();
    if (!files || !files[0]) {
      setFileData({
        ...fileData,
        name: '',
      });
    } else {
      setFileData({
        ...fileData,
        name: files[0].name,
      });
      let text = await _readFile(files[0])
        .then((r) => r)
        .catch((e) => {
          console.log('e', e);
        });

      setFileData({
        ...fileData,
        raw_text: text,
      });
      await addProjectInArray(text);
    }
  };

  let _onSelectFile = async (e) => {
    let target = e.target;
    // console.log(e, target.files[0]);
    if (target && target.files[0]) {
      let text = await _readFile(target.files[0]).then((r) => r);
      // console.log("r", text);
      await addProjectInArray(text);
    }
  };

  return isImporting ? (
    <ImportingToBlackhole />
  ) : (
    <div
      className="fc-dropzone bg-main"
      onClick={_onButtonClick}
      style={{
        borderColor:
          importNotification && importNotification.message
            ? importNotification.flag
              ? 'green'
              : 'red'
            : '',
      }}
    >
      <FileDrop onDrop={_onDropFile}>
        <input
          style={{ display: 'none' }}
          ref={inputEle}
          id="file"
          accept="text"
          type="file"
          onChange={_onSelectFile}
        />
        <div className="fc-dropzone-content">
          <span className="iconv2-folder-icon"></span>
          <div className="title">Import Zone</div>
          <div className="description">Drop your API spec/format file here</div>
        </div>
      </FileDrop>
    </div>
  );
};
export default Blackhole;

interface IBlackhole {
  isImporting: boolean;
  importNotification: any; // {}
  addProjectInArray: Function;
}
