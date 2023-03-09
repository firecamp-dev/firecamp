//@ts-nocheck
import { FC } from "react";
import './button.css';
import { IButton } from "./interfaces/Button.interfaces"

/**
 * Primary UI component for user interaction         
 */
const Button: FC<IButton> =
  ({ primary, backgroundColor, size, label, onClick, ...props }) => {
    const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    return (
      <button
        type="button"
        className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
        style={backgroundColor && { backgroundColor }}
        onClick={onClick}
        {...props}
      >
        Run in Firecamp!!
      </button>
    );
  };

export default Button

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};
