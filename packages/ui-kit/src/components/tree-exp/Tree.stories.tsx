//@ts-nocheck
import { FirecampTreeView, TreeDataProvider } from 'firecamp-treeview';
import { aNodeWithIdTreeDataProvider } from "./dataProvider";

export default {
  title: "UI-Kit/FirecampTreeView",
  component: FirecampTreeView,
  argTypes: {
    // treeDataProvider: aNodeWithIdTreeDataProvider(),
  }
};

const Template = (args) => <FirecampTreeView {...args}/>;

export const FCTreeView = Template.bind({});
console.log(FCTreeView, "FCTreeView")
FCTreeView.args = { treeDataProvider: aNodeWithIdTreeDataProvider() };

