import { useForm } from 'react-hook-form';
import Button from '../buttons/Button';
import Inputv2 from '../input/Inputv2';

export default {
    title: "UI-Kit/Forms"
};

export function ForgetPasswordForm() {

    const { register, handleSubmit, errors } = useForm();
  
    const onSubmit = (data: { [k: string]: any }) => console.log(`on-form-submit`, data);
    const onErrors = (errors: { [k: string]: any }) => console.log('on-form-error', errors);
  
    return (<form onSubmit={handleSubmit(onSubmit, onErrors)}>
      <Inputv2
        placeholder="Enter E-mail"
        name={'email'}
        label="Email"
        id='user-email'
        ref={
          register({
            required: {
              value: true,
              message: "Email is required"
            },
            maxLength: 50,
            minLength: 5,
            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
          })
        }
        autoFocus={true}
        error={
          (errors?.email) ? errors?.email?.message || 'Invalid email' : ''
        }
      />
      <Inputv2 type="password"
        id='user-password'
        label='Password'
        placeholder='Enter Password'
        name="password"
        ref={register({ required: true, minLength: 6 })}
        error={
          (errors?.password) ?
            (errors.password.type === "required" ? "Password is required." : "Password should be at-least 6 characters.") : ''
        }
      />
      <div className="form-control">
        <Button
          primary={true}
          text={`Submit`}
          fullWidth={true}
          md={true}
          onClick={() => handleSubmit(onSubmit, onErrors)}
        />
      </div>
    </form>);
  }