import { useState } from 'react';
import { Switch, ISwitch } from '@firecamp/ui';

export default {
  title: 'UI-Kit/Switch',
  component: Switch,
};

const Template = ({ checked, onChange, ...args }: Partial<ISwitch>) => {
  const [active, updateChecked] = useState(checked);
  return <Switch checked={active} onToggleCheck={updateChecked} {...args} />;
};
export const SwitchPreview = Template.bind({});
SwitchPreview.args = {
  checked: false,
  label: 'Switch label',
  classNames: { root: 'px-4' },
};

export const SwitchStates = () => {
  return (
    <div className="flex flex-row gap-2">
      <Switch checked={false} onToggleCheck={() => {}} />
      <Switch checked={true} onToggleCheck={() => {}} />
    </div>
  );
};
export const SwitchSizes = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <span className="w-40">X Extra Small </span>
        <Switch
          checked={false}
          onToggleCheck={() => {}}
          xxs
          classNames={{ root: 'w-40' }}
        />
        <Switch
          checked={true}
          onToggleCheck={() => {}}
          xxs
          classNames={{ root: 'w-40' }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <span className="w-40">Extra Small </span>
        <Switch
          checked={false}
          onToggleCheck={() => {}}
          size="xs"
          classNames={{ root: 'w-40' }}
        />
        <Switch
          checked={true}
          onToggleCheck={() => {}}
          size="xs"
          classNames={{ root: 'w-40' }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <span className="w-40">Small (Default) </span>

        <Switch
          checked={false}
          onToggleCheck={() => {}}
          size="sm"
          classNames={{ root: 'w-40' }}
        />
        <Switch
          checked={true}
          onToggleCheck={() => {}}
          size="sm"
          classNames={{ root: 'w-40' }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <span className="w-40">Medium </span>

        <Switch
          checked={false}
          onToggleCheck={() => {}}
          size="md"
          classNames={{ root: 'w-40' }}
        />
        <Switch
          checked={true}
          onToggleCheck={() => {}}
          size="md"
          classNames={{ root: 'w-40' }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <span className="w-40">Large </span>

        <Switch
          checked={false}
          onToggleCheck={() => {}}
          size="lg"
          classNames={{ root: 'w-40' }}
        />
        <Switch
          checked={true}
          onToggleCheck={() => {}}
          size="lg"
          classNames={{ root: 'w-40' }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <span className="w-40">Extra Large </span>
        <Switch
          checked={false}
          onToggleCheck={() => {}}
          size="xl"
          classNames={{ root: 'w-40' }}
        />
        <Switch
          checked={true}
          onToggleCheck={() => {}}
          size="xl"
          classNames={{ root: 'w-40' }}
        />
      </div>
    </div>
  );
};
