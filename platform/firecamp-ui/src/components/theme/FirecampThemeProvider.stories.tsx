import cx from 'classnames';
import { Button, FirecampThemeProvider } from '@firecamp/ui';
import FirecampThemeSelector from './FirecampThemeSelector';

export default {
  title: 'UI-Kit/Theme/FirecampThemeProvider',
  component: FirecampThemeProvider,
};

export const Example = ({ ...args }: any) => {
  return (
    <FirecampThemeProvider {...args}>
      <div className={cx('border border-app-border rounded p-6')}>
        <span className="mx-2">Firecamp Theme Selector : </span>
        <FirecampThemeSelector />

        <div className="flex flex-row justify-start items-center p-2 mb-2 ">
          <div className="block text-base uppercase font-semibold text-app-foreground-inactive mb-1 mr-2">
            Mantine Button
          </div>
          <Button text="Button example" primary sm />
          <Button text="Button example" primary sm disabled />
        </div>
        <br />
      </div>
    </FirecampThemeProvider>
  );
};
