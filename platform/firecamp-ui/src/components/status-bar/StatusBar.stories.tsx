import { default as StatusBar } from './StatusBar';
import { VscTwitter } from "@react-icons/all-files/vsc/VscTwitter";
import { VscGithubInverted } from "@react-icons/all-files/vsc/VscGithubInverted";
import { VscFile } from "@react-icons/all-files/vsc/VscFile";


export default {
    title: "UI-Kit/ActivityBar",
    primaryRegion: 'My workspace',
    secondaryRegion: () => {
        return (
            <div className="flex items-center">
                <a className="flex items-center pr-2 " href="#" ><VscTwitter size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><VscGithubInverted size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><VscFile size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
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
                <a className="flex items-center pr-2 " href="#" ><VscTwitter size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><VscGithubInverted size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
                <a className="flex items-center pr-2" href="#" ><VscFile size={12} className="text-statusBar-foreground hover:text-statusBar-foreground-active" /></a>
            </div>
        )
    }
};