import { FC, useState } from 'react';
import { Copy, ChevronsDownUp } from 'lucide-react';
import { VscWordWrap } from '@react-icons/all-files/vsc/VscWordWrap';
import { ToolBar, FcVscWand } from '@firecamp/ui';
import { _clipboard } from '@firecamp/utils';

const EditorControlBar: FC<any> = ({ editor, language = 'json' }) => {
  const [isWrapped, setIsWrapped] = useState(false);
  const [isFolded, setIsFolded] = useState(false);
  if (!editor) return <></>;
  return (
    <ToolBar>
      <div>
        <Copy
          size={14}
          onClick={() => {
            let text = editor.getValue();
            if (!text) return;
            if (text) {
              _clipboard.copy(text);
            }
          }}
        />
      </div>
      <div>
        <VscWordWrap
          size={16}
          title={'Wrap'}
          onClick={() => {
            editor.updateOptions({
              wordWrap: isWrapped ? 'off' : 'on',
            });
            setIsWrapped(!isWrapped);
          }}
        />
      </div>
      <div>
        <ChevronsDownUp
          size={16}
          // title={'Fold'}
          onClick={() => {
            if (isFolded) {
              editor.trigger('unfold', 'editor.unfoldAll');
            } else {
              editor.trigger('fold', 'editor.foldAll');
            }
            setIsFolded(!isFolded);
          }}
        />
      </div>
      <div>
        <FcVscWand
          size={16}
          title={'Prettify'}
          onClick={() => {
            try {
              const text = editor.getValue();
              // prettify json
              if (language === 'json') {
                const value = JSON.stringify(JSON.parse(text), null, 8);
                editor.setValue(value);
              }
              // prettify xml
              if (language === 'xml') {
                // let formattedXml = formatXML(text);
                // editor.setValue(formattedXml);
              }
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </div>
    </ToolBar>
  );
};

export default EditorControlBar;
