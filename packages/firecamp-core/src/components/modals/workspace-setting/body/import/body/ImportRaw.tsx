// @ts-nocheck

import { FC, useEffect, useState } from 'react';

import {
  Container,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  MultiLineIFE,
} from '@firecamp/ui-kit';

const ImportRaw: FC<IImportRaw> = ({
  isImporting = false,
  onImport = () => {},
}) => {
  let [value, setValue] = useState('');

  useEffect(() => {
    return () => {
      setValue('');
    };
  }, []);

  let _onChange = (text) => {
    setValue(text);
  };

  let _onSubmit = () => {
    if (isImporting) return;
    if (value && value.length) {
      onImport(value, 'RAW');
    }
  };
  console.log('value', value);
  return (
    <Container className="fc-import-editor" overflow="auto">
      <Container.Body>
        <MultiLineIFE
          disabled={false}
          name={'jsonbody'}
          language={'json'}
          value={value}
          onLoad={(editor) => {
            editor.focus();
          }}
          controlsConfig={{
            show: true,
          }}
          monacoOptions={{
            theme: 'kuroir',
            width: '100%',
            fontSize: 13,
            showPrintMargin: false,
            showGutter: true,
            maxLines: 23,
            highlightActiveLine: false,
            showLineNumbers: true,
            tabSize: 2,
            editorProps: { $blockScrolling: Infinity },
            cursorStart: 1,
          }}
          onChange={({ target: { value } }) => _onChange(value)}
        />
      </Container.Body>
      <Container.Footer className="align-center" flex="none">
        <TabHeader className="mt-16">
          <TabHeader.Right>
            <Button
              primary
              sm
              // TODO: className="font-light"
              text="Import"
              disabled={isImporting}
              onClick={_onSubmit}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};
export default ImportRaw;

interface IImportRaw {
  isImporting: boolean;
  onImport: Function;
}
