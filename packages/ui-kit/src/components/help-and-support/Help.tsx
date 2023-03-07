import { FC } from "react";
import { VscGithubInverted } from "@react-icons/all-files/vsc/VscGithubInverted";
import { VscFile } from "@react-icons/all-files/vsc/VscFile";
import { SiDiscord } from '@react-icons/all-files/si/SiDiscord';

import {IHelp} from './interfaces/Help.interfaces'

const HELPDESK_TYPES = {
  DOCUMENTATION: 'documentation',
  GITHUB: 'github',
  JOIN_DISCORD: 'join_discord'
};

const helpDesks = {
  [HELPDESK_TYPES.DOCUMENTATION]: {
    id: HELPDESK_TYPES.DOCUMENTATION,
    name: 'Documentation',
    link: 'https://firecamp.io/docs/',
    image: <VscFile size={24} /> 
  },
  [HELPDESK_TYPES.GITHUB]: {
    id: HELPDESK_TYPES.GITHUB,
    name: 'GitHub',
    link: 'https://github.com/firecamp-io/firecamp/issues/new',
    image:  <VscGithubInverted size={24} />
  },
  [HELPDESK_TYPES.JOIN_DISCORD]: {
    id: HELPDESK_TYPES.JOIN_DISCORD,
    name: 'Join Discord',
    link: 'https://discord.com/invite/8hRaqhK',
    image:  <SiDiscord size={24} />
  }
};

/**
 * Firecamp help support with Doc, GitHub, and Discord.
 */
const Help: FC<IHelp> = ({ docLink = '', client = 'http' }) => {
  let _renderLink = (type = '') => {
    switch (type) {
      case HELPDESK_TYPES.DOCUMENTATION:
        return (
          <a
            className="text-appForegroundInActive"
            href={docLink || 'https://firecamp.io/docs/'}
            target={'_blank'}
          >
            {helpDesks[type] ? helpDesks[type].name : ''}
          </a>
        );
        break;
      case HELPDESK_TYPES.GITHUB:
        return (
          <a
            className="text-appForegroundInActive"
            href={
              client
                ? `https://github.com/firecamp-io/firecamp/issues/new?assignees=&labels=&template=bug_report.md&title=[${client}]%20Title%20or%20Feature%20request`
                : helpDesks[type]
                ? helpDesks[type].link
                : ''
            }
            target={'_blank'}
          >
            {helpDesks[type] ? helpDesks[type].name : ''}
          </a>
        );
        break;
      case HELPDESK_TYPES.JOIN_DISCORD:
        return (
          <a
            className="text-appForegroundInActive"
            href={helpDesks[type] ? helpDesks[type].link : ''}
            target={'_blank'}
          >
            {helpDesks[type] ? helpDesks[type].name : ''}
          </a>
        );
        break;
      default:
        return <span />;
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-appForeground">
      <div className="flex flex-col opacity-50">
        {Object.values(helpDesks).map((help, index) => {
          return (
            <div className=" text-appForegroundInActive flex items-center mb-2 text-xl" key={`help-${client}-${index}`}>
              <div className="pr-1 flex items-center justify-center">
                {help.image}
              </div>
              {_renderLink(help.id)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Help;