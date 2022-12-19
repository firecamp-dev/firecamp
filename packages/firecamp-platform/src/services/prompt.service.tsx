import ReactDOM from 'react-dom';
import { IPromptInput, PromptInput } from '../components/prompt/PromptInput';

const open = ({ header, value, texts, validator, executor }) => {
  // @ts-ignore
  const promptContainer = document.createElement('div');
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(promptContainer);
  };
  return new Promise((rs, rj) => {
    ReactDOM.render(
      <PromptInput
        header={header}
        texts={texts}
        value={value}
        onClose={onClose}
        onResolve={(res) => rs(res)}
        onReject={(e) => rj(e)}
      />,
      promptContainer
    );
  });
};

type TPromptInputOpenProps = Pick<
  IPromptInput,
  'header' | 'texts' | 'value' | 'validator' | 'executor'
>;

const service: { open: (props: TPromptInputOpenProps) => void } = {
  open,
};
export default service;
