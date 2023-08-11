type FormData = {
  key: string;
  value: string;
  description: string;
  disable?: boolean;
};

const defaultData: FormData[] = [
  {
    key: 'name',
    value: 'Elon',
    description: 'The name of user',
    disable: true,
  },
  {
    key: 'startup',
    value: 'SpaceX',
    description: 'The space company',
  },
  {
    key: 'founded',
    value: '2004',
    description: 'The year of founded',
  },
];

const _columns = [
  { id: 'select', key: 'disable', name: '', width: '40px', fixedWidth: true },
  { id: 'key', key: 'key', name: 'Key', width: '100px' },
  { id: 'value', key: 'value', name: 'Value', width: '100px' },
  {
    id: 'description',
    key: 'description',
    name: 'Description',
    width: '150px',
    resizeWithContainer: true,
  },
  { id: 'remove', key: '', name: '', width: 20, fixedWidth: true },
];

const DARK_THEME_VAR = {
  '--req-get': '#66BB6A',
  '--req-post': '#DF962B',
  '--req-put': '#26C6DA',
  '--req-delete': '#EF5350',
  '--req-patch': '#5C6BC0',
  '--req-head': '#AB47BC',
  '--req-options': '#EC407A',
  '--req-purge': '#DBB542',
  '--req-link': '#42A5F5',
  '--req-unlink': '#26A69A',
  '--req-graphql': '#E535AB',
  '--req-websocket': '#FF7043',
  '--req-socketio': '#91BD5E',
  '--link': '#0068bc',

  '--app-background': '#1B1A1A',
  '--app-foreground': '#cccccc',
  '--app-foreground-active': '#fff',
  '--app-foreground-inactive': '#777777',
  '--app-primary': '#D48332',
  '--app-secondary': '#3c3c3c',
  '--app-border': '#414141',
  '--app-focus': '#5E8FED',
  '--app-error': '#f00',
  '--app-overlay': '#b1b1b1',
  '--app-background-secondary': '#252526',

  '--tab-background': 'var(--app-background)',

  '--tab-foreground': '#bbb',
  '--tab-foreground-inactive': '#ffffff80',
  '--tab-border': 'var(--app-border)',
  '--tab-background-hover': '#1B1A1A',
  '--tab-background-active': 'var(--statusBar-background-active)',
  '--tab-background-activeColor': '#2d2c2c',

  '--activityBar-background': '#333333',
  '--activityBar-foreground': '#FFFFFF',
  '--activityBar-foreground-inactive': '#ffffff66',
  '--activityBar-background-active': 'var(--focus-level-2)',
  '--activityBar-border-active': 'var(--app-primary)',
  '--activityBar-border': '#333333',
  '--activityBarBadge-foreground': '#FFFFFF',
  '--activityBarBadge-background': '#09A1ED',

  '--statusBar-background': 'var(--app-background)',
  '--statusBar-foreground': 'var(--app-foreground)',
  '--statusBar-foreground-active': 'var(--app-foreground-active)',
  '--statusBar-border': '#7777773d',
  '--statusBar-background-active': '#252526',

  '--input-border': 'var(--app-border)',
  '--input-placeholder': '#777777',
  '--input-text': '#FFFFFF',
  '--input-background-focus': '#1A191C',
  '--input-background': 'var(--app-background)',

  '--popover-background': '#2e2e30',
  '--popover-foreground': 'var(--app-foreground)',
  '--popover-border': 'transparent',
  '--popover-shadow': 'rgba(0, 0, 0, 0.36) 0px 0px 8px 2px',

  '--focus-border': '#007acc',
  '--error': '#ed4849',

  '--modal-background': '#262626',
  '--modal-foreground': '#9C9C9C',
  '--modal-foreground-active': '#FFFFFF',
  '--modal-shadow': '#00000059',
  '--modal-border': '#2b2b2b',

  '--warning': '#fcc04f',
  '--info': '#0794ff',
  '--success': '#4bb101',

  '--color': '128,128,128',
  '--focus-level-1': 'rgba(var(--color), 0.06)',
  '--focus-level-2': 'rgba(var(--color), 0.1)',
  '--focus-level-3': 'rgba(var(--color), 0.14)',
  '--focus-level-4': 'rgba(var(--color), 0.18)',

  '--collection-text': '#cccccc',

  '--cm-property': '#ce9178',
  '--cm-keyword': '#9cdcfe',
  '--cm-def': '#b5cea8',
  '--cm-attribute': '#9cdcfe',
  '--cm-number': '#ab843b',
  '--cm-punctuation': '#9e9d9d',
  '--cm-ws': '#9e9d9d',
  '--selected': '#ffffff17',
  '--cm-string': '#b5cea8',
};

const LIGHT_THEME_VAR = {
  '--app-background': '#fafbfc',
  '--app-foreground': '#v',
  '--app-foreground-active': '#222',
  '--app-foreground-inactive': '#3333338f',
  '--app-primary': '#D48332',
  '--app-secondary': '#3c3c3c',
  '--app-border': '#3c3c3c',
  '--app-focus': '#5E8FED',
  '--app-error': '#f00',
  '--app-overlay': '#2a2a2a',
  '--app-background-secondary': '#f3f4f5',

  '--tab-background': '#fafbfc',
  '--tab-foreground': '#24292f',
  '--tab-foreground-inactive': '#333333',
  '--tab-border': 'var(--app-border)',
  '--tab-background-hover': '#fafbfc',
  '--tab-background-active': '#fafbfc',
  '--tab-background-activeColor': '#f5f5f5',

  '--activityBar-background': '#f5f5f5',
  '--activityBar-foreground': '#24292f',
  '--activityBar-foreground-inactive': '#57606a',
  '--activityBar-background-active': 'var(--focus-level-2)',
  '--activityBar-border-active': 'var(--app-primary)',
  '--activityBar-border': '#dddddd',
  '--activityBarBadge-foreground': '#FFFFFF',
  '--activityBarBadge-background': '#09A1ED',

  '--statusBar-background': 'var(--app-background)',
  '--statusBar-foreground': 'var(--app-foreground)',
  '--statusBar-foreground-active': 'var(--app-foreground-active)',
  '--statusBar-border': 'var(--app-border)',
  '--statusBar-background-active': '#ececec',

  '--input-border': 'var(--app-border)',
  '--input-placeholder': '#808080',
  '--input-text': '#222222',
  '--input-background-focus': '#ffffff',
  '--input-background': 'rgba(var(--color), 0.06)',

  '--popover-background': '#ffffff',
  '--popover-foreground': 'var(--app-foreground)',
  '--popover-border': 'transparent',
  '--popover-shadow': 'rgba(0, 0, 0, 0.36) 0px 0px 8px 2px',

  '--focus-border': '#007acc',

  '--modal-background': '#f5f5f5',
  '--modal-foreground': '#2a2a2a',
  '--modal-foreground-active': '#222222',
  '--modal-shadow': '#afafaf59',
  '--modal-border': '#dddddd',

  '--error': '#ed4849',
  '--warning': '#fcc04f',
  '--info': '#0794ff',
  '--success': '#4bb101',

  '--color': '86,88,105',
  '--focus-level-1': 'rgba(var(--color), 0.06)',
  '--focus-level-2': 'rgba(var(--color), 0.1)',
  '--focus-level-3': 'rgba(var(--color), 0.14)',
  '--focus-level-4': 'rgba(var(--color), 0.18)',

  '--collection-text': '#333333',

  '--cm-property': '#0451a5',
  '--cm-keyword': '#a31515',
  '--cm-def': '#098658',
  '--cm-attribute': '#a31515',
  '--cm-number': '#ab843b',
  '--cm-punctuation': '#9e9d9d',
  '--cm-ws': '#9e9d9d',
  '--selected': '#00000017',
  '--cm-string': '#098658',
};

export { defaultData, _columns, DARK_THEME_VAR, LIGHT_THEME_VAR };
