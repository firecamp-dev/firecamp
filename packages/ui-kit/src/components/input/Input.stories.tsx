//@ts-nocheck
import Input from './Input';
import Button from '../buttons/Button'
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

export default {
    title: "UI-Kit/Input",
    component: Input,
    argTypes: {
        placeholder: "Firecamp",
        value: "Firecamp value"
    }
};

const Template = (args) =><div className="bg-activityBarBackground p-4 w-96"> <Input {...args} /></div>;
const Template2 = (args) =><div className="bg-activityBarBackground p-4 w-96 flex"> <Input {...args} /> <Button color="primary" text="Send" size="md"/> </div>;

export const InputDemo = Template.bind({});
InputDemo.args = {placeholder: 'Sample Button', value: ''};

export const withIcon = Template.bind({});
withIcon.args = {placeholder: 'Sample Button', value: '', icon: () => <VscMenu title="Account" size={16}/>, iconPosition: 'left'};

export const withIconRight = Template.bind({});
withIconRight.args = {placeholder: 'Sample Button', value: '', icon: () => <VscMenu title="Account" size={16}/>, iconPosition: 'right'};

export const withText = Template.bind({});
withText.args = {placeholder: 'Sample Button', value: 'Sample Text', icon: () => <VscMenu title="Account" size={16}/>, iconPosition: 'right'};

// export const withButton = Template2.bind({});
// withButton.args = {placeholder: 'Sample Button', value: 'Sample Text', className: 'h-full border-r-0'};

export const withLeftComp = Template.bind({});
withLeftComp.args = {
    placeholder: 'Sample Button', 
    value: 'Sample Text', 
    className: 'h-full border-r-0',
    // leftComp: () => <Button color="primary" text="left" size="md" onClick={console.log}/>
};

export const withRightComp = Template.bind({});
withRightComp.args = {
    placeholder: 'Sample Button', 
    value: 'Sample Text', 
    className: 'h-full border-r-0',
    // rightComp: () => <Button color="primary" text="right" size="md" onClick={console.log}/>
};