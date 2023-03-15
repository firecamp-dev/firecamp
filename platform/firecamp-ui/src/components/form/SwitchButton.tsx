//@ts-nocheck
import { FC, useRef, forwardRef } from 'react';
import { ISwitchButton } from "./interfaces/SwitchButton.interfaces"
import './SwitchButton.sass'


/**
 * Switch/ toggle button 
 */
const SwitchButton: FC<ISwitchButton> = forwardRef(
  ({ id, checked = true, onChange = () => { } }, ref) => {
    let fRef = useRef(ref);
    return (
      <div className="fc-switch" ref={fRef}>
        <div className="toggleWrapper">
          <input
            className="switch"
            id={id}
            type="checkbox"
            checked={checked}
            onChange={() => onChange(!checked)}
          />
          <label htmlFor={id} className="toggle">
            <span className="toggle__handler" />
          </label>
        </div>
      </div>
    );
  }
);

export default SwitchButton;

