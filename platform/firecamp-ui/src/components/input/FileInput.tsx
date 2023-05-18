//@ts-nocheck
import { FC, useRef } from 'react';
import {VscArrowRight} from '@react-icons/all-files/vsc/VscArrowRight';

import { IFileInput } from "./interfaces/FileInput.interfaces";

/**
 * File input component to select file as input
 */
const FileInput: FC<IFileInput> = ({
  ButtonText = 'Select',
  path = '',
  name = '',
  onSelectFile = () => { }
}) => {
  const inputEle = useRef(null);

  let _onSelectFile = e => {
    onSelectFile(e);
  };

  const _onClick = () => {
    inputEle.current.click();
  };
  return (
    <div className="w-fit w-max">
      <input
        name="select"
        style={{ display: 'none' }}
        ref={inputEle}
        id="file"
        accept="text"
        type="file"
        onChange={_onSelectFile}
      />
      {(!path || !path.length) && name && name.length ? (
        <div className="text-base text-appForegroundInActive">{name}</div> /*this path is not visible when upload file */
      ) : (
        ''
      )}
      {!path || !path.length ? (
        <label
          htmlFor="file_path"
          className=" bg-focus3 p-2 rounded-sm mb-2 text-app-foreground px-2 py-1 w-fit cursor-pointer flex flex-row items-center"
          onClick={_onClick}
        >

          <span className='pr-1 text-base'>{ButtonText}</span>
          <VscArrowRight size={12} />
        </label>
      ) : (
        <div onClick={_onClick} className="fc-input-file-name ">
          {path}
        </div>
      )}
    </div>
  );
};

export default FileInput;