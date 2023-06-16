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
      appBackground: 'var(--app-background)',
      appBackground2: 'var(--app-background-secondary)',
      appForeground: 'var(--app-foreground)',
      appForegroundActive: 'var(--app-foreground-active)',
      appForegroundInActive: 'var(--app-foreground-inactive)',
      appBorder: 'var(--app-border)',

      activityBarBackground: 'var(--activityBar-background)',
      activityBarForeground: 'var(--activityBar-foreground)',
      activityBarInactiveForeground: 'var(--activityBar-foreground-inactive)',
      activityBarActiveBackground: 'var(--activityBar-background-active)',
      activityBarActiveBorder: 'var(--activityBar-border-active)',
      activityBarBorder: 'var(--activityBar-border)',
      activityBarBadgeBackground: 'var(--activityBarBadge-foreground)',
      activityBarBadgeForeground: 'var(--activityBarBadge-background)',

      tabBackground: 'var(--tab-background)',
      tabBackground2: 'var(--tab-background-activeColor)',
      tabForeground: 'var(--tab-foreground)',
      tabForegroundInactive: 'var(--tab-foreground-inactive)',
      tabBorder: 'var(--tab-border)',
      tabHoverBackground: 'var(--tab-background-hover)',
      tabActiveBackground: 'var(--tab-background-active)',

      statusBarBackground: 'var(--statusBar-background)',
      statusBarBackground2: 'var(--statusBar-background-active)',
      statusBarForeground: 'var(--statusBar-foreground)',
      statusBarBorder: 'var(--statusBar-border)',
      statusBarForegroundActive: 'var(--statusBar-foreground-active)',

      inputBorder: 'var(--input-border)',
      inputPlaceholder: 'var(--input-placeholder)',
      inputText: 'var(--input-text)',
      inputFocusBackground: 'var(--input-background-focus)',
      inputBackground: 'var(--input-background)',

      popoverBackground: 'var(--popover-background)',
      popoverForeground: 'var(--popover-foreground)',
      popoverBorder: 'var(--popover-border)',
      popoverBoxshadow: 'var(--popover-shadow)',

      modalBackground: 'var(--modal-background)',
      modalForeground: 'var(--modal-foreground)',
      modalActiveForeground: 'var(--modal-foreground-active)',
      modalBorder: 'var(--modal-border)',
      modalBoxShadow: 'var(--modal-shadow)',

      focusBorder: 'var(--focus-border)',

      warning: 'var(--warning)',
      danger: 'var(--error)',
      info: 'var(--info)',
      success: 'var(--success)',

      focus1: 'var(--focus-level-1)',
      focus2: 'var(--focus-level-2)',
      focus3: 'var(--focus-level-3)',
      focus4: 'var(--focus-level-4)',

      secondaryBG: '#333333',
      secondaryText: '#ffffff',
      primaryColor: 'var(--app-primary)',
      primaryColorOpacity: 'var(--app-primary-withOpacity)',
      primaryColorText: '#ffffff',
      secondaryColor: 'var(--app-secondary)',
      secondaryColorText: '#ffffff',
      focusColor: '#ffffff1a',

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
        sans: ['sans-serif'],
        serif: ['ui-serif'],
        mono: ['ui-monospace'],
      },
      boxShadow: {
        popoverBoxshadow: 'var(--popover-shadow)',
      },
    },
  },
  plugins: [],
};
