//@ts-nocheck
import CheckboxGroup from './CheckboxGroup';

export default {
    title: "UI-Kit/CheckboxGroup",
    component: CheckboxGroup,
    argTypes: {
        placeholder: "Firecamp",
        value: "Firecamp value"
    }
};

const Template = (args) =>
    <div className="bg-activityBar-background-active text-activityBar-foreground">
        <CheckboxGroup {...args} />
    </div>;


export const CheckBoxPrimary = Template.bind({});
CheckBoxPrimary.args = {
    checkboxLabel: 'Transports',
    list: [
        {
            id: 'websocket',
            isChecked:false,
            label: 'Websocket',
            showLabel: true,
            disabled: false
        },
        {
            id: 'polling',
            isChecked: false,
            label: 'Polling',
            showLabel: true,
            disabled: false
        }
    ]
};
