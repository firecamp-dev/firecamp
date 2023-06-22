import { FC } from 'react';

import { VscTwitter } from '@react-icons/all-files/vsc/VscTwitter';
import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { VscComment } from '@react-icons/all-files/vsc/VscComment';

import { SiDiscord } from '@react-icons/all-files/si/SiDiscord';
import { _misc } from '@firecamp/utils';

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

  return (
    <div className="flex items-center cursor-pointer">
      {process.env.NODE_ENV === 'production' ? (
        <a
          className="flex items-center mr-2 cursor-pointer"
          data-tip="Chat Support"
        >
          <VscComment
            size={16}
            className="text-statusBar-foreground hover:text-statusBar-foreground-active"
            onClick={toggleChat}
          />
        </a>
      ) : (
        <></>
      )}
      <a
        className="flex items-center mr-2"
        href={'https://github.com/firecampdev/firecamp'}
        target="_blank"
        data-tip="GitHub"
      >
        <VscGithubInverted
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      </a>
      <a
        className="flex items-center mr-2 "
        href={
          'https://twitter.com/intent/tweet?screen_name=Firecampdev&ref_src=twsrc%5Etfw'
        }
        target="_blank"
        data-tip="Follow us @FirecampHQ"
      >
        <VscTwitter
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      </a>

      <a
        className="flex items-center mr-2"
        href={'https://firecamp.io/docs'}
        target="_blank"
        data-tip="Documentation"
        data-multiline={false}
      >
        <VscFile
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      </a>
      <a
        className="flex items-center mr-2"
        href={'https://discord.com/invite/8hRaqhK'}
        target="_blank"
        data-tip="Join our Discord Server"
        data-place="left"
      >
        <SiDiscord
          size={16}
          className="text-statusBar-foreground hover:text-statusBar-foreground-active"
        />
      </a>
    </div>
  );
};

export { MetaBar };
