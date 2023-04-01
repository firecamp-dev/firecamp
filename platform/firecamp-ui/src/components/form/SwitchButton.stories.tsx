import { ISwitchButton } from './interfaces/SwitchButton.interfaces';
import SwitchButton from './SwitchButton';

export default {
  title: 'UI-Kit/FormGroup',
  component: SwitchButton,
  argTypes: {
    label: 'Firecamp',
  },
};

const Template = (args: ISwitchButton) => (
  <div className="bg-activityBarActiveBackground p-4 w-96">
    <SwitchButton {...args} />
  </div>
);

export const SwitchButtonDemo = Template.bind({});
