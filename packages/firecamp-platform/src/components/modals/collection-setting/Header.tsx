// @ts-nocheck
import { FC } from 'react';

const Header: FC<IHeader> = ({
  name = 'Firecamp',
  title = 'Collection Setting',
}) => {
  return (
    <div className="p-3 bg-focus1 text-lg">
      {/* <div className="fc-info-title-sh">{(name || '').charAt(0) || ''}</div> */}
      {name || ''}
      <span className="block text-sm text-appForegroundInActive">{title}</span>
    </div>

    /* <div className="fc-info-title">
      <div className="fc-info-title-sh">{(name || '').charAt(0) || ''}</div>
      <div className="fc-info-title-content">
        <div className="fc-title">{name || ''}</div>
        <div className="fc-sub-title">{title}</div>
      </div>
    </div> */
  );
};

export default Header;

interface IHeader {
  name: string;
  title: string;
}
