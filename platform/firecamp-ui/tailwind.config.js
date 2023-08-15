module.exports = {
  content: [
    '../../playgrounds/firecamp-graphql/src/**/*.{js,jsx,ts,tsx}',
    '../../playgrounds/firecamp-rest/src/**/*.{js,jsx,ts,tsx}',
    '../../playgrounds/firecamp-rest-executor/src/**/*.{js,jsx,ts,tsx}',
    '../../playgrounds/firecamp-socket-io/src/**/*.{js,jsx,ts,tsx}',
    '../../playgrounds/firecamp-socket-io-executor/src/**/*.{js,jsx,ts,tsx}',
    '../../playgrounds/firecamp-websocket/src/**/*.{js,jsx,ts,tsx}',
    '../../playgrounds/firecamp-ws-executor/src/**/*.{js,jsx,ts,tsx}',
    '../firecamp-platform/src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    colors: {
      'app-background': 'var(--app-background)',
      'app-background-secondary': 'var(--app-background-secondary)',
      'app-foreground': 'var(--app-foreground)',
      'app-foreground-active': 'var(--app-foreground-active)',
      'app-foreground-inactive': 'var(--app-foreground-inactive)',
      'app-border': 'var(--app-border)',

      'activityBar-background': 'var(--activityBar-background)',
      'activityBar-background-active': 'var(--activityBar-background-active)',
      'activityBar-border': 'var(--activityBar-border)',
      'activityBar-border-active': 'var(--activityBar-border-active)',
      'activityBar-foreground': 'var(--activityBar-foreground)',
      'activityBar-foreground-inactive':
        'var(--activityBar-foreground-inactive)',
      'activityBarBadge-foreground': 'var(--activityBarBadge-foreground)',
      'activityBarBadge-background': 'var(--activityBarBadge-background)',

      'tab-background': 'var(--tab-background)',
      'tab-background-activeColor': 'var(--tab-background-activeColor)',
      'tab-foreground': 'var(--tab-foreground)',
      'tab-foreground-inactive': 'var(--tab-foreground-inactive)',
      'tab-border': 'var(--tab-border)',
      'tab-background-hover': 'var(--tab-background-hover)',
      'tab-background-active': 'var(--tab-background-active)',

      'selected-text': 'var(--selected)',

      'statusBar-background': 'var(--statusBar-background)',
      'statusBar-background-active': 'var(--statusBar-background-active)',
      'statusBar-border': 'var(--statusBar-border)',
      'statusBar-foreground': 'var(--statusBar-foreground)',
      'statusBar-foreground-active': 'var(--statusBar-foreground-active)',

      'input-background': 'var(--input-background)',
      'input-background-focus': 'var(--input-background-focus)',
      'input-border': 'var(--input-border)',
      'input-placeholder': 'var(--input-placeholder)',
      'input-text': 'var(--input-text)',

      'popover-background': 'var(--popover-background)',
      'popover-foreground': 'var(--popover-foreground)',
      'popover-border': 'var(--popover-border)',
      'popover-shadow': 'var(--popover-shadow)',

      'modal-background': 'var(--modal-background)',
      'modal-foreground': 'var(--modal-foreground)',
      'modal-foreground-active': 'var(--modal-foreground-active)',
      'modal-border': 'var(--modal-border)',
      'modal-shadow': 'var(--modal-shadow)',

      warning: 'var(--warning)',
      danger: 'var(--error)',
      info: 'var(--info)',
      success: 'var(--success)',

      focus1: 'var(--focus-level-1)',
      focus2: 'var(--focus-level-2)',
      focus3: 'var(--focus-level-3)',
      focus4: 'var(--focus-level-4)',
      focusBorder: 'var(--focus-border)',
      focusColor: '#ffffff1a',

      primaryColor: 'var(--app-primary)',
      'primaryColor-text': '#ffffff',
      secondaryColor: 'var(--app-secondary)',
      'secondaryColor-text': '#ffffff',

      transparent: '#ffffff00',

      error: 'var(--error)',

      graphql: 'var(--req-graphql)',
      rest: 'var(--req-link)',
      socket: 'var(--req-socketio)',
      websocket: 'var(--req-websocket)',
      link: 'var(--link)',
    },
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'scale(.94)' },
          '50%': { transform: 'scale(1)' },
        },
        slideUpAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(2px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDownAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        wiggle: 'wiggle 100ms ease-in-out',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 200ms ease-in-out',
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
      },
      fontFamily: {
        default: ['Lato', 'sans-serif'],
        sans: ['sans-serif'],
        serif: ['ui-serif'],
        mono: ['ui-monospace'],
      },
      boxShadow: {
        'popover-shadow': 'var(--popover-shadow)',
      },
    },
  },
  plugins: [],
  // disabled preflight to prevent the resetcss styles from impacting mantine components.
  //  @ref: https://github.com/mantinedev/mantine/discussions/1672#discussioncomment-5922089
  corePlugins: {
    preflight: false,
  },
  safelist: [
    "data-[side='bottom']:animate-slideDownAndFade",
    "data-[side='bottom']:animate-slideUpAndFade",
  ],
};
