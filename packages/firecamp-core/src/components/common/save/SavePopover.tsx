import { FC, useCallback, useRef, useState } from 'react';
import {
  Button,
 
  
  Input,
  TextArea,
  Popover,
  Container,
} from '@firecamp/ui-kit';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';

import { useWorkspaceStore } from '../../../store/workspace';
import { CollectionDataProvider } from './collection/CollectionDataProvider';
import treeRenderer from './collection/treeItemRenderer';
import { ITabMeta } from '../../tabs/types/tab';

//TODO: need to discuss this, why these two regex
const ptn = /^(?!-).*^(?!_).*^(?!\.).*^(?!\().*^(?!\)).*([a-zA-Z0-9-_.\W\s]+)/i;
const spch =
  /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\>|\?|\/|\""|\;|\:/g;

const SavePopover: FC<ISavePopover> = ({
  isDisabled = false,
  tabMeta = {},
  meta = {
    formTitle: 'Save Request',
    namePlaceholder: 'Please enter request name',
    descPlaceholder: 'Please enter request descriptor',
  },
  tabId = '',
  onFirstTimeSave = (payload) => {
    console.log(payload);
  },
  onSaveCallback = () => {},
}) => {
  let [state, setState] = useState({
    isOpen: false,
    isDisabled: false,
  });

  let _togglePopover = (value) => {
    if (tabMeta.isSaved) return;
    setState((ps) => ({ ...ps, isOpen: value }));
  };

  /**
   * On clicking on Save button, if it's saved then auto update the request
   * if it's new tab and not saved then Collection modal will open
   * @private
   */
  let _saveButtonHandler = async () => {
    if (state.isDisabled) return;

    try {
      // if (!F.userMeta.isLoggedIn) {
      //   // prevent save request if user is not sign in
      //   // await F.authWall(AUTH_WALL_MESSAGES.PREVENT_ADD_REQUEST);
      //   return;
      // }
      if (tabMeta.isSaved == false) {
        _togglePopover(!state.isOpen); // it's being handled by Dropdown toggle now
      } else {
        onSaveCallback();
      }
    } catch (error) {
      console.error({
        API: 'save request',
        error,
      });
    }
  };

  return (
    <div>
      <Popover
        isOpen={state.isOpen}
        detach={false}
        onToggleOpen={() => {
          _saveButtonHandler();
        }}
        content={
          <SaveForm
            meta={meta}
            onSave={onFirstTimeSave}
            onClose={() => _togglePopover(false)}
          />
        }
      >
        <Popover.Handler id={`save-modal-${tabId}`}>
          <Button
            id={`save-request-${tabId}`}
            secondary
            sm
            text="Save"
            disabled={isDisabled}
          />
        </Popover.Handler>
      </Popover>
    </div>
  );
};

export default SavePopover;

const SaveForm: FC<ISaveForm> = ({
  onSave,
  onClose,
  meta = {
    formTitle: 'Socket Details',
    namePlaceholder: 'socket name',
    descPlaceholder: 'socket description(optional)',
  },
}) => {
  let [state, setState] = useState({
    form: {
      name: '',
      description: '',
      collection_id: '',
      folder_id: '',
    },
    hasError: false,
    errorMessage: '',
  });

  let [selectedPath, setSelectedPath] = useState('');

  // handle Enter and Esc
  let _onKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      _onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  let inputHandler = (e) => {
    e.preventDefault();
    let { name: inputName, value } = e.target;

    setState((ps) => {
      return {
        ...ps,
        form: {
          ...ps.form,
          [inputName]: value,
        },
        hasError: false,
        errorMessage: '',
      };
    });
  };

  const hasValidationError = useCallback(() => {
    let { name } = state.form;
    name = name?.trim();
    let hasError = false;
    let errorMessage = '';

    if (!ptn.test(name) || spch.test(name) || name.length < 1) {
      hasError = true;
      errorMessage = 'The name is not valid';
      return { hasError, errorMessage };
    }
    return { hasError: false };
  }, [state.form]);

  let _onSave = async () => {
    let validator = hasValidationError();

    // console.log(validator, "validator...")
    if (validator.hasError == true) {
      setState((ps) => ({
        ...ps,
        form: { ...ps.form, name: ps.form.name.trim() },
        ...validator,
      }));
      return;
    }
    onSave(state.form);
    onClose();
    return Promise.resolve(true);
  };

  const _onSelectPath = ({ collection_id = '', folder_id = '', path = '' }) => {
    //TOdo: need to implement the path

    setState((ps) => {
      return {
        ...ps,
        form: {
          ...ps.form,
          collection_id,
          folder_id,
        },
      };
    });
    if (path !== selectedPath) setSelectedPath(path);
  };

  return (
    <div className="p-6">
      <form className=" w-80" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col">
          <div className="font-semibold text-base mb-2 text-appForegroundActive">
            {meta.formTitle}
          </div>
          <div className="relative">
            <Input
              label={meta.namePlaceholder}
              autoFocus
              type="text"
              placeholder={meta.namePlaceholder}
              name={'name'}
              className="fc-input border-alt"
              value={state.form.name || ''}
              onChange={inputHandler}
              onKeyDown={_onKeyDown}
            />
          </div>
          <div className="relative">
            <TextArea
              label={meta.descPlaceholder}
              type="textarea"
              placeholder={meta.descPlaceholder}
              name={'description'}
              className="fc-input border-alt"
              value={state.form.description || ''}
              onChange={inputHandler}
              note="description supports markdown"
            />
            {/* <span className="text-xs text-appForeground ">
                description supports markdown
              </span> */}
          </div>

          <PathSelector onSelect={_onSelectPath} />

          <div style={{ fontSize: 13 }} className="text text-danger">
            {state?.errorMessage}
          </div>
        </div>
        <Button
          // TODO: add color="primary-alt"
          primary
          sm
          onClick={_onSave}
          text="Save"
        />
      </form>
    </div>
  );
};

export interface ISavePopover {
  /**
   * Boolean value whether save button is disabled or not
   */
  isDisabled?: boolean;

  /**
   * Request tab meta
   */
  tabMeta: ITabMeta;

  /**
   * Save modal meta
   */
  meta: {
    formTitle: string;
    namePlaceholder: string;
    descPlaceholder: string;
  };

  /**
   * Request tab unique identity
   */
  tabId: string;

  /**
   * If request is not saved yet then onFirstTimeSave will get invoked on Save Popover fulfillment
   */
  onFirstTimeSave: (payload: {
    name: string;
    description?: string;
    /**
     * selected collection id
     */
    collection_id?: string;
    /**
     * selected folder id
     */
    folder_id: string;
  }) => void;

  /**
   * If request is already saved then onSaveCallback will get invoked on SaveButton click
   */
  onSaveCallback: () => void;
}

interface ISaveForm {
  /**
   * Pass save form payload to the parent
   */
  onSave: (payload: {
    name: string;
    description?: string;
    collection_id?: string;
    folder_id?: string;
  }) => void;

  /**
   * Close save popover
   */
  onClose: () => void;

  /**
   * Save modal meta
   */
  meta: {
    formTitle: string;
    namePlaceholder: string;
    descPlaceholder: string;
  };
}

const PathSelector: FC<{ onSelect: (_: any) => void }> = ({ onSelect }) => {
  let {
    explorer: { collections, folders },
  } = useWorkspaceStore.getState();

  const dataProvider = useRef(new CollectionDataProvider(collections, folders));

  const onItemSelect = (itemIds: string[], treeId: string) => {
    if (!itemIds?.length) return;
    const selectedItem = itemIds[0];
    const item = collections.find((i) => i._meta.id == selectedItem);
    if (item) {
      onSelect({ collection_id: item._meta.id });
    } else {
      const item = folders.find((i) => i._meta.id == selectedItem);
      onSelect({
        folder_id: item._meta.id,
        collection_id: item._meta.collection_id,
      });
    }
  };

  return (
    <Container className="pane-body border border-appBorder mb-3">
      <Container.Body className="save-modal-collection visible-scrollbar">
        <UncontrolledTreeEnvironment
          canRename={false}
          canReorderItems={false}
          canDragAndDrop={false}
          canDropOnItemWithChildren={false}
          keyboardBindings={{
            // primaryAction: ['f3'],
            renameItem: ['enter', 'f2'],
            abortRenameItem: ['esc'],
          }}
          // dataProvider={new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }))}
          dataProvider={dataProvider.current}
          onStartRenamingItem={(a) => {
            console.log(a, 'onStartRenamingItem');
          }}
          onSelectItems={onItemSelect}
          getItemTitle={(item) => item.data.name}
          viewState={{}}
          // renderItemTitle={({ title }) => <span>{title}</span>}
          renderItemArrow={treeRenderer.renderItemArrow}
          // renderItemTitle={treeRenderer.renderItemTitle}
          renderItem={treeRenderer.renderItem}
          // renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
          // renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
        >
          <Tree
            treeId="collection-selector-save-request"
            rootItem="root"
            treeLabel="Collections Explorer"
          />
        </UncontrolledTreeEnvironment>
      </Container.Body>
      <Container.Header className="bg-focus2 !p-1 text-appForegroundInActive leading-3">
        Path
      </Container.Header>
    </Container>
  );
};
