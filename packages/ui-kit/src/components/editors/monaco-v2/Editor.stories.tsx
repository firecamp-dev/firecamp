import Editor from './Editor';

export default {
  title: "UI-Kit/Editor",
  component: Editor,
  argTypes: {
  }
};

const Template = (args: any) => <Editor {...args} />;

export const EditorComponent = Template.bind({});
EditorComponent.args = {};