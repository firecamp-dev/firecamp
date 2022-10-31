import Editor from './Editor';
import SingleLineEditor from './SingleLineEditor'

export default {
  title: "UI-Kit/Editor",
  component: Editor,
  argTypes: {
  }
};

const EditorTemplate = (args: any) => <Editor {...args} />;

export const EditorComponent = EditorTemplate.bind({});
EditorComponent.args = {};