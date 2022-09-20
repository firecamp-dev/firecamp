//@ts-nocheck
import { FC } from "react";
import { IAvailableOnElectron } from "./interfaces/AvailableOnElectron.interfaces"

/**
 * Component to inform user that the Firecamp feature is available on electron app only.
 * @param 
 * @returns 
 */
const AvailableOnElectron: FC<IAvailableOnElectron> = ({
  name = '',
  link = '',
  linkText = 'desktop app'
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-appForeground">
      {' '}
      <div className="fc-help-list">
        <div key={'help-text'}>
          {name && name.length ? name : 'This'} is a desktop specific feature,
          download the
        </div>
        <a
          className="text-primaryColor"
          href={link && link.length ? link : 'https://firecamp.io/download/'}
          style={{ textDecoration: 'underline' }}
          target="_blank"
        >
          {' '}
          {linkText}{' '}
        </a>{' '}
        to enable this feature.
      </div>
    </div>
  );
};

export default AvailableOnElectron;
