import { FC, useState } from 'react';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  createStyles,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import {
  EFirecampThemeVariant,
  ColorType,
  IFirecampThemeProvider,
} from './FirecampThemeProvider.interfaces';
import { EEditorTheme } from '@firecamp/types';
import { EditorApi } from '@firecamp/ui';

const primaryColor: ColorType = [
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

const secondaryColor: ColorType = [
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

const FirecampThemeProvider: FC<IFirecampThemeProvider> = ({
  children,
  ...props
}) => {
  const _initialize = () => {
    // on first time load set theme from local storage, if not found then set default
    let themeStored = localStorage.getItem('theme') as EFirecampThemeVariant;
    if (!Object.values(EFirecampThemeVariant).includes(themeStored)) {
      themeStored = EFirecampThemeVariant.LightPrimary;
    }
    return themeStored;
  };
  const _initializeColorScheme = () => {
    // on first time load set theme from local storage, if not found then set default
    let themeColor = (
      [
        EFirecampThemeVariant.DarkPrimary,
        EFirecampThemeVariant.DarkSecondary,
      ].includes(localStorage.getItem('theme') as EFirecampThemeVariant)
        ? 'dark'
        : 'light'
    ) as ColorScheme;

    return themeColor;
  };

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    _initializeColorScheme
  );
  const [theme, setTheme] = useState<EFirecampThemeVariant>(_initialize);

  // update theme
  const updateTheme = (theme: EFirecampThemeVariant) => {
    // update the color schema
    setColorScheme(
      [
        EFirecampThemeVariant.LightPrimary,
        EFirecampThemeVariant.LightSecondary,
      ].includes(theme)
        ? 'light'
        : 'dark'
    );

    // save in local storage
    localStorage.setItem('theme', theme);

    // update theme
    setTheme(theme);

    updateMonacoEditorTheme(theme);
  };

  const updateMonacoEditorTheme = (theme: EFirecampThemeVariant) => {
    // update the monaco editor theme
    const editorTheme = [
      EFirecampThemeVariant.LightPrimary,
      EFirecampThemeVariant.LightSecondary,
    ].includes(theme)
      ? EEditorTheme.Lite
      : EEditorTheme.Dark;

    localStorage.setItem('editorTheme', editorTheme);
    EditorApi.setEditorTheme(editorTheme);
  };

  return (
    //@ts-ignore
    <ColorSchemeProvider colorScheme={theme}
      toggleColorScheme={(c: ColorScheme | EFirecampThemeVariant) => {
        updateTheme(c as EFirecampThemeVariant);
      }}
    >
      <MantineProvider
        theme={{
          // added custom preflight css to prevent default button styles as it affects the mantine button component preview
          globalStyles: (globalTheme) => ({
            ':root': {
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

              '--app-primary-focus': globalTheme.fn.rgba(globalTheme.colors[globalTheme.primaryColor][6], 0.54),

              ...(globalTheme.colorScheme === 'dark'
                ? {
                    '--app-background': ' var(--mantine-color-dark-7)',
                    '--app-foreground': ' var(--mantine-color-gray-4)',
                    '--app-foreground-active': ' var(--mantine-color-white)',
                    '--app-foreground-inactive': ' var(--mantine-color-dark-3)',
                    '--app-primary': ' var(--mantine-color-primary-color-8)',
                    '--app-secondary': ' var(--mantine-color-dark-4)',
                    '--app-border': ' var(--mantine-color-dark-5)',
                    '--app-focus': ' var(--mantine-color-indigo-5)',
                    '--app-error': ' var(--mantine-color-red-8)',
                    '--app-overlay': ' var(--mantine-color-gray-5)',
                    '--app-background-secondary':
                      ' var(--mantine-color-gray-9)',

                    '--tab-background': ' var(--app-background)',
                    '--tab-foreground': ' var(--mantine-color-dark-0)',
                    '--tab-foreground-inactive': ' var(--mantine-color-gray-4)',
                    '--tab-border': ' var(--mantine-color-dark-4)',
                    '--tab-background-hover': ' var(--mantine-color-dark-7)',
                    '--tab-background-active':
                      ' var(--statusBar-background-active)',
                    '--tab-background-activeColor':
                      ' var(--mantine-color-dark-5)',

                    '--activityBar-background': ' var(--mantine-color-dark-5)',
                    '--activityBar-foreground': ' var(--mantine-color-white)',
                    '--activityBar-foreground-inactive':
                      ' var(--mantine-color-gray-4)',
                    '--activityBar-background-active': ' var(--focus-level-2)',
                    '--activityBar-border-active': ' var(--app-primary)',
                    '--activityBar-border': ' var(--mantine-color-dark-5)',
                    '--activityBarBadge-foreground':
                      ' var(--mantine-color-white)',
                    '--activityBarBadge-background':
                      ' var(--mantine-color-blue-6)',

                    '--statusBar-background': ' var(--app-background)',
                    '--statusBar-foreground': ' var(--app-foreground)',
                    '--statusBar-foreground-active':
                      ' var(--app-foreground-active)',
                    '--statusBar-border': ' var(--mantine-color-dark-5)',
                    '--statusBar-background-active':
                      ' var(--mantine-color-gray-9)',

                    '--input-border': ' var(--app-border)',
                    '--input-placeholder': ' var(--mantine-color-dark-3)',
                    '--input-text': ' var(--mantine-color-white)',
                    '--input-background-focus': ' var(--mantine-color-dark-7)',
                    '--input-background': ' var(--mantine-color-dark-5)',

                    '--popover-background': ' var(--mantine-color-dark-5)',
                    '--popover-foreground': ' var(--app-foreground)',
                    '--popover-border': ' transparent',
                    '--popover-shadow':
                      ' var(--mantine-color-dark-9) 0px 8px 6px -6px',

                    '--focus-border': ' var(--mantine-color-blue-8)',

                    '--modal-background': ' var(--mantine-color-dark-6)',
                    '--modal-foreground': ' var(--mantine-color-dark-2)',
                    '--modal-foreground-active': ' var(--mantine-color-white)',
                    '--modal-shadow': ' var(--mantine-color-dark-9)',
                    '--modal-border': ' var(--mantine-color-dark-6)',

                    '--heading-color': 'var(--mantine-color-gray-5)',

                    '--color':
                      '  128, 128, 128' /* var(--mantine-color-gray-6) */,

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
                  }
                : {
                    '--app-background': 'var(--mantine-color-gray-0)',
                    '--app-foreground': 'var(--mantine-color-dark-5)',
                    '--app-foreground-active': 'var(--mantine-color-gray-9)',
                    '--app-foreground-inactive': 'var(--mantine-color-dark-4)',
                    '--app-primary': 'var(--mantine-color-primary-color-6)',
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
                    '--tab-background-activeColor':
                      'var(--mantine-color-gray-1)',

                    '--activityBar-background': 'var(--mantine-color-gray-1)',
                    '--activityBar-foreground': 'var(--mantine-color-dark-6)',
                    '--activityBar-foreground-inactive':
                      'var(--mantine-color-dark-3)',
                    '--activityBar-background-active': 'var(--focus-level-2)',
                    '--activityBar-border-active': 'var(--app-primary)',
                    '--activityBar-border': 'var(--mantine-color-gray-3)',
                    '--activityBarBadge-foreground':
                      'var(--mantine-color-white)',
                    '--activityBarBadge-background':
                      'var(--mantine-color-blue-6)',

                    '--statusBar-background': 'var(--app-background)',
                    '--statusBar-foreground': 'var(--app-foreground)',
                    '--statusBar-foreground-active':
                      'var(--app-foreground-active)',
                    '--statusBar-border': 'var(--app-border)',
                    '--statusBar-background-active':
                      'var(--mantine-color-gray-2)',

                    '--input-border': 'var(--app-border)',
                    '--input-placeholder': 'var(--mantine-color-gray-6)',
                    '--input-text': 'var(--mantine-color-gray-9)',
                    '--input-background-focus': 'var(--mantine-color-white)',
                    '--input-background': ' var(--mantine-color-gray-2)',

                    '--popover-background': 'var(--mantine-color-white)',
                    '--popover-foreground': 'var(--app-foreground)',
                    '--popover-border': 'transparent',
                    '--popover-shadow':
                      'var(--mantine-color-dark-9) 0px 8px 6px -6px',

                    '--focus-border': 'var(--mantine-color-blue-8)',

                    '--modal-background': 'var(--mantine-color-gray-1)',
                    '--modal-foreground': 'var(--mantine-color-dark-6)',
                    '--modal-foreground-active': 'var(--mantine-color-gray-9)',
                    '--modal-shadow': 'var(--mantine-color-dark-1)',
                    '--modal-border': 'var(--mantine-color-gray-3)',

                    '--heading-color': 'var(--mantine-color-dark-4)',

                    '--color': '86, 88, 105'  /* var(--mantine-color-dark-3) */,

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
                  }),

              ...([
                EFirecampThemeVariant.LightSecondary,
                EFirecampThemeVariant.DarkSecondary,
              ].includes(theme)
                ? {
                    '--app-primary': 'var(--mantine-color-green-7) !important',
                  }
                : {}),
            },

            // tailwind class based theme styles
            ...(globalTheme.colorScheme === 'dark'
              ? {
                  '.invert img': {
                    filter: 'invert(0.8)',
                  },
                  '.drag-icon': {
                    filter: 'invert(1)',
                  },
                }
              : {
                  '.invert img': {
                    filter: 'invert(0)',
                  },
                }),

            /*
            1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
            2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
            */
            '*,::before,::after': {
              boxSizing: 'border-box' /* 1 */,
              borderWidth: 0 /* 2 */,
              borderStyle: 'solid' /* 2 */,
              borderColor: 'currentColor' /* 2 */,
            },

            '::before,::after': {
              '--tw-content': '',
            },

            /*
            1. Use a consistent sensible line-height in all browsers.
            2. Prevent adjustments of font size after orientation changes in iOS.
            3. Use a more readable tab size.
            4. Use the user's configured `sans` font-family by default.
            5. Use the user's configured `sans` font-feature-settings by default.
            6. Use the user's configured `sans` font-variation-settings by default.
            */

            html: {
              lineHeight: 1.5 /* 1 */,
              WebkitTextSizeAdjust: '100%' /* 2 */,
              MozTabSize: 4 /* 3 */,
              OTabSize: 4,
              tabSize: 4 /* 3 */,
              fontFamily: 'sans-serif' /* 4 */,
              fontFeatureSettings: 'normal' /* 5 */,
              fontVariationSettings: 'normal' /* 6 */,
            },

            /*
            1. Remove the margin in all browsers.
            2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
            */
            body: {
              margin: 0 /* 1 */,
              lineHeight: 'inherit' /* 2 */,
            },

            /*
            1. Add the correct height in Firefox.
            2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
            3. Ensure horizontal rules are visible by default.
            */
            'hr ': {
              height: 0 /* 1 */,
              color: 'inherit' /* 2 */,
              borderTopWidth: '1px' /* 3 */,
            },

            /*
            Add the correct text decoration in Chrome, Edge, and Safari.
            */
            'abbr:where([title])': {
              textDecoration: 'underline dotted',
            },

            /*
            Remove the default font size and weight for headings.
            */
            'h1,h2,h3,h4,h5,h6': {
              fontSize: 'inherit',
              fontWeight: 'inherit',
            },

            /*
            Reset links to optimize for opt-in styling instead of opt-out.
            */
            a: {
              color: 'inherit',
              textDecoration: 'inherit',
            },

            /*
            Add the correct font weight in Edge and Safari.
            */
            'b,strong': {
              fontWeight: 'bolder',
            },

            /*
            1. Use the user's configured `mono` font family by default.
            2. Correct the odd `em` font sizing in all browsers.
            */
            'code,kbd,samp,pre': {
              fontFamily: 'ui-monospace' /* 1 */,
              fontSize: '1em' /* 2 */,
            },

            /*
            Add the correct font size in all browsers.
            */
            small: {
              fontSize: '80%',
            },

            /*
            Prevent `sub` and `sup` elements from affecting the line height in all browsers.
            */
            'sub,sup': {
              fontSize: '75%',
              lineHeight: 0,
              position: 'relative',
              verticalAlign: 'baseline',
            },

            sub: {
              bottom: '-0.25em',
            },

            sup: {
              top: '-0.5em',
            },

            /*
            1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
            2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
            3. Remove gaps between table borders by default.
            */
            table: {
              textIndent: 0 /* 1 */,
              borderColor: 'inherit' /* 2 */,
              borderCollapse: 'collapse' /* 3 */,
            },

            /*
            1. Change the font styles in all browsers.
            2. Remove the margin in Firefox and Safari.
            3. Remove default padding in all browsers.
            */
            'button,input,optgroup,select,textarea': {
              fontFamily: 'inherit' /* 1 */,
              fontSize: '100%' /* 1 */,
              fontWeight: 'inherit' /* 1 */,
              lineHeight: 'inherit' /* 1 */,
              color: 'inherit' /* 1 */,
              margin: 0 /* 2 */,
              padding: 0 /* 3 */,
            },

            /*
            Remove the inheritance of text transform in Edge and Firefox.
            */
            'button,select': {
              textTransform: 'none',
            },

            /*
            1. Correct the inability to style clickable types in iOS and Safari.
            2. Remove default button styles.
            */
            /* Update: The default button styles were commented out due to their interference with the default styles of Mantine components. */
            /* button,[type='button'],[type='reset'],[type='submit'] {
              -webkit-appearance: button; //1
              background-color: transparent; //2
              background-image: none; //2
            } */

            /*
            Use the modern Firefox focus style for all focusable elements.
            */
            ':-moz-focusring': {
              outline: 'auto',
            },

            /*
            Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
            */
            ':-moz-ui-invalid': {
              boxShadow: 'none',
            },

            /*
            Add the correct vertical alignment in Chrome and Firefox.
            */
            progress: {
              verticalAlign: 'baseline',
            },

            /*
            Correct the cursor style of increment and decrement buttons in Safari.
            */
            '::-webkit-inner-spin-button,::-webkit-outer-spin-button': {
              height: 'auto',
            },

            /*
            1. Correct the odd appearance in Chrome and Safari.
            2. Correct the outline style in Safari.
            */
            '[type="search"]': {
              WebkitAppearance: 'textfield' /* 1 */,
              outlineOffset: '-2px' /* 2 */,
            },

            /*
            Remove the inner padding in Chrome and Safari on macOS.
            */
            '::-webkit-search-decoration': {
              WebkitAppearance: 'none',
            },

            /*
            1. Correct the inability to style clickable types in iOS and Safari.
            2. Change font properties to `inherit` in Safari.
            */
            '::-webkit-file-upload-button': {
              WebkitAppearance: 'button' /* 1 */,
              font: 'inherit' /* 2 */,
            },

            /*
            Add the correct display in Chrome and Safari.
            */
            summary: {
              display: 'list-item',
            },

            /*
            Removes the default spacing and border for appropriate elements.
            */
            'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre': {
              margin: 0,
            },

            fieldset: {
              margin: 0,
              padding: 0,
            },

            legend: {
              padding: 0,
            },

            'ol,ul,menu': {
              listStyle: 'none',
              margin: 0,
              padding: 0,
            },

            /*
            Prevent resizing textareas horizontally by default.
            */
            textarea: {
              resize: 'vertical',
            },

            /*
            1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
            2. Set the default placeholder color to the user's configured gray 400 color.
            */
            'input::-moz-placeholder,textarea::-moz-placeholder': {
              opacity: 1 /* 1 */,
              color: '#9ca3af' /* 2 */,
            },

            /*
            1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
            2. Set the default placeholder color to the user's configured gray 400 color.
            */
            'input::placeholder,textarea::placeholder': {
              opacity: 1 /* 1 */,
              color: '#9ca3af' /* 2 */,
            },

            /*
            Set the default cursor for buttons.
            */
            'button,[role="button"]': {
              cursor: 'pointer',
            },

            /*
            Make sure disabled buttons don't get the pointer cursor.
            */
            ':disabled': {
              cursor: 'default',
            },

            /*
            1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
            2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
            This can trigger a poorly considered lint error in some tools but is included by design.
            */
            'img,svg,video,canvas,audio,iframe,embed,object': {
              display: 'block' /* 1 */,
              verticalAlign: 'middle' /* 2 */,
            },

            /*
            Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
            */
            'img,video': {
              maxWidth: '100%',
              height: 'auto',
            },

            /* Make elements with the HTML hidden attribute stay hidden by default */
            '[hidden]': {
              display: 'none',
            },
          }),
          colorScheme,
          colors: {
            'primary-color': [
              EFirecampThemeVariant.LightPrimary,
              EFirecampThemeVariant.DarkPrimary,
            ].includes(theme)
              ? primaryColor
              : secondaryColor,
            dark: defaultDarkColor,
            gray: defaultGrayColor,
          },
          primaryColor: 'primary-color',
          fontFamily: " 'Lato', 'sans-serif' ",
        }}
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
        {...props}
      >
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default FirecampThemeProvider;
