import { useState } from 'react';
import Editor from './Editor';
import { IEditor } from './Editor.interface';

export default {
  title: "UI-Kit/Editor",
  component: Editor,
  argTypes: {
  }
};

const EditorTemplate = ({value,...args}: IEditor) => {
  const [editorValue, updateEditorValue] = useState(value)
  return (<Editor {...args} value={editorValue} onChange={(e) => updateEditorValue(e.target.value) } />)};

export const EditorComponent = EditorTemplate.bind({});
EditorComponent.args = {
  value: 'multi line editor',
  className: 'border !h-48',
};