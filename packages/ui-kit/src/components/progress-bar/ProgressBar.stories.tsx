//@ts-nocheck
import ProgressBar from './ProgressBar';
//import '../../scss/tailwind.scss';

export default {
    title: "UI-Kit/ProgressBar",
    component: ProgressBar
};

const TemplateContainer = (args) => <div className="w-96"><ProgressBar {...args} /></div>;

export const ProgressBarDemo = TemplateContainer.bind({});
ProgressBarDemo.args = { className: ' '};
