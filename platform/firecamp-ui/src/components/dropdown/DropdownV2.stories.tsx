import { useState } from 'react';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscFile } from "@react-icons/all-files/vsc/VscFile";
import { VscGithubInverted } from "@react-icons/all-files/vsc/VscGithubInverted";
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { VscRemote } from '@react-icons/all-files/vsc/VscRemote';
import { VscSignIn } from '@react-icons/all-files/vsc/VscSignIn';
import { VscSignOut } from '@react-icons/all-files/vsc/VscSignOut';
import { VscTwitter } from "@react-icons/all-files/vsc/VscTwitter";

import DropDownV2 from './DropdownV2';
import Button from '../buttons/Button';
import { IOptionsV2 } from './interfaces/Dropdown.interfaces';
import StatusBar from '../status-bar/StatusBar';

export default {
  title: "UI-Kit/Dropdown/v2",
  component: DropDownV2,
  argTypes: {
    text: "Firecamp"
  }
};

//TODO: define options structure for 3 listing types i.e [simple list, with header, with pre/post components]
export const DropDownv2Example = () => {
  const [selected, setSelected] = useState('API style');

  return <DropDownV2
    displayDefaultOptionClassName={1}
    handleRenderer={() => <Button id={"button"} text={selected} primary sm className='rounded p-2' uppercase={true} withCaret={true} />}
    options={[
      {
        id: '1',
        name: 'Rest',
        disabled: false,
        className: 'w-fit'
      },
      {
        id: '2',
        name: 'GraphQL',
        prefix: () => (<VscAdd className='mr-2' size={10} />),
        disabled: false,
        className: '',
        showSeparator: true,
        postfix: () => (<VscChevronRight size={10} className={"ml-auto"} />),
        optionContainerClassName: 'p-1',
        list: [{
          id: '2.1',
          name: 'Firecamp 2.1',
          disabled: false,
          className: 'w-fit'
        }, {
          id: '2.2',
          name: 'Firecamp 2.2',
          postfix: () => (<VscChevronRight size={10} className={"ml-auto"} />),
          disabled: false,
          className: 'mr-2',
          optionContainerClassName: 'p-2',
          list: [{
            id: '2.1.1',
            name: 'Firecamp 2.1.1',
            disabled: false,
            className: ''
          }, {
            id: '2.1.2',
            name: 'Firecamp 2.1.2',
            disabled: true,
            className: ''

          }, {
            id: '2.1.3',
            name: 'Firecamp 2.1.3',
            disabled: false,
            showSeparator: true,
            className: 'w-fit',

          }, {
            id: '2.1.4',
            name: 'Firecamp 2.1.4',
            disabled: false,
            className: ''
          }
          ]
        }]
      },
      {
        id: '3',
        name: 'Socket.io',
        postfix: () => (
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
        postfix: () => (<VscChevronRight size={10} className={"ml-auto"} />),
        disabled: true,
        className: '',
        list: [{
          id: '5',
          name: 'Firecamp',
          disabled: false,
          className: ''
        }]
      }

    ]}
    onSelect={(value) => setSelected(value.name)}
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

  statusBarOptionContainer: 'ml-1 w-fit !pb-2 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
  statusBarTabHeader: '!pt-[0.2rem] !pb-2 !px-3 !block !text-base font-medium leading-6 !opacity-100 !bg-focus2',
  statusBarTabItem: '!py-1 !px-3 text-sm leading-6 text-appForeground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none justify-between',
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
    options={[

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
    ] as IOptionsV2[]}
    onSelect={(value) => setSelected(value.name)}
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
    options={[
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
    ] as IOptionsV2[]}
    onSelect={(value) => setSelected(value.name)}
    optionContainerClassName={STYLES.emitterBodyOptionContainer}
  />
};

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
    options={[
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
    ]}
    onSelect={(value) => setSelected(value.name)}
    optionContainerClassName={STYLES.logOptionContainer}

  />
};

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
      options={[
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
      ]}
      onSelect={(value) => setSelected(value.name)}
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

export const StatusBarExample = () => {
  const [selected, setSelected] = useState('My workspace');
  const [userSelected, setUserSelected] = useState('Guest');

  return <StatusBar className="border-t focus-outer2 mt-[50%]">
    <StatusBar.PrimaryRegion>
      <div
        tabIndex={1}
        className="bg-primaryColor text-primaryColorText w-fit px-3 flex items-center"
        id={'status-bar-firecamp-version'}
        data-tip={`Firecamp`}
      >
        <VscRemote size={12} />
        <span className="pl-1">Firecamp</span>
      </div>
      <div className="bg-focus3 flex items-center px-3">
        <VscAccount size={16} className="mr-1" />

        <DropDownV2
          handleRenderer={() =>
            <span className="pl-1 cursor-pointer">
              {userSelected}
            </span>
          }
          options={[
            {
              id: 'heading',
              name: 'Guest',
              className: STYLES.statusBarTabHeader,
              disabled: true,
              postfix: () => (
                <>
                  <br />
                  <div className={'text-sm font-light leading-3 text-appForegroundInActive'}>
                    User
                  </div>
                </>

              ),
            },
            {
              id: 'sign_in',
              name: 'Sign in',
              className: STYLES.statusBarTabItem,
              postfix: () => (
                <div className={'ml-2 leading-3 text-primaryColor'}>
                  <VscSignIn size={20} />
                </div>
              ),
            },
            {
              id: 'create_account',
              name: 'Create an account',
              className: STYLES.statusBarTabItem,
              postfix: () => (
                <div className={'ml-2 leading-3 text-primaryColor'}>
                  <VscAccount size={20} />
                </div>
              ),
            }
          ]}
          onSelect={(value) => setUserSelected(value.name)}
          optionContainerClassName={STYLES.statusBarOptionContainer}
          displayDefaultOptionClassName={2}
        />
        <VscChevronRight size={14} className="mt-0.5" />

        <DropDownV2
          handleRenderer={() =>
            <span className="pl-1 cursor-pointer">
              {selected}
            </span>
          }
          options={[
            {
              id: 'heading',
              name: 'FC Team',
              className: STYLES.statusBarTabHeader,
              disabled: true,
              postfix: () => (
                <>
                  <br />
                  <div className={'text-sm font-light leading-3 text-appForegroundInActive'}>
                    Workspace
                  </div>
                </>

              ),
            },
            {
              id: 'workspace_mgmt',
              name: 'Workspace Management',
              className: STYLES.statusBarTabItem,
              postfix: () => (
                <div className={'ml-2 leading-3'}>
                  <VscAdd size={14} strokeWidth={1.5} />
                </div>
              ),
            },
            {
              id: 'invite_member',
              name: 'Invite Members',
              className: STYLES.statusBarTabItem,
              postfix: () => (
                <div className={'ml-2 leading-3'}>
                  <VscAdd size={14} strokeWidth={1.5} />
                </div>
              ),
            },
            {
              id: 'switch_workspace',
              name: 'Switch to Workspace',
              className: STYLES.statusBarTabItem,
              postfix: () => (
                <div className={'ml-2 leading-3 text-primaryColor'}>
                  <VscRemote size={14} strokeWidth={1.5} />
                </div>
              ),
            },
            {
              id: 'switch_org',
              name: 'Switch to Org',
              className: STYLES.statusBarTabItem,
              postfix: () => (
                <div className={'ml-2 leading-3 text-primaryColor'}>
                  <VscRemote size={14} strokeWidth={1.5} />
                </div>
              ),
            }
          ]}
          onSelect={(value) => setSelected(value.name)}
          optionContainerClassName={STYLES.statusBarOptionContainer}
          displayDefaultOptionClassName={2}
        />
      </div>
    </StatusBar.PrimaryRegion>
    <StatusBar.SecondaryRegion>
      <div className="flex items-center">
        <a className="flex items-center pr-2 " href="#" ><VscTwitter size={12} className="text-statusBarForeground hover:text-statusBarForegroundActive" /></a>
        <a className="flex items-center pr-2" href="#" ><VscGithubInverted size={12} className="text-statusBarForeground hover:text-statusBarForegroundActive" /></a>
        <a className="flex items-center pr-2" href="#" ><VscFile size={12} className="text-statusBarForeground hover:text-statusBarForegroundActive" /></a>
      </div>
    </StatusBar.SecondaryRegion>
  </StatusBar>

};
