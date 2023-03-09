import Toast from './Toast';
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

export default {
  title: "UI-Kit/Toast",
  component: Toast,
  argTypes: {
  }
};

const Template = (args: any) => <Toast {...args} />;

export const ToastComp = Template.bind({});
ToastComp.args = {};