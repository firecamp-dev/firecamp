//@ts-nocheck
import { useState } from 'react';
import DropDownV2 from './DropdownV2';
import Button from '../buttons/Button';

import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';

export default {
  title: "UI-Kit/Dropdown/v2",
  component: DropDownV2,
  argTypes: {
    text: "Firecamp"
  }
};


export const DropDownv2Example = () => {
  const [selected, setSelected] = useState('API style');

  return <DropDownV2
    displayDefaultOptionClassName={1}
    handleRenderer={() => <Button id={"button"} text={selected} color='primary' size='sm' className='rounded p-2' uppercase={true} withCaret={true} />}
    option={[
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

    ]}
    onSelect={(value) => setSelected(value)}
    optionContainerClassName={"ml-2"}
    showOptionArrow={true}
  />
};

const STYLES = {
  bodyTabOptionContainer: 'w-36 bg-popoverBackground',
  bodyTabHeader: '!pb-1 !pt-3 uppercase !text-xs font-medium leading-3 font-sans ',
  bodyTabItem: 'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',

  emitterBodyOptionContainer: 'w-fit ml-2 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
  emitterTabItem: 'pl-3 text-popoverForeground text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',

  logOptionContainer: 'w-36 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
  logTabItem: '!p-1 !pl-2 text-sm leading-4 text-appForeground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none',

  reqStatusBarOptionContainer: 'ml-1 w-36 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
  reqStatusBarTabItem: '!p-1 !pl-2 text-sm leading-4 text-appForeground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none',
}

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
    option={[

      {
        id: 'FormAndQueryHeader',
        name: 'Form and query',
        disabled: true,
        className: STYLES.bodyTabHeader
      },
      {
        id: 'multipart',
        name: 'Multipart',
        className: STYLES.bodyTabItem
      },
      {
        id: 'FormURLEncode',
        name: 'Form URL Encode',
        className: STYLES.bodyTabItem
      },
      {
        id: 'GraphQLQueries',
        name: 'GraphQL Queries',
        className: STYLES.bodyTabItem
      },
      {
        id: 'RawHeader',
        name: 'Raw',
        disabled: true,
        className: STYLES.bodyTabHeader
      },
      {
        id: 'json',
        name: 'Json',
        className: STYLES.bodyTabItem
      },
      {
        id: 'xml',
        name: 'Xml',
        className: STYLES.bodyTabItem
      },
      {
        id: 'text',
        name: 'Text',
        className: STYLES.bodyTabItem
      }
    ]}
    onSelect={(value) => setSelected(value)}
    displayDefaultOptionClassName={2}
    optionContainerClassName={STYLES.bodyTabOptionContainer}
  />
};


export const EmitterBodyExample = () => {
  const [selected, setSelected] = useState('Text');

  return <DropDownV2
    handleRenderer={() => <Button
      text={selected}
      className="font-bold hover:!bg-focus1"
      withCaret
      transparent
      ghost
      sm
      primary
    />}
    option={[
      {
        id: 'Text',
        name: 'Text',
        className: STYLES.emitterTabItem
      },
      {
        id: 'Json',
        name: 'Json',
        className: STYLES.emitterTabItem
      },
      {
        id: 'File',
        name: 'File',
        className: STYLES.emitterTabItem
      },
      {
        id: 'ArrayBuffer',
        name: 'Array buffer',
        className: STYLES.emitterTabItem
      },
      {
        id: 'ArrayBufferView',
        name: 'Array buffer view',
        className: STYLES.emitterTabItem
      },
      {
        id: 'Number',
        name: 'Number',
        className: STYLES.emitterTabItem
      },
      {
        id: 'Boolean',
        name: 'Boolean',
        className: STYLES.emitterTabItem
      },
      {
        id: 'NoBody',
        name: 'No body',
        className: STYLES.emitterTabItem
      }
    ]}
    onSelect={(value) => setSelected(value)}
    optionContainerClassName={STYLES.emitterBodyOptionContainer}
  />
};


const LogsOptions = [
  {
    id: 'system',
    name: 'System',
    className: STYLES.logTabItem
  },
  {
    id: 'send',
    name: 'Send',
    className: STYLES.logTabItem
  },
  {
    id: 'receive',
    name: 'Receive',
    className: STYLES.logTabItem
  }
];
export const LogsExample = () => {
  const [selected, setSelected] = useState('');

  return <DropDownV2
    handleRenderer={() => <Button
      className='w-36 text-base'
      text={selected || 'select log type'}
      tooltip={
        selected
          ? `Log type: ${selected || ''}`
          : ''
      }
      secondary
      withCaret
      sm
    />}
    option={LogsOptions}
    onSelect={(value) => setSelected(value)}
    optionContainerClassName={STYLES.logOptionContainer}
  // displayDefaultOptionClassName={2}
  />
};

const ReqStatusBarOptions = [
  {
    id: 'my_query',
    name: 'MyQuery',
    className: STYLES.reqStatusBarTabItem
  },
  {
    id: 'my_query_1',
    name: 'MyQuery1',
    className: STYLES.reqStatusBarTabItem
  },
];
export const ReqStatusBarExample = () => {
  const [selected, setSelected] = useState('MyQuery');

  return <div className="flex ml-auto mr-1">

    <DropDownV2
      handleRenderer={() => <Button
        text={selected}
        secondary
        withCaret
        xs
        className='leading-6 !rounded-br-none !rounded-tr-none'
      />}
      option={ReqStatusBarOptions}
      onSelect={(value) => setSelected(value)}
      optionContainerClassName={STYLES.reqStatusBarOptionContainer}
    />
    <Button
      text=""
      primary
      sm
      icon={<IoSendSharp />}
      iconLeft
      onClick={() => { }}
      className="!rounded-bl-none !rounded-tl-none"
    />
  </div>
};
