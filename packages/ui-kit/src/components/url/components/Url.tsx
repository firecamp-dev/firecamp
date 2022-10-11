import { FC } from "react";
import { Column, Row, SingleLineEditor, SingleLineIFE } from '@firecamp/ui-kit';

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
      {/*  <Column width="fit-content" className="fc-urlbar-methods">
      </Column> */}
      <Column flex={1} className="fc-urlbar-input" style={{ marginTop: 50 }}>
        <Row className="flex-col">
          <Column overflow="visible">
            {/* <SingleLineIFE */}
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
              height={26}
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
  /**
   * Url unique identity
   */
  id: string;

  /**
   * Url input placeholder
   */
  placeholder: string;

  /**
   * Url input value
   */
  url: string;

  /**
   * Update Url passes updated url string as argument
   */
  onChangeURL: (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => void;

  /**
   * Funciton call on press enter key
   */
  onEnter?: () => void;

  /**
   * Fucniton call on paste event in inputbox
   */
  onPaste?: (edt: any) => void;

  /**
   * A boolean value whether you want to set input auto focus or not
   */
  autoFocus?: boolean;
}
