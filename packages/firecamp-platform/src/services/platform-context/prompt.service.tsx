import ReactDOM from 'react-dom';
import { IPromptInput, PromptInput } from '../../components/prompt/PromptInput';

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

type TPromptInputOpenProps = Pick<
  IPromptInput,
  'header' | 'lable' | 'placeholder' | 'texts' | 'value' | 'validator' | 'executor' | 'onError'
>;

export { promptInput };
