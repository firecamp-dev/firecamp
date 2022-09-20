import { FC, useState } from 'react';

import {
  Container,
  Button,
  EButtonColor,
  EButtonSize,
  Input,
} from '@firecamp/ui-kit';
import '../../UserSetting.sass';
import validator from 'validator';

const changePwdFields = [
  {
    id: 'currentPassword',
    label: 'Current Password*',
  },
  {
    id: 'newPassword',
    label: 'New Password*',
  },
  {
    id: 'confirmPassword',
    label: 'Confirm Password*',
  },
];

const userProfileFields = [
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'username',
    label: 'Username*',
  },
  {
    id: 'email',
    label: 'Email*',
  },
];

const initialState = {
  currentPassword: {
    value: '',
    hasChange: false,
    hasError: false,
    message: '',
  },
  newPassword: {
    value: '',
    hasChange: false,
    hasError: false,
    message: '',
  },
  confirmPassword: {
    value: '',
    hasChange: false,
    hasError: false,
    message: '',
  },
  button: {
    text: 'Change Password',
    isDisabled: false,
    isSubmitted: false,
  },
  errorMessage: '',
};

const MyAccount: FC<any> = ({ user = {}, onClose = () => {} }) => {
  let initialState = {
    name: {
      value: user.name || '',
      hasChange: false,
      hasError: false,
      message: '',
    },
    username: {
      value: user.username || '',
      hasChange: false,
      hasError: false,
      message: '',
    },
    email: {
      value: user.email || '',
      hasChange: false,
      hasError: false,
      message: '',
    },
    button: {
      text: 'Update profile',
      isDisabled: false,
      isSubmitted: false,
    },
  };

  let [state, setState] = useState(initialState);

  // console.log(`initialState`, initialState)
  let { name, username, email, button } = state;

  let _handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === 'username') {
      value = value.trim();
    }

    let validation = _validate(name, value);
    setState({
      ...state,
      [name]: Object.assign({}, state[name], validation, { value }),
      button: {
        text: 'Update profile',
        isDisabled: false,
        isSubmitted: false,
      },
    });
  };
  let _onKeyDown = (e) => {
    // Prevent adding sapce in username
    if (
      (e?.target?.name === 'username' && e.keyCode === 32) ||
      e?.target?.name === 'email'
    ) {
      e.preventDefault();
    }
  };

  let _validate = (name, value) => {
    switch (name) {
      case 'name':
        let nameMessage = '';

        if (!validator.isLength(value, { min: 4 })) {
          nameMessage =
            'Name is required in proper manner and It would be minimum 4 character long';
        }
        return {
          hasChange: true,
          hasError: !!nameMessage,
          message: nameMessage,
        };
        break;

      case 'username':
        let alphaNumeric = /^[0-9a-zA-Z ]+$/;
        let usernameMessage = '';

        if (!validator.isLength(value, { min: 4 })) {
          usernameMessage =
            'Username is required in proper manner and It would be minimum 4 character long';
        }
        if (!alphaNumeric.test(value)) {
          usernameMessage = 'Only alphanumeric characters are allowed.';
        }
        if (!value.length) {
          usernameMessage = 'Username can not be empty.';
        }
        return {
          hasChange: true,
          hasError: !!usernameMessage,
          message: usernameMessage,
        };
        break;
      case 'email':
        let emailRE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
        let emailMessage = '';
        if (!emailRE.test(value)) emailMessage = 'Enter Valid Email';
        if (!value.length) {
          emailMessage = 'Email can not be empty.';
        }
        return {
          hasChange: true,
          hasError: !!emailMessage,
          message: emailMessage,
        };
        break;
    }
  };

  let _onClickUpdateProfile = async (e) => {
    e.preventDefault();
    let { name, username, email } = state;

    setState({
      ...state,
      button: {
        text: 'Updating profile...',
        isDisabled: true,
        isSubmitted: true,
      },
    });
    let updatedPayload = {},
      error_state = {};
    userProfileFields.map((item) => {
      let inputValue = state?.[item.id]?.value?.trim() || '';
      if (item.id === 'username') {
        inputValue = inputValue.replaceAll(' ', '');
      }

      if (
        item.id &&
        user &&
        state[item.id] &&
        inputValue !== user?.[item.id]?.trim()
      ) {
        if (!inputValue) {
          error_state = Object.assign({}, error_state, {
            [item.id]: {
              ...state[item.id],
              hasChange: true,
              hasError: true,
              message: `${(item.label || '').replace(
                '*',
                ''
              )} can not be empty`,
            },
          });
        } else {
          updatedPayload = Object.assign({}, updatedPayload, {
            [item.id]: inputValue,
          });
        }
      }
    });

    if (Object.keys(error_state).length) {
      setState({
        ...state,
        ...error_state,
        button: {
          text: 'Update profile',
          isDisabled: true,
          isSubmitted: true,
        },
      });
      return;
    }

    if (Object.keys(updatedPayload).length) {
      console.log({ updatedPayload });

      //TODO: Call API
    } else {
      setState({
        ...state,
        button: {
          text: 'Update profile',
          isDisabled: true,
          isSubmitted: true,
        },
      });
    }
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="with-divider padding-wrapper">
          <Container.Body className="p-4">
            <label className="text-sm font-semibold leading-3 text-appForegroundInActive uppercase w-full relative mb-4">
              PERSONAL INFO
            </label>
            {userProfileFields && userProfileFields.length
              ? userProfileFields.map((item, i) => {
                  if (!item.id || !state[item.id]) {
                    return <span />;
                  } else {
                    return (
                      <Input
                        key={i}
                        autoFocus={i === 0}
                        label={item.label || ''}
                        type="text"
                        placeholder={item.label || ''}
                        className="fc-input border-alt small"
                        name={item.id || ''}
                        value={state[item.id].value || ''}
                        /* style={{
                          borderColor:
                            state[item.id].hasChange && state[item.id].hasError
                              ? 'red'
                              : state[item.id].hasChange && 'green'
                        }} */
                        onKeyDown={_onKeyDown}
                        onChange={_handleInputChange}
                        disabled={item.id === 'email'}
                        error={
                          (button.isSubmitted === true &&
                            state?.[item.id]?.message) ||
                          ''
                        }
                        note={
                          item.id === 'email'
                            ? 'You can not update an email'
                            : ''
                        }
                      />
                    );
                  }
                })
              : ''}
            <Button
              color={EButtonColor.Secondary}
              // TODO: className="font-sm"
              text={button.text || ''}
              onClick={_onClickUpdateProfile}
              disabled={
                button.isDisabled ||
                (user.name === name.value &&
                  user.username === username.value &&
                  user.email === email.value)
              }
              size={EButtonSize.Small}
              transparent={true}
            />
            {user?.provider === 'local'
              ? [
                  <hr className="mb-3 mt-6" key={`update-password-hr`} />,
                  <UpdatePassword
                    key={`update-account-password`}
                    onClose={onClose}
                  />,
                ]
              : ''}
          </Container.Body>
        </Container>
      </Container.Body>
    </Container>
  );
};

export default MyAccount;

const UpdatePassword: FC<any> = ({ onClose = () => {} }) => {
  let [state, setState] = useState(initialState);

  let { currentPassword, newPassword, confirmPassword, button, errorMessage } =
    state;

  let _handleInputChange = (e) => {
    let { name, value } = e.target;

    value = value.trim(); //Space not allowed

    let validation = _validate(value);
    setState({
      ...state,
      [name]: Object.assign({}, state[name], validation, { value }),
      button: {
        text: 'Change Password',
        isDisabled: false,
        isSubmitted: false,
      },
      errorMessage: '',
    });
  };

  let _validate = (value) => {
    let passwordMessage = '';
    if (!validator.isLength(value, { min: 8 })) {
      passwordMessage =
        'Password is required and It would be minimum 8 character long';
    }
    if (!value.length) {
      passwordMessage = 'Password can not be empty.';
    }
    return {
      hasChange: true,
      hasError: !!passwordMessage,
      message: passwordMessage,
    };
  };

  let _onClickChangePassword = async (e) => {
    e.preventDefault();
  };

  let _onChangePassword = async (payload) => {
    // return await F.appStore.user.changePassword(payload);
  };

  return [
    <label
      key={`password-label`}
      className="text-sm font-semibold leading-3 text-appForegroundInActive uppercase w-full relative mb-4"
    >
      Change Password
    </label>,
    changePwdFields && changePwdFields.length
      ? changePwdFields.map((item, i) => {
          if (!item.id || !state[item.id]) {
            return <span />;
          } else {
            return (
              <Input
                key={i}
                label={item.label || ''}
                type="password"
                name={item.id || ''}
                className="fc-input border-alt small"
                value={state[item.id].value || ''}
                /*   style={{
                  borderColor:
                    state[item.id].hasChange && state[item.id].hasError
                      ? 'red'
                      : state[item.id].hasChange && 'green'
                }} */
                onChange={_handleInputChange}
                error={
                  (button.isSubmitted === true && state?.[item.id]?.message) ||
                  ''
                }
              />
            );
          }
        })
      : '',
    errorMessage && errorMessage.length ? (
      <div className="fc-error align-center">{errorMessage}</div>
    ) : (
      ''
    ),
    <Button
      key={`password-save-button`}
      text={button.text || ''}
      color={EButtonColor.Secondary}
      size={EButtonSize.Small}
      transparent={true}
      onClick={_onClickChangePassword}
      disabled={button.isDisabled}
    />,
  ];
};
