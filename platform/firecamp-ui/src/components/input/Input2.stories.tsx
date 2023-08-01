import { useForm } from 'react-hook-form';
import { Button } from '@firecamp/ui';

import Input2 from './Input2';
import Input from './Input';

export default {
  title: 'UI-Kit/Input/v2',
  component: Input2,
};

export const Template = () => {
  const form = useForm({ mode: 'onBlur'});
  const { register, errors, handleSubmit } = form;
  const onSubmit = (values: any) => {
    console.log(`form-submitted`, values);
  };

  return (
    <div className="m-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input2
          placeholder="Enter email"
          key={'email'}
          name="email"
          id="email"
          label="Email or Username"
          type="text"
          variant="filled"
          ref={register({
            required: 'Email is required',
            maxLength: {
              value: 50,
              message: 'max-length',
            },
            minLength: {
              value: 1,
              message: 'min-length',
            },
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
              message: 'Invalid email',
            },
          })}
          error={errors.email?.message}
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
            required: 'Username is required',
            maxLength: {
              value: 50,
              message: 'max-length-50',
            },
            minLength: {
              value: 1,
              message: 'min-length-1',
            },
            pattern: {
              value:
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+|^[0-9a-zA-Z ]+$/,
              message: 'Username is invalid',
            },
          }}
          useformRef={form}
          error={errors.username?.message}
        />
        <Button type="submit" text="Submit Form" />
      </form>
    </div>
  );
};
