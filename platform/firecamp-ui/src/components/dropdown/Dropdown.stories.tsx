//@ts-nocheck
import { useState } from 'react';
import Dropdown from './Dropdown';
import Button from '../buttons/Button';

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
        <Button text={selected} primary xs uppercase />
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
          setSelected(item.name || 'oops...')
        }} />
    </Dropdown>
  )
};

export const DropDownDemo = Template.bind({});