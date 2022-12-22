import ReactDOM from 'react-dom';
import { PromptInput } from '../../components/prompt/PromptInput';
import { PromptSaveItem } from '../../components/prompt/PromptSaveItem';
import { IPromptInput, IPromptSaveItem } from '../../components/prompt/types';

type TPropKeys =
  | 'header'
  | 'lable'
  | 'placeholder'
  | 'texts'
  | 'value'
  | 'validator'
  | 'executor'
  | 'onError';
type TPromptInputOpenProps = Pick<IPromptInput, TPropKeys>;
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

type TPromptSaveItemProps = Pick<IPromptSaveItem, TPropKeys | 'collection'>;
type TOpenPromptSaveItem = (props: TPromptSaveItemProps) => Promise<any>;
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
        collection={props.collection}
        onClose={onClose}
        onResolve={(res) => rs(res)} //resolve for executor
      />,
      promptContainer
    );
  });
};

export { promptInput, promptSaveItem };
