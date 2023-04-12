module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
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
      activityBarInactiveForeground: 'var(--activityBar-inactiveForeground)',
      activityBarActiveBackground: 'var(--activityBar-activeBackground)',
      activityBarActiveBorder: 'var(--activityBar-activeBorder)',
      activityBarBorder: 'var(--activityBar-border)',
      activityBarBadgeBackground: 'var(--activityBarBadge-foreground)',
      activityBarBadgeForeground: 'var(--activityBarBadge-background)',

      tabBackground: 'var(--tab-background)',
      tabBackground2: 'var(--tab-background2)',
      tabForeground: 'var(--tab-foreground)',
      tabForegroundInactive: 'var(--tab-foreground-inactive)',
      tabBorder: 'var(--tab-border)',
      tabHoverBackground: 'var(--tab-hoverBackground)',
      tabActiveBackground: 'var(--tab-activeBackground)',

      statusBarBackground: 'var(--statusBar-background)',
      statusBarBackground2: 'var(--statusBar-background2)',
      statusBarForeground: 'var(--statusBar-foreground)',
      statusBarBorder: 'var(--statusBar-border)',
      statusBarForegroundActive: 'var(--statusBar-foreground-active)',

      inputBorder: 'var(--input-border)',
      inputPlaceholder: 'var(--input-placeholder)',
      inputText: 'var(--input-text)',
      inputFocusBackground: 'var(--inputFocus-background)',
      inputBackground: 'var(--input-background)',

      popoverBackground: 'var(--popover-background)',
      popoverForeground: 'var(--popover-foreground)',
      popoverBorder: 'var(--popover-border)',
      popoverBoxshadow: 'var(--popoverBoxshadow)',

      modalBackground: 'var(--modal-background)',
      modalForeground: 'var(--modal-foreground)',
      modalActiveForeground: 'var(--modal-activeForeground)',
      modalBorder: 'var(--modal-border)',
      modalBoxShadow: 'var(--modal-boxshadow)',

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
      primaryColorOpacity: 'var(--app-primary-with-opacity)',
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
      },
      animation: {
        wiggle: 'wiggle 100ms ease-in-out',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
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
        popoverBoxshadow: 'var(--popoverBoxshadow)',
      },
    },
  },
  plugins: [],
};
