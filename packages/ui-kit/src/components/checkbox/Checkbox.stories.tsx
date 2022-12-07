//@ts-nocheck
import { useState } from 'react';
import Checkbox from './Checkbox';

export default {
    title: "UI-Kit/Checkbox",
    component: Checkbox,
    argTypes: {
        placeholder: "Firecamp",
        value: "Firecamp value"
    }
};

const Template = (args) => <div className="bg-activityBarActiveBackground text-activityBarForeground"><Checkbox {...args} /><Checkbox {...args} /><Checkbox {...args} /><Checkbox {...args} /></div>;

const TemplateWithState = (args) => {
    const [isChecked, onToggleCheck] = useState(args.isChecked);
    return <Checkbox {...args} isChecked={isChecked} onToggleCheck={(label, value) => onToggleCheck(value)}/>
}

export const CheckBoxPrimary = TemplateWithState.bind({});
CheckBoxPrimary.args = { label: 'CheckBoxPrimary', color: 'primary', labelPlacing: 'right', isChecked: false };


export const CheckBoxSecondary = Template.bind({});
CheckBoxSecondary.args = { label: 'CheckBoxSecondary', color: 'secondary', labelPlacing: 'right', isChecked: true };

export const CheckBoxLabelLeft = Template.bind({});
CheckBoxLabelLeft.args = { label: 'Label left', color: 'secondary', labelPlacing: 'left', note: 'place left' };


export const CheckBoxwithoutLabel = Template.bind({});
CheckBoxwithoutLabel.args = { showLabel: false};
