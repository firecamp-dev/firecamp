import _compact from 'lodash/compact';
import { Popover, EPopoverPosition } from '@firecamp/ui';
import { _object } from '@firecamp/utils';

const EditorCommands = {
  Save: {
    command: 'Save',
    name: 'Save',
    key: {
      win: 'Ctrl-S',
      mac: 'Command-S',
    },
    view: {
      win: `Ctrl + S`,
      mac: `⌘ + S`,
    },
  },
  Send: {
    command: 'Send',
    name: 'Send',
    key: {
      win: 'Ctrl-Enter',
      mac: 'Command-Enter',
    },
    view: {
      win: `Ctrl + Enter`,
      mac: `⌘ + Enter`,
    },
  },
  SendAndSave: {
    command: 'SendAndSave',
    name: 'Send and save',
    key: {
      win: 'Ctrl-Shift-Enter',
      mac: 'Command-Shift-Enter',
    },
    view: {
      win: `Ctrl + Shift + Enter`,
      mac: `⌘ + Shift + Enter`,
    },
  },
  SetToOriginal: {
    command: 'SetToOriginal',
    name: 'Set to original',
    key: {
      win: 'Ctrl-O',
      mac: 'Command-O',
    },
    view: {
      win: `Ctrl + O`,
      mac: `⌘ + O`,
    },
  },
  ClearPlayground: {
    command: 'ClearPlayground',
    name: 'Reset playground',
    key: {
      win: 'Ctrl-K',
      mac: 'Command-K',
    },
    view: {
      win: `Ctrl + K`,
      mac: `⌘ + K`,
    },
  },
};
const ShortcutsPopover = ({ id }) => {
  const _renderKeyboardShortcutInfo = () => {
    try {
      let OSName = '';
      if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
      if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
      if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
      if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';

      switch (OSName) {
        case 'Windows':
        case 'UNIX':
        case 'Linux':
          return (
            <div>
              {Object.values(EditorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className=" pr-4 flex-1 font-semibold">{`${
                        val.name || ''
                      }`}</div>
                      <div className="ml-auto pr-2">{`${
                        val.view ? val.view['win'] : ''
                      }`}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
        case 'MacOS':
          return (
            <div>
              {Object.values(EditorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className=" pr-4 flex-1 font-semibold">{`${
                        val.name || ''
                      }`}</div>
                      <div className="ml-auto pr-2">{`${
                        val.view ? val.view['mac'] : ''
                      }`}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
          break;
        default:
          return '';
      }
      return 'Body';
    } catch (e) {
      return '';
    }
  };
  return (
    <Popover
      content={
        <div>
          <div className="text-sm font-bold mb-1 text-app-foreground-active opacity-70 px-2 pt-2 border-b border-app-border">
            Shortcuts
          </div>
          {_renderKeyboardShortcutInfo()}
        </div>
      }
      positions={[EPopoverPosition.Right]}
    >
      <Popover.Handler id={`info-popover-${id}`}>
        <i className="iconv2-info-icon font-base"></i>
      </Popover.Handler>
    </Popover>
  );
};

export default ShortcutsPopover;
export { EditorCommands };
