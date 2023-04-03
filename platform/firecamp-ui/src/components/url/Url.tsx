import { FC } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import UrlEditor from './primitives/UrlEditor';
import UrlBar from './primitives/UrlBar';
import _url from '@firecamp/url';

const Url: FC<IUrl> = ({
  id,
  url,
  path = '',
  placeholder = 'http://',
  isRequestSaved = false,
  prefixComponent = <></>,
  suffixComponent = <></>,
  onEnter,
  onChange,
  onPaste,
  promptRenameRequest,
}) => {
  return (
    <UrlBar
      nodePath={path}
      showEditIcon={isRequestSaved}
      onEditClick={promptRenameRequest}
    >
      <UrlBar.Prefix>{prefixComponent}</UrlBar.Prefix>
      <UrlBar.Body>
        <UrlEditor
          id={id}
          url={url || ''}
          placeholder={placeholder}
          onChangeURL={onChange}
          onEnter={onEnter}
          onPaste={onPaste}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>{suffixComponent}</UrlBar.Suffix>
    </UrlBar>
  );
};

export default Url;

interface IUrl {
  id: string;
  url: string;
  path?: string;
  placeholder?: string;
  isRequestSaved?: boolean;
  prefixComponent?: JSX.Element | JSX.Element[];
  suffixComponent?: JSX.Element | JSX.Element[];
  onChange: (e: { preventDefault: () => void; target: { value: any } }) => void;
  onEnter?: () => void;
  onPaste?: (snippet: string, edt: any) => void;
  promptRenameRequest?: () => void;
}
