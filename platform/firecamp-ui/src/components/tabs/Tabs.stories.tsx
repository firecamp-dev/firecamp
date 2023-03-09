import { default as Tabs } from './Tabs';
import { default as Button } from '../buttons/Button';
import { useState } from 'react';

const demoArgs = [
  {
    id: 'body',
    name: 'Body',
  },
  {
    id: 'auth',
    name: 'Auth',
  },
  {
    id: 'header',
    name: 'Header',
  },
  {
    id: 'param',
    name: 'Param',
  },
  {
    id: 'scripts',
    name: 'Scripts',
  },
];

export default {
  title: 'UI-Kit/Tabs',
  component: Tabs,
  argTypes: {
    className: '',
  },
};

const Template = (args: any) => (
  <div className="bg-activityBarBackground text-activityBarForeground flex items-top h-screen">
    <div className="border-r border-inputBorder p-12">SideBar</div>
    <div className="flex-1">
      <Tabs {...args} />
      <div className="p-12">Tab Content</div>
    </div>
  </div>
);

export const TabsDemo = Template.bind({});
TabsDemo.args = {
  list: demoArgs,
  activeTab: 'auth',
  borderMeta: {
    placementForActive: 'top',
  },
};

export const TabsDemoLeftComp = Template.bind({});
TabsDemoLeftComp.args = {
  list: demoArgs,
  preComp: () => <Button text="Sample Prefix Button" primary sm/>,
};

export const TabsDemoRightComp = Template.bind({});
TabsDemoRightComp.args = {
  list: demoArgs,
  postComp: () =>  <Button text="Sample Postfix Button" primary sm/>,
};

export const TabWithScrollbar = () => {
  const [activeTab, updateActiveTab] = useState(demoArgs[0].id);

  return (
    <div className="bg-activityBarBackground text-activityBarForeground flex items-top h-screen">
      <div className="border-r border-inputBorder p-12">SideBar</div>
      <div className="flex-1">
        <div className="border-b h-12"></div>
        <div className="p-6 w-56">
          <Tabs
            list={demoArgs}
            activeTab={activeTab}
            onSelect={(tab: string) => {
              updateActiveTab(tab);
            }}
          />
        </div>
      </div>
    </div>
  );
};
