import cx from 'classnames';
import { Plus, X } from 'lucide-react';
import { FormField, Input } from '@firecamp/ui';
import { _array } from '@firecamp/utils';

const InviteUsersForm = ({ usersList, onChange, error }) => {
  const _handleNameChange = (e, position) => {
    const newState = [...usersList];
    newState[position] = {
      ...newState[position],
      name: e.target.value,
    };
    onChange(newState);
  };

  const _handleEmailChange = (e, position) => {
    const newState = [...usersList];
    newState[position] = {
      ...newState[position],
      email: e.target.value,
    };
    onChange(newState);
  };

  const _handleAction = (addAction, position) => {
    if (addAction) {
      onChange([
        ...usersList,
        {
          name: '',
          email: '',
        },
      ]);
    } else {
      onChange([
        ...usersList.slice(0, position),
        ...usersList.slice(position + 1),
      ]);
    }
  };

  return (
    <div className="mr-2.5">
      {usersList.map((detail, index) => (
        <div
          className="relative flex justify-center gap-4"
          key={`user-detail-${index}`}
        >
          <FormField label="" className="!p-0 grow">
            <Input
              placeholder="alice"
              value={detail.name}
              onChange={(e) => _handleNameChange(e, index)}
            />
          </FormField>
          <FormField label="" className="!p-0 grow">
            <Input
              placeholder="alice@mail.com"
              value={detail.email}
              onChange={(e) => _handleEmailChange(e, index)}
            />
          </FormField>
          <span
            className={cx('p-2 h-fit cursor-pointer rounded', {
              'hover:bg-primaryColor text-primaryColor hover:text-secondaryColor-text':
                index === 0,
            })}
            onClick={() => _handleAction(index === 0, index)}
          >
            {index === 0 ? (
              <Plus size={20} />
            ) : (
              <X size={20} className="text-error" />
            )}
          </span>
          {!_array.isEmpty(error) ? (
            <Error error={error} index={index} />
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default InviteUsersForm;

const Error = ({ error, index }) => {
  let errorObject = error.find((m) => m.index === index);

  if (errorObject?.message.length > 0)
    return (
      <div
        className={cx('text-sm font-light text-error absolute left-0 bottom-0')}
      >
        {errorObject.message}
      </div>
    );
  return <></>;
};
