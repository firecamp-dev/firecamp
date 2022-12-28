import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import shallow from 'zustand/shallow';
import { Popover, Input } from '@firecamp/ui-kit';
import { IStore, useStore } from '../../../../../store';

const EditPlaygroundName: FC<any> = ({}) => {
  const { isRequestSaved, updatePlg, playground } = useStore(
    (s: IStore) => ({
      context: s.context,
      isRequestSaved: s.runtime.isRequestSaved,
      playground: s.playgrounds[s.runtime.activePlayground],
      savePlg: s.addItem,
      updatePlg: s.updateItem,
    }),
    shallow
  );

  const [isOpen, toggleOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const inputRef = useRef<HTMLInputElement>();
  const { register, handleSubmit, errors } = useForm();

  //focus input on popver open
  useEffect(() => {
    setTimeout(() => {
      if (isOpen == true) {
        inputRef.current?.focus();
        setName(playground.request.name);

        // suggest plg name
        // const plgName = getPlgNameSuggestion();
        // if (plgName) setName(plgName);
      }
    });
  }, [isOpen]);

  const _submitName = ({ name = '' }) => {
    name = name.trim();
    console.log(name, 'name....');
    if (!name) {
      setNameError('Invalid name');
      return;
    }
    if (name?.length <= 3) {
      setNameError('playground name must have min 3 characters');
      return;
    }

    updatePlg(true);
    toggleOpen(false);
    // save playground
    // toggleClose
  };

  return (
    <Popover
      detach={false}
      isOpen={isOpen}
      onToggleOpen={(open) => {
        toggleOpen(open);
        if (!open) {
          setNameError('');
        } else {
          // onOpen(collectionId);
        }
      }}
      content={
        <div className="p-2">
          <form onSubmit={handleSubmit(_submitName)}>
            <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70">
              type playground name
            </div>
            <Input
              value={name}
              autoFocus={true}
              type="text"
              placeholder="name..."
              wrapperClassName="!mb-2"
              style={{ width: '300px' }}
              name="name"
              ref={(ref) => {
                inputRef.current = ref;
                register({
                  required: true,
                  maxLength: 100,
                  // minLength: 1
                })(ref);
              }}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError && nameError.length) {
                  setNameError('');
                }
              }}
            />
            {errors['name'] || nameError ? (
              <div className="text-xs font-light text-error">
                {nameError || ''}
              </div>
            ) : (
              ''
            )}
            <div className="text-xs text-appForeground opacity-50">{`> hit enter to save playground`}</div>
          </form>
        </div>
      }
    >
      <Popover.Handler
        id={`edit-playground-${123}`}
        className="font-bold cursor-pointer font-base pl-16 pb-0"
      >
        <VscEdit size={12} />
      </Popover.Handler>
    </Popover>
  );
};
export default EditPlaygroundName;
