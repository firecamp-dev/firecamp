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

export const ProgressBarActive = TemplateContainer.bind({});
ProgressBarActive.args = { active: true};

export const ProgressBarShortActive = TemplateContainer.bind({});
ProgressBarShortActive.args = { active: true, short: true};
