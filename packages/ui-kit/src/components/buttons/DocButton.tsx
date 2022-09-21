import { FC } from "react";
import { IDocButton } from "./interfaces/DocButton.interfaces"

const DocButton: FC<IDocButton> = ({
  text = 'Help',
  link = 'https://firecamp.io/docs/',
  target = '_blank',
  className = 'transparent without-padding small',
  showIcon = true,
  iconClassName = 'icon-info-24px-1 font-base',
  style = {}
}) => {
  return (
    <a
      className={className || 'fc-button transparent without-padding'}
      href={link || 'https://firecamp.io/docs/'}
      target={target || '_blank'}
      style={style}
    >
      {showIcon === true ? (
        <span className={iconClassName + ` fc-button-icon`}></span>
      ) : (
        ''
      )}
      {text || 'Help'}
    </a>
  );
};

export default DocButton;
