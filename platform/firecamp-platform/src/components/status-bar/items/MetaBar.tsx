import { FC } from 'react';

import { IoHelpBuoyOutline } from '@react-icons/all-files/io5/IoHelpBuoyOutline';
import { VscTwitter } from '@react-icons/all-files/vsc/VscTwitter';
import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { VscComment } from '@react-icons/all-files/vsc/VscComment';

import { SiDiscord } from '@react-icons/all-files/si/SiDiscord';
import { _misc } from '@firecamp/utils';
import { DropdownMenu } from '@firecamp/ui';

declare const $crisp: any;
const MetaBar: FC<any> = () => {
  const toggleChat = () => {
    if ($crisp.is('chat:hidden')) {
      $crisp.push(['do', 'chat:show']);
      $crisp.push(['do', 'chat:open']);
    } else {
      $crisp.push(['do', 'chat:close']);
      $crisp.push(['do', 'chat:hide']);
    }
  };
  const options = [
    {
      name: 'Discord',
      title: 'Join our Discord Server',
      onClick: () =>
        window.open('https://discord.com/invite/8hRaqhK', '_blank'),
      prefix: () => (
        <SiDiscord
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      ),
    },
    {
      name: 'Documentation',
      title: 'Documentation',
      onClick: () => window.open('https://firecamp.io/docs', '_blank'),
      prefix: () => (
        <VscFile
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      ),
    },
    {
      name: 'GitHub',
      title: 'GitHub',
      onClick: () =>
        window.open('https://github.com/firecampdev/firecamp', '_blank'),
      prefix: () => (
        <VscGithubInverted
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      ),
    },
    {
      name: 'Twitter',
      title: 'Follow us @FirecampHQ',
      onClick: () =>
        window.open(
          'https://twitter.com/intent/tweet?screen_name=Firecampdev&ref_src=twsrc%5Etfw',
          '_blank'
        ),
      prefix: () => (
        <VscTwitter
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      ),
    },
  ];
  const allOptions = [
    {
      name: 'Chat',
      onClick: () => toggleChat(),
      prefix: () => (
        <VscComment
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      ),
    },
    ...options,
  ];

  return (
    <div className="flex items-center cursor-pointer pr-2">
      <DropdownMenu
        handleRenderer={() => <IoHelpBuoyOutline size={16} />}
        options={process.env.NODE_ENV !== 'production' ? allOptions : options}
        onSelect={(v) => v.onClick()}
        classNames={{
          dropdown: 'border-focusBorder',
        }}
        width={160}
        sm
      />
    </div>
  );
};

export { MetaBar };
