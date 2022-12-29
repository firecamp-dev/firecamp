import { FC, useState } from 'react';
import cx from 'classnames';

import { ICopyButton } from "./interfaces/CopyButton.interfaces"
import { _clipboard } from '@firecamp/utils'


const CopyButton: FC<ICopyButton> = ({
 id = '',
 className = '',
 text = '',
 children = [],
 showText = false,
 animation = true,
 onCopy = (text) => { }
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
   <div className={cx('fc-copy bg-gray-800', className)} data-testid="copy-button">
     {text && showText ? text : ''}
     {animation && showCopied ? <span>Copied!</span> : ''}
     {children && children.length ? (
       children
     ) : (
       <i className="iconv2-copy-icon" onClick={_onClickCopy} />
     )}
   </div>
 );
};
export default CopyButton