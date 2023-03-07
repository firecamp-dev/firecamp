//@ts-nocheck
import { FC } from "react";
import classnames from 'classnames';

import { INotes } from "./interfaces/Notes.interfaces";
import './Notes.scss';

/**
 * Firecamp note to show important updates, feautre information
 */
const Notes: FC<INotes> = ({
  title = '',
  description = '',
  showicon = true,
  type = 'info',
  withpadding = false,
  className=''
}) => {
  return (
    <div
      className={classnames('fc-common-notes text-sm flex items-center p-3 bg-focus1 border-l-2 border-solid border-transparent', type, { 'p-4': withpadding },className)}
    >
      {showicon == true ? (
        <div className="text-md mr-3 icon">
          <span className="iconv2-info-icon"></span>
        </div>
      ) : (
        ''
      )}
      <div className="text-appForegroundInActive">
        {title != '' ? <div className="mb-2 font-semibold	text-appForeground">{title}</div> : ''}
        {description != '' ? (
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Notes;
