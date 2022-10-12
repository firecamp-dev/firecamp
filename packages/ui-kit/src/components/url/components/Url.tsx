import { FC } from 'react';
import { Column, Row, SingleLineEditor } from '@firecamp/ui-kit';

import { IFELanguages } from '@firecamp/ui-kit/src/components/editors/monaco/lang/IFE.constants';
import '../sass/URLbar-v2.sass';

const Url: FC<IUrl> = ({
  id = '',
  placeholder = '',
  url,
  onChangeURL,
  onEnter,
  onPaste,
  autoFocus = true,
}) => {
  return (
    <Row className="fc-urlbar">
      <Column flex={1} className="fc-urlbar-input" style={{ marginTop: 50 }}>
        <Row className="flex-col">
          <Column overflow="visible">
            <SingleLineEditor
              value={url}
              language={IFELanguages.TEXT}
              onChange={onChangeURL}
              autoFocus={autoFocus}
              placeholder={placeholder}
              monacoOptions={{
                fontSize: 16,
                fontWeight: 600,
              }}
              className="without-border without-padding"
              height={21}
              path={id}
              type="text"
              onEnter={onEnter}
              onPaste={onPaste}
            />
          </Column>
        </Row>
      </Column>
    </Row>
  );
};

export default Url;

interface IUrl {
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
  onPaste?: (edt: any) => void;

  /** auto focus url input*/
  autoFocus?: boolean;
}
