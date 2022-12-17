import ReactDOM from 'react-dom';
import { IPromptInput, PromptInput } from '../../components/prompt/PromptInput';

type TOpenPromptInput = (props: TPromptInputOpenProps) => Promise<any>;
const promptInput: TOpenPromptInput = ({
  header,
  value,
  texts,
  validator,
  executor,
  onError
}) => {
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
        validator={validator}
        executor={executor}
        onResolve={(res) => rs(res)} //resolve for executor
        onError={onError} // error handler is needed
      />,
      promptContainer
    );
  });
};

type TPromptInputOpenProps = Pick<
  IPromptInput,
  'header' | 'title' | 'texts' | 'value' | 'validator' | 'executor' | 'onError'
>;

export { promptInput };
