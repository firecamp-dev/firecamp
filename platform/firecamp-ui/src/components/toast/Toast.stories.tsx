import Toast from './Toast';

export default {
  title: "UI-Kit/ComingSoon/Toast",
  component: Toast,
  argTypes: {
  }
};

const Template = (args: any) => <Toast {...args} />;

export const ToastComp = Template.bind({});
ToastComp.args = {};