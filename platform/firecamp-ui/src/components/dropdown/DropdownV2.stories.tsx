import { useState } from 'react';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { VscRemote } from '@react-icons/all-files/vsc/VscRemote';
import { VscSignIn } from '@react-icons/all-files/vsc/VscSignIn';
import { VscTwitter } from '@react-icons/all-files/vsc/VscTwitter';

import DropDownV2 from './DropdownV2';
import { IOptionsV2 } from './interfaces/Dropdownv2.interfaces';
import Button from '../buttons/Button';
import StatusBar from '../status-bar/StatusBar';

export default {
  title: 'UI-Kit/Dropdown/v2',
  component: DropDownV2,
};

export const DropDownv2Example = () => {
  const [selected, setSelected] = useState('API style');

  return (
    <DropDownV2
      classes={{ rounded: true }}
      handleRenderer={() => (
        <Button
          id={'button'}
          text={selected}
          primary
          sm
          className="rounded p-2"
          uppercase={true}
          withCaret={true}
        />
      )}
      options={[
        {
          id: '1',
          name: 'Rest',
          disabled: false,
        },
        {
          id: '2',
          name: 'GraphQL',
          disabled: false,
          showSeparator: true,
          prefix: () => <VscAdd className="mr-2" size={10} />,
          postfix: () => <VscChevronRight size={10} className={'ml-auto'} />,
          list: [
            {
              id: '2.1',
              name: 'Firecamp 2.1',
              disabled: false,
            },
            {
              id: '2.2',
              name: 'Firecamp 2.2',
              disabled: false,
              postfix: () => (
                <VscChevronRight size={10} className={'ml-auto'} />
              ),
              list: [
                {
                  id: '2.1.1',
                  name: 'Firecamp 2.1.1',
                  disabled: false,
                },
                {
                  id: '2.1.2',
                  name: 'Firecamp 2.1.2',
                  disabled: true,
                },
                {
                  id: '2.1.3',
                  name: 'Firecamp 2.1.3',
                  disabled: false,
                  showSeparator: true,
                },
                {
                  id: '2.1.4',
                  name: 'Firecamp 2.1.4',
                  disabled: false,
                },
              ],
            },
          ],
        },
        {
          id: '3',
          name: 'Socket.io',
          postfix: () => (
            <div className="dropdown-text">
              <span className="ml-4">Coming soon</span>
            </div>
          ),
          disabled: false,
        },
        {
          id: '4',
          name: 'Websocket',
          postfix: () => <VscChevronRight size={10} className={'ml-auto'} />,
          disabled: true,
          list: [
            {
              id: '5',
              name: 'Firecamp',
              disabled: false,
            },
          ],
        },
      ]}
      onSelect={(value: any) => setSelected(value.name)}
      showOptionArrow={true}
    />
  );
};

export const BodyTabExample = () => {
  const [selected, setSelected] = useState('');

  return (
    <DropDownV2
      handleRenderer={() => (
        <Button
          text={selected || 'No Body'}
          className="font-bold hover:!bg-focus1"
          withCaret
          transparent
          ghost
          xs
          primary
        />
      )}
      options={
        [
          {
            id: 'FormAndQueryHeader',
            name: 'Form and query',
            disabled: true,
            headerList: [
              {
                id: 'multipart',
                name: 'Multipart',
              },
              {
                id: 'FormURLEncode',
                name: 'Form URL Encode',
              },
              {
                id: 'GraphQLQueries',
                name: 'GraphQL Queries',
              },
            ],
          },
          {
            id: 'RawHeader',
            name: 'Raw',
            disabled: true,
            headerList: [
              {
                id: 'json',
                name: 'Json',
              },
              {
                id: 'xml',
                name: 'Xml',
              },
              {
                id: 'text',
                name: 'Text',
              },
            ],
          },
        ] as IOptionsV2[]
      }
      onSelect={(value: any) => setSelected(value.name)}
      classes={{
        rounded: false,
        options: 'w-36 bg-popoverBackground',
        header:
          '!pb-1 !pt-3 uppercase !text-xs font-medium leading-3 font-sans ',
        headerListItem:
          'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
      }}
    />
  );
};
export const CreateMenuExample = () => {
  const [selected, setSelected] = useState('');

  return (
    <DropDownV2
      handleRenderer={() => (
        <Button
          text={selected || 'Create'}
          className="font-bold hover:!bg-focus1"
          withCaret
          transparent
          ghost
          xs
          primary
        />
      )}
      options={
        [
          {
            id: 'CreateNewHeader',
            name: 'Create New',
            disabled: true,
            headerList: [
              {
                id: 'request',
                name: 'Request',
              },
              {
                id: 'collection',
                name: 'Collection',
              },
              {
                id: 'environment',
                name: 'Environment',
              },
              {
                id: 'importCollection',
                name: 'Import Collection',
                showSeparator: true,
              },
            ],
          },
          {
            id: 'CreateNewByAdminHeader',
            name: 'Create New (By Admin)',
            disabled: true,
            headerList: [
              {
                id: 'workspace',
                name: 'Workspace',
              },
              {
                id: 'organization',
                name: 'Organization',
              },
              {
                id: 'inviteMembers',
                name: 'Invite Members',
              },
            ],
          },
        ] as IOptionsV2[]
      }
      onSelect={(value: any) => setSelected(value.name)}
      classes={{
        rounded: false,
        options: 'w-[200px] bg-popoverBackground !pb-2',
        header:
          '!pb-1 !pt-3 !px-5 uppercase !text-xs font-medium leading-3 font-sans ',
        headerListItem:
          '!px-5 text-sm uppercase hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
      }}
    />
  );
};

export const EmitterBodyExample = () => {
  const [selected, setSelected] = useState('Text');

  return (
    <DropDownV2
      handleRenderer={() => (
        <Button
          text={selected || 'No Body'}
          className="font-bold hover:!bg-focus1"
          withCaret
          transparent
          ghost
          xs
          primary
        />
      )}
      options={
        [
          {
            id: 'Text',
            name: 'Text',
          },
          {
            id: 'Json',
            name: 'Json',
          },
          {
            id: 'File',
            name: 'File',
          },
          {
            id: 'ArrayBuffer',
            name: 'Array buffer',
          },
          {
            id: 'ArrayBufferView',
            name: 'Array buffer view',
          },
          {
            id: 'Number',
            name: 'Number',
          },
          {
            id: 'Boolean',
            name: 'Boolean',
          },
          {
            id: 'NoBody',
            name: 'No body',
          },
        ] as IOptionsV2[]
      }
      onSelect={(value: any) => setSelected(value.name)}
      classes={{
        rounded: false,
        shadow: true,
        options: 'w-fit ml-2 bg-popoverBackground border-0',
        item: 'pl-3 text-popoverForeground text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
      }}
    />
  );
};

export const LogsExample = () => {
  const [selected, setSelected] = useState('');

  return (
    <DropDownV2
      handleRenderer={() => (
        <Button
          className="w-36 text-base"
          text={selected || 'select log type'}
          tooltip={selected ? `Log type: ${selected || ''}` : ''}
          secondary
          withCaret
          sm
        />
      )}
      options={[
        {
          id: 'system',
          name: 'System',
        },
        {
          id: 'send',
          name: 'Send',
        },
        {
          id: 'receive',
          name: 'Receive',
        },
      ]}
      onSelect={(value: any) => setSelected(value.name)}
      classes={{
        rounded: false,
        shadow: true,
        options:
          'w-36 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow border-0',
        item: '!p-1 !pl-2 text-sm leading-4 text-app-foreground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none',
      }}
    />
  );
};

export const ReqStatusBarExample = () => {
  const [selected, setSelected] = useState('MyQuery');

  return (
    <div className="flex ml-auto mr-1">
      <DropDownV2
        handleRenderer={() => (
          <Button
            text={selected}
            secondary
            withCaret
            xs
            className="leading-6 !rounded-br-none !rounded-tr-none"
          />
        )}
        options={[
          {
            id: 'my_query',
            name: 'MyQuery',
          },
          {
            id: 'my_query_1',
            name: 'MyQuery1',
          },
        ]}
        onSelect={(value: any) => setSelected(value.name)}
        classes={{
          rounded: false,
          shadow: true,
          options:
            'ml-1 w-36 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow border-0',
          item: '!p-1 !pl-2 text-sm leading-4 text-app-foreground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none',
        }}
      />
      <Button
        text=""
        primary
        sm
        icon={<IoSendSharp />}
        iconLeft
        onClick={() => {}}
        className="!rounded-bl-none !rounded-tl-none"
      />
    </div>
  );
};

export const StatusBarExample = () => {
  const [selected, setSelected] = useState('My workspace');
  const [userSelected, setUserSelected] = useState('Guest');

  return (
    <StatusBar className="border-t focus-outer2 mt-[50%]">
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
            handleRenderer={() => (
              <span className="pl-1 cursor-pointer">{userSelected}</span>
            )}
            options={[
              {
                id: 'heading',
                name: 'Guest',
                disabled: true,
                postfix: () => (
                  <>
                    <br />
                    <div
                      className={
                        'text-sm font-light leading-3 text-app-foreground-inactive'
                      }
                    >
                      User
                    </div>
                  </>
                ),
                headerList: [
                  {
                    id: 'sign_in',
                    name: 'Sign in',
                    postfix: () => (
                      <div className={'ml-2 leading-3 text-primaryColor'}>
                        <VscSignIn size={20} />
                      </div>
                    ),
                  },
                  {
                    id: 'create_account',
                    name: 'Create an account',
                    postfix: () => (
                      <div className={'ml-2 leading-3 text-primaryColor'}>
                        <VscAccount size={20} />
                      </div>
                    ),
                  },
                ],
              },
            ]}
            onSelect={(value) => setUserSelected(value.name)}
            classes={{
              rounded: false,
              shadow: true,
              options:
                'ml-1 w-fit !pb-2 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
              header:
                'flex items-center text-app-foreground px-2 !pt-[0.2rem] !pb-2 !px-3 !block !text-base font-medium leading-6 !opacity-100 !bg-focus2 ',
              headerListItem:
                '!py-1 !px-3 text-sm leading-6 text-app-foreground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none justify-between',
            }}
          />
          <VscChevronRight size={14} className="mt-0.5" />

          <DropDownV2
            handleRenderer={() => (
              <span className="pl-1 cursor-pointer">{selected}</span>
            )}
            options={[
              {
                id: 'heading',
                name: 'FC Team',
                disabled: true,
                postfix: () => (
                  <>
                    <br />
                    <div
                      className={
                        'text-sm font-light leading-3 text-app-foreground-inactive'
                      }
                    >
                      Workspace
                    </div>
                  </>
                ),
                headerList: [
                  {
                    id: 'workspace_mgmt',
                    name: 'Workspace Management',
                    postfix: () => (
                      <div className={'ml-2 leading-3'}>
                        <VscAdd size={14} strokeWidth={1.5} />
                      </div>
                    ),
                  },
                  {
                    id: 'invite_member',
                    name: 'Invite Members',
                    postfix: () => (
                      <div className={'ml-2 leading-3'}>
                        <VscAdd size={14} strokeWidth={1.5} />
                      </div>
                    ),
                  },
                  {
                    id: 'switch_workspace',
                    name: 'Switch to Workspace',

                    postfix: () => (
                      <div className={'ml-2 leading-3 text-primaryColor'}>
                        <VscRemote size={14} strokeWidth={1.5} />
                      </div>
                    ),
                  },
                  {
                    id: 'switch_org',
                    name: 'Switch to Org',

                    postfix: () => (
                      <div className={'ml-2 leading-3 text-primaryColor'}>
                        <VscRemote size={14} strokeWidth={1.5} />
                      </div>
                    ),
                  },
                ],
              },
            ]}
            onSelect={(value) => setSelected(value.name)}
            classes={{
              rounded: false,
              shadow: true,
              options:
                'ml-1 w-fit !pb-2 -mt-1 bg-popoverBackground !shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
              header:
                'flex items-center text-app-foreground px-2 !pt-[0.2rem] !pb-2 !px-3 !block !text-base font-medium leading-6 !opacity-100 !bg-focus2 ',
              headerListItem:
                '!py-1 !px-3 text-sm leading-6 text-app-foreground hover:!bg-focus1 focus-visible:!bg-focus1 focus-visible:!shadow-none justify-between',
            }}
          />
        </div>
      </StatusBar.PrimaryRegion>
      <StatusBar.SecondaryRegion>
        <div className="flex items-center">
          <a className="flex items-center pr-2 " href="#">
            <VscTwitter
              size={12}
              className="text-statusBarForeground hover:text-statusBarForegroundActive"
            />
          </a>
          <a className="flex items-center pr-2" href="#">
            <VscGithubInverted
              size={12}
              className="text-statusBarForeground hover:text-statusBarForegroundActive"
            />
          </a>
          <a className="flex items-center pr-2" href="#">
            <VscFile
              size={12}
              className="text-statusBarForeground hover:text-statusBarForegroundActive"
            />
          </a>
        </div>
      </StatusBar.SecondaryRegion>
    </StatusBar>
  );
};
