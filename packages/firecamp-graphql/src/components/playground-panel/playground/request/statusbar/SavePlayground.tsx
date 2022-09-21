import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
 
  
  Popover,
  Input,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { IGraphQLStore, useGraphQLStore } from '../../../../../store';

const SavePlayground: FC<ISavePlayground> = ({
  isOpen: propIsOpen = false,
}) => {
  const { context, isRequestSaved, getPlgNameSuggestion, savePlg } =
    useGraphQLStore(
      (s: IGraphQLStore) => ({
        context: s.context,
        isRequestSaved: s.runtime.isRequestSaved,
        getPlgNameSuggestion: s.prepareRuntimeActivePlgName,
        savePlg: s.addItem,
      }),
      shallow
    );

  let [isOpen, toggleOpen] = useState(propIsOpen);
  let [name, setName] = useState('');
  let [nameError, setNameError] = useState('');
  let inputRef = useRef<HTMLInputElement>();
  const { register, handleSubmit, errors } = useForm();

  //focus input on popver open
  useEffect(() => {
    setTimeout(() => {
      if (isOpen == true) {
        if (!isRequestSaved) {
          context.appService.notify.info(
            'Please save the graphql request first.'
          );
          toggleOpen(false);
        } 
        else {

          const plgName = getPlgNameSuggestion();
          // console.log(plgName, 'plgName...');
          if (plgName) {
            setName(plgName);
            inputRef.current?.focus();
          }
          else {
            context.appService.notify.alert(
              'Playground has invalid operations, please check again.'
            );
            toggleOpen(false);
          }
        }
      }
    });
  }, [isOpen]);

  let _submitName = ({ name = '' }) => {
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

    savePlg(name);
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
        id={`save-playground-${123}`}
        className="font-bold cursor-pointer font-base pl-16 pb-0"
      >
        <Button
          text="Save playground"
          secondary
          xs
          ghost={true}
          transparent={true}
          className="!border-0 hover:!bg-focus2"
        />
      </Popover.Handler>
    </Popover>
  );
};
export default SavePlayground;

interface ISavePlayground {
  /**
   * popoover open or not
   */
  isOpen?: boolean;
}
