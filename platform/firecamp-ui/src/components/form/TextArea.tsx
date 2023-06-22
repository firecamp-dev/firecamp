import { FC } from "react";
import classNames from 'classnames';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo'

import {ITextArea} from "./interfaces/TextArea.interfaces"

/**
 * TextArea form element
 */
const TextArea: FC<ITextArea> = ({
  name = '',
  className = '',
  placeholder = '',
  value = '',
  defaultValue,
  label = '',
  labelClassName = '',
  note = '',
  minHeight = '',
  disabled= false,
  icon = '',
  iconPosition = 'left',
  onChange = () => { },
  ...restProps
}) => {


  let hasIconLeft = icon && iconPosition == "left";
  let hasIconRight = icon && iconPosition == "right";

  const valueProps: { value?: string, defaultValue?: string } = {};
  if(value) valueProps.value = value;
  else valueProps.defaultValue = defaultValue;

  return (
    <div className='flex flex-col mb-3 relative'>
      {label != '' ? <label className={classNames(labelClassName,'text-app-foreground text-sm mb-1 block')}>{label}</label> : ''}
      <div className="relative">
      <textarea
        name={name}
        className={classNames(className,'!border-input-border focus:bg-input-background-focus text-base p-2 text-input-text border resize-none rounded-sm bg-input-background w-full')}
        placeholder={placeholder}
        {...valueProps}
        onChange={onChange}
        style={{ minHeight }}
        disabled={disabled}
        {...restProps}
        tabIndex={1}
      ></textarea>
      <span className={classNames("absolute top-3 cursor-pointer",
                { 'left-2': hasIconLeft },
                { 'right-2': hasIconRight })}>{icon}</span>
                </div>
      {note != '' ? (
        <div className="text-xs flex items-center justify-start text-app-foreground">
        <VscInfo size={14} className='pr-1' />
          {note}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default TextArea;