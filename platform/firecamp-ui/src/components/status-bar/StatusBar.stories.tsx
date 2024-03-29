import { default as StatusBar } from './StatusBar';
import { File, Twitter } from 'lucide-react';
import { VscGithubInverted } from "@react-icons/all-files/vsc/VscGithubInverted";

export default {
    title: "UI-Kit/ActivityBar",
    primaryRegion: 'My workspace',
    secondaryRegion: () => {
        return (
            <div className="flex items-center">
                <a className="flex items-center pr-2 " href="#" ><Twitter size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><VscGithubInverted size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><File size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
            </div>
        )
    }
};

const Template = (args: any) =>
    <StatusBar {...args}  className= "border-t focus-outer2">
        <StatusBar.PrimaryRegion>
            {args?.primaryRegion() || ''}
        </StatusBar.PrimaryRegion>
        <StatusBar.SecondaryRegion>
            {args?.secondaryRegion() || ''}
        </StatusBar.SecondaryRegion>
    </StatusBar>

export const StatusBarDemo = Template.bind({});

StatusBarDemo.args = {
    id: 'firecamp-status-bar',
    primaryRegion: () => { return 'My workspace' },
    secondaryRegion: () => {
        return (
            <div className="flex items-center">
                <a className="flex items-center pr-2 " href="#" ><Twitter size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><VscGithubInverted size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><File size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
            </div>
        )
    }
};