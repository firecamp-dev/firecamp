import Editor from './Editor';
import SingleLineEditor from './SingleLineEditor'

export default {
  title: "UI-Kit/Editor",
  component: SingleLineEditor,
  argTypes: {
  }
};

const SingleLineEditorTemplate = (args: any) => <SingleLineEditor {...args} />;
export const SLEComponent = SingleLineEditorTemplate.bind({});
SLEComponent.args = {
  height: 30,
  value: "This is the SLE"
};