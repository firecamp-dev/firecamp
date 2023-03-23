import Input from '../input/Input';
import FormGroup from './FormGroup';
import { IFormGroup } from './interfaces/FormGroup.interfaces';

export default {
  title: 'UI-Kit/FormGroup',
  component: FormGroup,
  argTypes: {
    label: 'Firecamp',
  },
};

const Template = (args: IFormGroup) => (
  <div className="bg-activityBarActiveBackground p-4 w-96">
    <FormGroup {...args} />
  </div>
);

export const InputDemo = Template.bind({});
InputDemo.args = {
  label: 'Label',
  children: [<Input placeholder="Sample Input" />],
};
