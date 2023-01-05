//@ts-nocheck
import { useState } from 'react';
import Dropdown from './Dropdown';
import DropDownV2 from './DropdownV2';
import Button from '../buttons/Button';

import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';

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
    optionContainerClassName: 'p-1',
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
      optionContainerClassName: 'p-2',
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
  const [selected, setSelected] = useState('API style');

  return <DropDownV2
    displayDefaultOptionClassName={1}
    handleRenderer={() => <Button id={"button"} text={selected} color='primary' size='sm' className='rounded p-2' uppercase={true} withCaret={true} />}
    option={options}
    onSelect={(value) => setSelected(value)}
    optionContainerClassName={"ml-2"}
    showOptionArrow={true}
  />
};

const bodyTabOptions = [

  {
    id: 'FormAndQueryHeader',
    name: 'Form and query',
    disabled: true,
    className: '!pb-1 !pt-3 uppercase !text-xs font-medium leading-3 font-sans '
  },
  {
    id: 'multipart',
    name: 'Multipart',
    className: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none'
  },
  {
    id: 'FormURLEncode',
    name: 'Form URL Encode',
    className: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none'
  },
  {
    id: 'GraphQLQueries',
    name: 'GraphQL Queries',
    className: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none'
  },
  {
    id: 'RawHeader',
    name: 'Raw',
    disabled: true,
    className: '!pb-1 !pt-3 uppercase !text-xs font-medium leading-3 font-sans '
  },
  {
    id: 'json',
    name: 'Json',
    className: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none'
  },
  {
    id: 'xml',
    name: 'Xml',
    className: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none'
  },
  {
    id: 'text',
    name: 'Text',
    className: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none'
  }
];
export const BodyTabExample = () => {
  const [selected, setSelected] = useState('');

  return <DropDownV2
  handleRenderer={() => <Button
      text={selected || 'No Body'}
      className="font-bold hover:!bg-focus1"
      withCaret
      transparent
      ghost
      xs
      primary
    />}
    option={bodyTabOptions}
    onSelect={(value) => setSelected(value)}
    displayDefaultOptionClassName={2}
    optionContainerClassName="w-36 bg-popoverBackground"
  />
};