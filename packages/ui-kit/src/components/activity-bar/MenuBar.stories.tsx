//@ts-nocheck
import MenuBar from './MenuBar';
//import '../../scss/tailwind.scss';

export default {
  title: "UI-Kit/MenuBar",
  component: MenuBar
};

const TemplateContainer = (args) => <MenuBar {...args} />;

export const MenuBarDemo = TemplateContainer.bind({});
MenuBarDemo.args = { className: ' ' };
