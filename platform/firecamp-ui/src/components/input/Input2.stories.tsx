import Input2 from './Input2';
import Input from './Input';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default {
  title: 'UI-Kit/Input/v2',
  component: Input2,
};

export const Template = () => (
  <div className="m-4">
    <Input2
      placeholder="Enter Username"
      key={'username'}
      name="username"
      id="username"
      label="Email or Username"
      type="text"
      variant="filled"
    />
    <Input
      placeholder="Enter Username"
      key={'username'}
      name={'username'}
      id={'username'}
      label="Email or Username"
      type="text"
      value="email@example.com"
      registerMeta={{
        required: true,
        maxLength: 50,
        minLength: 1,
        pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+|^[0-9a-zA-Z ]+$/,
      }}
      error={'error message'}
      wrapperClassName="!mb-2"
    />
  </div>
);
