import { FC } from 'react';
import { Column, Row, SingleLineEditor } from '@firecamp/ui';
import { EEditorLanguage } from '@firecamp/types';

const UrlEditor: FC<IUrlEditor> = ({
  id = '',
  placeholder = '',
  url,
  onChangeURL,
  onEnter,
  onPaste,
  autoFocus = true,
}) => {
  return (
    <Row className="">
      <Column flex={1}>
        <SingleLineEditor
          key={id}
          path={id}
          value={url}
          height={21}
          type="text"
          placeholder={placeholder}
          language={EEditorLanguage.FcText}
          autoFocus={autoFocus}
          monacoOptions={{
            fontSize: 16,
            fontWeight: '500',
          }}
          className="without-border without-padding"
          onChange={onChangeURL}
          onEnter={onEnter}
          onPaste={onPaste}
        />
      </Column>
    </Row>
  );
};

export default UrlEditor;

interface IUrlEditor {
  /** identifier */
  id: string;

  /** placeholder value */
  placeholder: string;

  /** url as string */
  url: string;

  /** callback on url change */
  onChangeURL: (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => void;

  /** on enter */
  onEnter?: () => void;

  /** on paste */
  onPaste?: (paste: string, edt: any) => void;

  /** auto focus url input*/
  autoFocus?: boolean;
}
