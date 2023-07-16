import { FC } from 'react';
import { Twitter, Github, LifeBuoy, File, MessageSquare } from 'lucide-react';
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
        <File
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
        <Github
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
        <Twitter
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
        <MessageSquare strokeWidth={1.5}
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
        handler={() => <LifeBuoy strokeWidth={1.5} size={16} />}
        options={process.env.NODE_ENV === 'production' ? allOptions : options}
        onSelect={(v) => v.onClick()}
        width={160}
        sm
      />
    </div>
  );
};

export { MetaBar };
