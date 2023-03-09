import Button from './Button';

export default {
  title: 'Sample/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args: any[]) =>
  <Button onClick={() => { }} {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
  onClick: () => { }
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
  onClick: () => { }
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
  onClick: () => { }
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
  onClick: () => { }
};
