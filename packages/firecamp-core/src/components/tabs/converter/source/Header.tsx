// @ts-nocheck
import { FC } from 'react';
import { ISourceState } from '../types';

const Header: FC<IHeader> = ({
  source: {
    allowedTypes = {},
    type = '',
    isUpdating = false,
    hasTypeDetected = false,
    hasError = false,
  },
  requestMeta = { name: '' },
}) => {
  let renderType = (
    hasTypeDetected: boolean,
    isUpdating: boolean,
    hasError: boolean,
    type: string,
    typeName: any
  ) => {
    if ((hasTypeDetected || !isUpdating) && type != 'OTHER') {
      if (hasError) {
        return <strike>{typeName}</strike>;
      } else {
        return typeName;
      }
    } else {
      return <strike>JSON</strike>;
    }
  };

  return (
    <div className="flex text-base items-center" style={{ fontSize: 13 }}>
      <div className="selected border-primaryColor mx-2 border-b-2">
        {renderType(
          hasTypeDetected,
          isUpdating,
          hasError,
          type,
          type != 'OTHER' ? allowedTypes[type].name : ''
        )}
      </div>
      <div className="border-transparent mx-2 border-b-2">
        {requestMeta?.name || 'Untitled-1'}
      </div>
    </div>
  );
};

export default Header;

interface IHeader {
  /**
   * Converter tab source data
   */
  source: ISourceState;

  /**
   * Request tab meta
   */
  requestMeta?: { name: string };
}
