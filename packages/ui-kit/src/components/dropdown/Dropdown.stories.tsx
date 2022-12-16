//@ts-nocheck
import { useState } from 'react';
import Dropdown from './Dropdown';
import Button from '../buttons/Button';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default {
  title: "UI-Kit/Dropdown",
  component: Dropdown,
  argTypes: {
    text: "Firecamp"
  }
};

const Template = (args) => {

  let [selected, setSelected] = useState('API style')

  return (
    <Dropdown selected={selected}>
      <Dropdown.Handler>
        <Button text={selected} color='primary' size='sm' uppercase={true} withCaret={true} />
      </Dropdown.Handler>
      <Dropdown.Options
        hasHeader={true}
        hasDivider={true}
        options={
          [{
            header: 'APIs',
            list: [{
              id: '1',
              name: 'Rest',
              prefix: '',
              postfix: '',
              disabled: false,
              className: ''
            },
            {
              id: '2',
              name: 'GraphQL',
              prefix: _ => (
                <div className={'dropdown-icon'}>
                  gq
                </div>
              ),
              disabled: false,
              className: '',
              postfix: _ => (
                <div className="dropdown-text">
                  <span className="ml-4">
                    Coming soon
                  </span>
                </div>
              )
            },
            {
              id: '3',
              name: 'Socket.io',
              prefix: '',
              postfix: _ => (
                <div className="dropdown-text">
                  <span className="ml-4" >
                    Coming soon
                  </span>
                </div>
              ),
              disabled: false,
              className: ''
            },
            {
              id: '4',
              name: 'Websocket',
              prefix: '',
              postfix: '',
              disabled: true,
              className: ''
            }
            ]
          },
          {
            id: '5',
            name: 'Firecamp',
            prefix: '',
            postfix: '',
            disabled: false,
            className: ''
          }]
        }
        onSelect={item => {
          setSelected(item.name || 'oopss...')
        }} />
    </Dropdown>
  )
};

export const DropDownDemo = Template.bind({});

const options = [
  {
    id: '1',
    name: 'Rest',
    prefix: '',
    postfix: '',
    disabled: false,
    className: ''
  },
  {
    id: '2',
    name: 'GraphQL',
    prefix: _ => (
      <div className={'dropdown-icon'}>
        gq
      </div>
    ),
    disabled: false,
    className: '',
    postfix: _ => (
      <div className="dropdown-text">
        <span className="ml-4">
          Coming soon
        </span>
      </div>
    )
  },
  {
    id: '3',
    name: 'Socket.io',
    prefix: '',
    postfix: _ => (
      <div className="dropdown-text">
        <span className="ml-4" >
          Coming soon
        </span>
      </div>
    ),
    disabled: false,
    className: ''
  },
  {
    id: '4',
    name: 'Websocket',
    prefix: '',
    postfix: '',
    disabled: true,
    className: '',
    list: [{
      id: '5',
      name: 'Firecamp',
      prefix: '',
      postfix: '',
      disabled: false,
      className: ''
    }]
  }

]

const Item = ({ text, right, onClick, disabled = false, prefix, postfix }) => {
  return <DropdownMenu.Item className={`flex items-center h-6 relative text-appForeground px-2 ${disabled ? "opacity-50" : ""}`} disabled={disabled}
    onClick={onClick}>
    {typeof prefix === 'function' && prefix()}
    {text}
    {typeof postfix === 'function' && postfix()}
    {typeof right !== "undefined" && <div className="ml-auto">{right}</div>}

  </DropdownMenu.Item>
}

const Separator = () => {
  return (<DropdownMenu.Separator className="my-1 bg-appForeground opacity-50 " style={{ height: "1px" }} />
  );
}

export const DropDownv2 = () => {
  let [selected, setSelected] = useState('API style')

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>

        <span>
          <Button id={"button"} text={selected} color='primary' size='sm' className='rounded p-2' uppercase={true} withCaret={true} />
        </span>

      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="rounded bg-appBackground border border-appForeground" sideOffset={5}>

          {
            options.map(item => <Item text={item.name} key={item.id} prefix={item.prefix} postfix={item.postfix} right="⌘+T" onClick={() => setSelected(item.name)} />)
          }

          <Item text={"New Tab"} right="⌘+T" onClick={() => setSelected("NewTab")} />
          <Item text={"New Window"} right="⌘+N" />
          <Item text={"New Private Window"} right="⇧+⌘+N" disabled />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="px-2 flex">
              More Tools
              <div className="ml-auto">
                R
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="rounded bg-appBackground border border-appForeground"
                sideOffset={-2}
                alignOffset={10}
              >
                <Item text={"Save Page As… "} right="⌘+S" />
                <Item text={"Create Shortcut…"} />
                <Item text={"Name Window..."} />
                <Separator />

                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="px-2 flex">
                    More Tools
                    <div className="ml-auto">
                      R
                    </div>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent
                      className="rounded bg-appBackground border border-appForeground"
                      sideOffset={-2}
                      alignOffset={10}
                    >
                      <Item text={"Save Page As… "} right="⌘+S" />
                      <Item text={"Create Shortcut…"} />
                      <Item text={"Name Window..."} />
                      <Separator />

                      <Item text={"Developer Tools"} />
                      <DropdownMenu.Arrow className="DropdownMenuArrow" />
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>

                <Item text={"Developer Tools"} />
                <DropdownMenu.Arrow className="DropdownMenuArrow" />
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <Separator />


          <Item text={"New Window"} right="⌘+N" />
          <Item text={"New Private Window"} right="⇧+⌘+N" disabled />
          <DropdownMenu.Arrow className="DropdownMenuArrow" />

        </DropdownMenu.Content>

      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};