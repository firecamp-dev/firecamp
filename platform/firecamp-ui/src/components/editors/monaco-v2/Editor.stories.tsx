import { useState } from 'react';
import Editor from './Editor';

export default {
  title: "UI-Kit/Editor",
  component: Editor,
  argTypes: {
  }
};

const EditorTemplate = ({value,...args}) => {
  const [editorValue, updateEditorValue] = useState(value)
  return (<Editor {...args} value={editorValue} onChange={(e) => updateEditorValue(e.target.value) } />)};

export const EditorComponent = EditorTemplate.bind({});
EditorComponent.args = {
  value: 'single line editor',
  className: 'border',
  height:"100%"
};