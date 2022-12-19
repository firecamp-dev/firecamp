//@ts-nocheck
import { Fragment, useState } from 'react';
import Dropdown from './Dropdown';
import Button from '../buttons/Button';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import cx from 'classnames';

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
    className: 'w-fit'
  },
  {
    id: '2',
    name: 'GraphQL',
    prefix: _ => (<VscAdd className='mr-2' size={10} />),
    disabled: false,
    className: '',
    showSeparator: true,
    postfix: () => (<VscChevronRight size={10} className={"ml-auto"} />),
    list: [{
      id: '2.1',
      name: 'Firecamp 2.1',
      prefix: '',
      postfix: '',
      disabled: false,
      className: 'w-fit'
    }, {
      id: '2.2',
      name: 'Firecamp 2.2',
      prefix: '',
      postfix: () => (<VscChevronRight size={10} className={"ml-auto"} />),
      disabled: false,
      className: 'mr-2',
      list: [{
        id: '2.1.1',
        name: 'Firecamp 2.1.1',
        prefix: '',
        postfix: '',
        disabled: false,
        className: ''
      }, {
        id: '2.1.2',
        name: 'Firecamp 2.1.2',
        prefix: '',
        postfix: '',
        disabled: true,
        className: ''

      }, {
        id: '2.1.3',
        name: 'Firecamp 2.1.3',
        prefix: '',
        postfix: '',
        disabled: false,
        showSeparator: true,
        className: 'w-fit',

      }, {
        id: '2.1.4',
        name: 'Firecamp 2.1.4',
        prefix: '',
        postfix: '',
        disabled: false,
        className: ''
      }
      ]
    }]
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
    postfix: () => (<VscChevronRight size={10} className={"ml-auto"} />),
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

export const DropDownv2Example = () => {
  let [selected, setSelected] = useState('API style');

  return <DropDownv2
    selectedElement={<Button id={"button"} text={selected} color='primary' size='sm' className='rounded p-2' uppercase={true} withCaret={true} />}
    option={options}
    onSelect={(value) => setSelected(value)}
    optionsClassName={"ml-2"}
  />
};

const DropDownv2 = ({ selectedElement, option, onSelect, optionsClassName = "", className = '', disabled = false }) => {

  return (<DropdownMenu.Root>

    <DropdownMenu.Trigger className={cx({ 'opacity-50': disabled })} disabled={disabled} asChild>
      <span>
        {typeof prefix === 'function' && prefix()}
        <span className={className}>{selectedElement}
        </span>
        {typeof postfix === 'function' && postfix()}
      </span>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={cx("rounded bg-appBackground border border-appForeground ", optionsClassName)} sideOffset={5}>

        {
          option.map((item) => {
            if (item.list !== undefined) {
              return <Fragment key={item.id}>
                <DropDownNested className={item.className}
                  selectedElement={item.name}
                  onSelect={onSelect}
                  option={item.list}
                  postfix={item.postfix}
                  prefix={item.prefix}
                  disabled={item.disabled}
                  optionsClassName={item.optionsClassName}

                />
                {item.showSeparator && <Separator />}
              </Fragment>
            }
            return <Fragment key={item.id}>
              <Item
                className={item.className}
                text={item.name}
                prefix={item.prefix}
                postfix={item.postfix}
                disabled={item.disabled}
                onClick={() => onSelect(item.name)} />
              {item.showSeparator && <Separator />}
            </Fragment>
          })
        }

        <DropdownMenu.Arrow />
      </DropdownMenu.Content>

    </DropdownMenu.Portal>
  </DropdownMenu.Root>
  );
};
const DropDownNested = ({ postfix, prefix, selectedElement, option, onSelect, className = '', optionsClassName = '', disabled = false }) => {

  return <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger className={cx('px-2 flex items-center', { 'opacity-50': disabled })} disabled={disabled} asChild>
      <span>
        {typeof prefix === 'function' && prefix()}
        <span className={className}>
          {selectedElement}
        </span>
        {typeof postfix === 'function' && postfix()}
      </span>
    </DropdownMenu.SubTrigger>
    <DropdownMenu.Portal>
      <DropdownMenu.SubContent
        className={cx("rounded bg-appBackground border border-appForeground ", optionsClassName)}
        sideOffset={5}
        alignOffset={0}
      >
        {
          option.map((item) => {
            if (item.list !== undefined) {
              return <Fragment key={item.id}>
                <DropDownNested selectedElement={item.name}
                  className={item.className}
                  onSelect={onSelect} option={item.list} postfix={item.postfix}
                  prefix={item.prefix}
                  disabled={item.disabled}

                />
                {item.showSeparator && <Separator />}
              </Fragment>
            }
            return <Fragment key={item.id}>
              <Item
                className={item.className}
                text={item.name}
                prefix={item.prefix}
                postfix={item.postfix}
                disabled={item.disabled}
                onClick={() => onSelect(item.name)} />
              {item.showSeparator && <Separator />}
            </Fragment>
          })
        }
        <DropdownMenu.Arrow />
      </DropdownMenu.SubContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Sub>

};
const Item = ({ text, onClick, disabled = false, prefix, postfix, className = '' }) => {
  return <DropdownMenu.Item
    className={cx('flex items-center h-6 relative text-appForeground px-2', className, { 'opacity-50': disabled })}
    disabled={disabled}
    onClick={onClick}>
    {typeof prefix === 'function' && prefix()}
    {text}
    {typeof postfix === 'function' && postfix()}
  </DropdownMenu.Item>
};
const Separator = () => {
  return (<DropdownMenu.Separator className="my-1 bg-appForeground opacity-50 " style={{ height: "1px" }} />
  );
};