import { FC } from 'react';
import classnames from 'classnames';
import './Notes.scss';

/**
 * Firecamp note to show important updates, feature information
 */
const Notes: FC<IProps> = ({
  title = '',
  description = '',
  showIcon = true,
  type = 'info',
  withPadding = false,
  className = '',
}) => {
  return (
    <div
      className={classnames(
        'fc-common-notes text-sm flex items-center p-3 bg-focus1 border-l-2 border-solid border-transparent',
        type,
        { 'p-4': withPadding },
        className
      )}
    >
      {showIcon == true ? (
        <div className="text-md mr-3 icon">
          <span className="icv2-info-icon"></span>
        </div>
      ) : (
        <></>
      )}
      <div className="text-appForegroundInActive">
        {title != '' ? (
          <div className="mb-2 font-semibold	text-app-foreground">{title}</div>
        ) : (
          ''
        )}
        {description != '' ? (
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Notes;

interface IProps {
  /**
   * Title to show the purpose of note
   */
  title?: string;
  /**
   * Note brief description
   */
  description?: string;

  className?: string;
  /**
   * Boolean value whether you want to show note icon or not
   */
  showIcon?: boolean;
  /**
   * Note type ['info']
   */
  type?: 'info' | 'warning' | 'danger' | 'success';
  /**
   * Boolean value whether you want to have padding in style
   */
  withPadding?: boolean;
}
