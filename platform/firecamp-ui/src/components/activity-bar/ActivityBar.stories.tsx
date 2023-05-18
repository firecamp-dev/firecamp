import { VscFiles } from "@react-icons/all-files/vsc/VscFiles";
import { VscHistory } from "@react-icons/all-files/vsc/VscHistory";
import { VscAccount } from "@react-icons/all-files/vsc/VscAccount";
import { VscSettingsGear } from "@react-icons/all-files/vsc/VscSettingsGear";
import ActivityBar from './ActivityBar';

export default {
  title: "UI-Kit/ActivityBar",
  component: ActivityBar,
  argTypes: {
    className: 'bg-black'
  },
  parameters: {
    actions: {
      handles: ['click'],
    },
  },
};

const compositeBar = [
  { id: '1', icon: <VscFiles data-tip={'Explorer (⇧⌘P)'} data-for={'1'} />, text: 'Explorer (⇧⌘P)', active: false },
  { id: '2', icon: <VscAccount data-tip={'Environment (⇧⌘E)'} data-for={'2'} />, text: 'Environment (⇧⌘E)', active: true },
  { id: '3', icon: <VscHistory data-tip={'History (⇧⌘H)'} data-for={'3'} />, text: 'History (⇧⌘H)', active: false }
];

const actionBar = [
  { id: '4', icon: <VscAccount data-tip={'User (⇧⌘U)'} data-for={'4'} />, text: 'User (⇧⌘U)', active: false },
  { id: '5', icon: <VscSettingsGear data-tip={'Settings (⇧⌘/)'} data-for={'5'} />, text: 'Settings (⇧⌘/)', active: false }
];

const TemplateContainer = (args: any) => {
  return (

    <ActivityBar className='theme-light w-56 w-5 opacity-70 bg-focus3 border-r border-r-appBorder items-baseline !mb-0 w-60 w-6 h-6 absolute -left-8 w-96 max-w-sm px-14 py-20 text-2xl mb-8 font-normal font-light mb-6 mr-5 mr-14 max-h-4 mr-2 inline py-4 px-8 !w-auto h-10 border-0 !p-0 text-5xl opacity-20 !p-1 h-8 bg-app-background-secondary !border-transparent !border-0 !rounded-br-none	!rounded-tr-none !rounded-bl-none !rounded-tl-none !rounded-none py-0.5 !px-6 !min-w-full pt-0.5 p-6 top-4 pr-3 bg-focus2 z-20 z-30 !border-b-transparent w-9 h-9 -mb-96 pb-96 bg-tabBackground2 flex-none -ml-1 !filter-none  transform-none !px-3 !pt-2 !pb-3 !capitalize !bg-focus2 !text-base !text-appForegroundActive !font-base !capitalize !px-3 !pt-2 !pb-3 max-h-56 bottom-6 first:ml-0 last:mr-0' >
      <ActivityBar.MenuBar menu={[]}/>
      <ActivityBar.CompositeBar items={compositeBar} activeItem="" onClickItem={()=>{}}/>
      <ActivityBar.ActionBar items={actionBar} onClickItem={()=>{}} />
    </ActivityBar>
  )
};

export const ActivityBarDemo = TemplateContainer.bind({});
ActivityBarDemo.args = { className: 'theme-light', compositeBar: compositeBar, actionBar: actionBar };

export const ActivityContainerInSidebar = (args: any) => {
  return (
    <ActivityBar>
      <ActivityBar.CompositeBar items={compositeBar} activeItem="" onClickItem={()=>{}}/>
      <ActivityBar.ActionBar items={actionBar} onClickItem={()=>{}} />
    </ActivityBar>
  )
};