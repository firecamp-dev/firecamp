import { CSSVariablesResolver, lighten } from '@mantine/core';
import { ColorType } from './FirecampThemeProvider.interfaces';

export const primaryColor: ColorType = [
  '#EEE8E2',
  '#E1D3C5',
  '#D6C0A9',
  '#D0AE8D',
  '#CD9F70',
  '#CE9052',
  '#D48332',
  '#B87634',
  '#9D6A37',
  '#875F38',
];

export const secondaryColor: ColorType = [
  '#B4D1BE',
  '#9CC7A9',
  '#83BF96',
  '#6ABB84',
  '#50BA72',
  '#3CB663',
  '#2DAF57',
  '#319551',
  '#32804B',
  '#326E46',
];

const defaultDarkColor: ColorType = [
  '#C1C2C5',
  '#A6A7AB',
  '#909296',
  '#5c5f66',
  '#373A40',
  '#2C2E33',
  '#25262b',
  '#1A1B1E',
  '#141517',
  '#101113',
];
const defaultGrayColor: ColorType = [
  '#f8f9fa',
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
];

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--font-family': '"Lato", sans-serif !important',

    // common root variables
    '--req-get': 'var(--mantine-color-green-7)',
    '--req-post': 'var(--mantine-color-orange-7)',
    '--req-put': 'var(--mantine-color-cyan-7)',
    '--req-delete': 'var(--mantine-color-red-7)',
    '--req-patch': 'var(--mantine-color-indigo-7)',
    '--req-head': 'var(--mantine-color-grape-7)',
    '--req-options': 'var(--mantine-color-pink-7)',
    '--req-purge': 'var(--mantine-color-orange-7)',
    '--req-link': 'var(--mantine-color-blue-7)',
    '--req-unlink': 'var(--mantine-color-cyan-7)',
    '--req-graphql': 'var(--mantine-color-pink-6)',
    '--req-websocket': 'var(--mantine-color-red-6)',
    '--req-socketio': 'var(--mantine-color-lime-4)',
    '--link': 'var(--mantine-color-blue-8)',

    '--error': ' var(--mantine-color-red-7)',
    '--warning': ' var(--mantine-color-orange-4)',
    '--info': ' var(--mantine-color-blue-6)',
    '--success': ' var(--mantine-color-lime-8)',

    '--focus-level-1': ' rgba(var(--color), 0.06)',
    '--focus-level-2': ' rgba(var(--color), 0.1)',
    '--focus-level-3': ' rgba(var(--color), 0.14)',
    '--focus-level-4': ' rgba(var(--color), 0.18)',

    '--app-secondary-hover': 'var(--mantine-color-dark-5)',
  },
  light: {
    '--app-background': 'var(--mantine-color-gray-0)',
    '--app-foreground': 'var(--mantine-color-dark-5)',
    '--app-foreground-active': 'var(--mantine-color-gray-9)',
    '--app-foreground-inactive': 'var(--mantine-color-dark-4)',
    '--app-primary': 'var(--mantine-color-primary-color-6)',
    '--app-primary-focus': lighten(theme.colors[theme.primaryColor][6], 0.5),
    '--app-primary-hover': 'var(--mantine-color-primary-color-7)',
    '--app-secondary': 'var(--mantine-color-dark-4)',
    '--app-border': ' var(--mantine-color-gray-4)',
    '--app-focus': 'var(--mantine-color-indigo-5)',
    '--app-error': 'var(--mantine-color-red-8)',
    '--app-overlay': 'var(--mantine-color-dark-6)',
    '--app-background-secondary': 'var(--mantine-color-gray-1)',

    '--tab-background': ' var(--mantine-color-gray-0)',
    '--tab-foreground': 'var(--mantine-color-dark-6)',
    '--tab-foreground-inactive': 'var(--mantine-color-dark-5)',
    '--tab-border': 'var(--app-border)',
    '--tab-background-hover': 'var(--mantine-color-gray-0)',
    '--tab-background-active': 'var(--mantine-color-gray-0)',
    '--tab-background-activeColor': 'var(--mantine-color-gray-1)',

    '--activityBar-background': 'var(--mantine-color-gray-1)',
    '--activityBar-foreground': 'var(--mantine-color-dark-6)',
    '--activityBar-foreground-inactive': 'var(--mantine-color-dark-3)',
    '--activityBar-background-active': 'var(--focus-level-2)',
    '--activityBar-border-active': 'var(--app-primary)',
    '--activityBar-border': 'var(--mantine-color-gray-3)',
    '--activityBarBadge-foreground': 'var(--mantine-color-white)',
    '--activityBarBadge-background': 'var(--mantine-color-blue-6)',

    '--statusBar-background': 'var(--app-background)',
    '--statusBar-foreground': 'var(--app-foreground)',
    '--statusBar-foreground-active': 'var(--app-foreground-active)',
    '--statusBar-border': 'var(--app-border)',
    '--statusBar-background-active': 'var(--mantine-color-gray-2)',

    '--input-border': 'var(--app-border)',
    '--input-placeholder': 'var(--mantine-color-gray-6)',
    '--input-text': 'var(--mantine-color-gray-9)',
    '--input-background-focus': 'var(--mantine-color-white)',
    '--input-background': ' var(--mantine-color-gray-2)',

    '--popover-background': 'var(--mantine-color-white)',
    '--popover-foreground': 'var(--app-foreground)',
    '--popover-border': 'transparent',
    '--popover-shadow': 'var(--mantine-color-dark-9) 0px 8px 6px -6px',

    '--focus-border': 'var(--mantine-color-blue-8)',

    '--modal-background': 'var(--mantine-color-gray-1)',
    '--modal-foreground': 'var(--mantine-color-dark-6)',
    '--modal-foreground-active': 'var(--mantine-color-gray-9)',
    '--modal-shadow': 'var(--mantine-color-dark-1)',
    '--modal-border': 'var(--mantine-color-gray-3)',

    '--heading-color': 'var(--mantine-color-dark-4)',

    '--color': '86, 88, 105' /* var(--mantine-color-dark-3) */,

    '--collection-text': 'var(--mantine-color-dark-5)',

    '--cm-property': 'var(--mantine-color-blue-9)',
    '--cm-keyword': 'var(--mantine-color-red-9)',
    '--cm-def': 'var(--mantine-color-teal-9)',
    '--cm-attribute': 'var(--mantine-color-red-9)',
    '--cm-number': 'var(--mantine-color-orange-5)',
    '--cm-punctuation': 'var(--mantine-color-dark-1)',
    '--cm-ws': 'var(--mantine-color-dark-1)',
    '--selected': 'var(--mantine-color-dark-9)',
    '--cm-string': 'var(--mantine-color-teal-9)',
  },
  dark: {
    '--app-background': ' var(--mantine-color-dark-7)',
    '--app-foreground': ' var(--mantine-color-gray-4)',
    '--app-foreground-active': ' var(--mantine-color-white)',
    '--app-foreground-inactive': ' var(--mantine-color-dark-3)',
    '--app-primary': ' var(--mantine-color-primary-color-8)',
    '--app-primary-focus': lighten(theme.colors[theme.primaryColor][9], 0.1),
    '--app-primary-hover': 'var(--mantine-color-primary-color-9)',
    '--app-secondary': ' var(--mantine-color-dark-4)',
    '--app-border': ' var(--mantine-color-dark-5)',
    '--app-focus': ' var(--mantine-color-indigo-5)',
    '--app-error': ' var(--mantine-color-red-8)',
    '--app-overlay': ' var(--mantine-color-gray-5)',
    '--app-background-secondary': ' var(--mantine-color-gray-9)',

    '--tab-background': ' var(--app-background)',
    '--tab-foreground': ' var(--mantine-color-dark-0)',
    '--tab-foreground-inactive': ' var(--mantine-color-gray-4)',
    '--tab-border': ' var(--mantine-color-dark-4)',
    '--tab-background-hover': ' var(--mantine-color-dark-7)',
    '--tab-background-active': ' var(--statusBar-background-active)',
    '--tab-background-activeColor': ' var(--mantine-color-dark-5)',

    '--activityBar-background': ' var(--mantine-color-dark-5)',
    '--activityBar-foreground': ' var(--mantine-color-white)',
    '--activityBar-foreground-inactive': ' var(--mantine-color-gray-4)',
    '--activityBar-background-active': ' var(--focus-level-2)',
    '--activityBar-border-active': ' var(--app-primary)',
    '--activityBar-border': ' var(--mantine-color-dark-5)',
    '--activityBarBadge-foreground': ' var(--mantine-color-white)',
    '--activityBarBadge-background': ' var(--mantine-color-blue-6)',

    '--statusBar-background': ' var(--app-background)',
    '--statusBar-foreground': ' var(--app-foreground)',
    '--statusBar-foreground-active': ' var(--app-foreground-active)',
    '--statusBar-border': ' var(--mantine-color-dark-5)',
    '--statusBar-background-active': ' var(--mantine-color-gray-9)',

    '--input-border': ' var(--app-border)',
    '--input-placeholder': ' var(--mantine-color-dark-3)',
    '--input-text': ' var(--mantine-color-white)',
    '--input-background-focus': ' var(--mantine-color-dark-7)',
    '--input-background': ' var(--mantine-color-dark-5)',

    '--popover-background': ' var(--mantine-color-dark-5)',
    '--popover-foreground': ' var(--app-foreground)',
    '--popover-border': ' transparent',
    '--popover-shadow': ' var(--mantine-color-dark-9) 0px 8px 6px -6px',

    '--focus-border': ' var(--mantine-color-blue-8)',

    '--modal-background': ' var(--mantine-color-dark-6)',
    '--modal-foreground': ' var(--mantine-color-dark-2)',
    '--modal-foreground-active': ' var(--mantine-color-white)',
    '--modal-shadow': ' var(--mantine-color-dark-9)',
    '--modal-border': ' var(--mantine-color-dark-6)',

    '--heading-color': 'var(--mantine-color-gray-5)',

    '--color': '  128, 128, 128' /* var(--mantine-color-gray-6) */,

    '--collection-text': ' var(--mantine-color-gray-4)',

    '--cm-property': ' var(--mantine-color-red-4)',
    '--cm-keyword': ' var(--mantine-color-blue-2)',
    '--cm-def': ' var(--mantine-color-dark-0)',
    '--cm-attribute': ' var(--mantine-color-blue-2)',
    '--cm-number': ' var(--mantine-color-orange-5)',
    '--cm-punctuation': ' var(--mantine-color-dark-1)',
    '--cm-ws': ' var(--mantine-color-dark-1)',
    '--selected': ' var(--mantine-color-dark-9)',
    '--cm-string': ' var(--mantine-color-dark-0)',
  },
});
