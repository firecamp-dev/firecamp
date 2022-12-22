import ReactDOM from 'react-dom';
import { PromptInput } from '../../components/prompt/PromptInput';
import { PromptSaveItem } from '../../components/prompt/PromptSaveItem';
import { IPromptInput } from '../../components/prompt/types';

type TPromptInputOpenProps = Pick<
  IPromptInput,
  | 'header'
  | 'lable'
  | 'placeholder'
  | 'texts'
  | 'value'
  | 'validator'
  | 'executor'
  | 'onError'
>;
type TOpenPromptInput = (props: TPromptInputOpenProps) => Promise<any>;
const promptInput: TOpenPromptInput = (props) => {
  // @ts-ignore
  const promptContainer = document.createElement('div');
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(promptContainer);
  };
  return new Promise((rs, rj) => {
    ReactDOM.render(
      <PromptInput
        {...props}
        onClose={onClose}
        onResolve={(res) => rs(res)} //resolve for executor
      />,
      promptContainer
    );
  });
};


type TOpenPromptSaveItem = (props: TPromptInputOpenProps & { folders: any[]}) => Promise<any>;
const promptSaveItem: TOpenPromptSaveItem = (props) => {
  // @ts-ignore
  const promptContainer = document.createElement('div');
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(promptContainer);
  };
  return new Promise((rs, rj) => {
    ReactDOM.render(
      <PromptSaveItem
        {...props}
        folders={props.folders}
        onClose={onClose}
        onResolve={(res) => rs(res)} //resolve for executor
      />,
      promptContainer
    );
  });
};

export { promptInput, promptSaveItem };
