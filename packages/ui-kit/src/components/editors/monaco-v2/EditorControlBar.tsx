import { FC, useState } from 'react';
import { MdContentCopy } from '@react-icons/all-files/md/MdContentCopy';
import { VscWordWrap } from '@react-icons/all-files/vsc/VscWordWrap';
import { VscFold } from '@react-icons/all-files/vsc/VscFold';
import { ToolBar, FcVscWand } from '@firecamp/ui-kit';
import { _clipboard } from '@firecamp/utils';

const EditorControlBar: FC<any> = ({ editor, language = 'json' }) => {
  const [isWrapped, setIsWrapped] = useState(false);
  const [isFolded, setIsFolded] = useState(false);
  if (!editor) return <></>;
  return (
    <ToolBar>
      <div>
        <MdContentCopy
          size={14}
          title={'Copy'}
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
        <VscFold
          size={16}
          title={'Fold'}
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
