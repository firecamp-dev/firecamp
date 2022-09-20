import { FC } from 'react';

const Header: FC<IHeader> = ({
  name = 'My account',
  title = 'User Setting',
}) => {
  return (
    <div className="p-3 bg-focus1 text-lg">
      {name || ''}
      <span className="block text-sm text-appForegroundInActive">{title}</span>
    </div>
  );
};

export default Header;

interface IHeader {
  name: string;
  title?: string;
}
