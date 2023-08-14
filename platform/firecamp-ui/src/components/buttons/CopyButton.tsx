import { FC, useState } from 'react';
import cx from 'classnames';
import { Copy } from 'lucide-react';
import { _clipboard } from '@firecamp/utils';
import Button from './Button';
import { ICopyButton } from './interfaces/CopyButton.interfaces';

const CopyButton: FC<ICopyButton> = ({
  id = '',
  className = '',
  text = '',
  showText = false,
  animation = true,
  onCopy = (text) => {},
}) => {
  let [showCopied, toggleShowCopied] = useState(false);

  const _onClickCopy = (e: any) => {
    if (e) e.preventDefault();
    _clipboard.copy(text);
    onCopy(text);
    if (!showCopied) {
      toggleShowCopied(true);
      setTimeout(() => {
        toggleShowCopied(false);
      }, 2000);
    }
  };

  return (
    <Button
      leftIcon={
        <Copy
          size={12}
          onClick={_onClickCopy}
          className="align-baseline"
          data-testid="copy-icon"
        />
      }
      text={showText ? text : ''}
      rightIcon={
        animation && showCopied ? (
          <span className="text-sm">Copied!</span>
        ) : (
          <></>
        )
      }
      classNames={{
        root: cx(
          '!bg-transparent fc-copy bg-gray-800 text-app-foreground-inactive',
          className
        ),
      }}
      data-testid="copy-button"
      id={id}
    />
  );
};
export default CopyButton;
