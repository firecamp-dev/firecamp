import { FC, useRef, useState } from 'react';
import {
  Button,
  Container,
  Input,
  Modal,
  ProgressBar,
  TabHeader,
} from '@firecamp/ui';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui/src/tree';
import { TreeDataProvider } from './tree/dataProvider';
import treeRenderer from './tree/itemRenderer';
import { IPromptSaveItem } from './types';

const _texts: IPromptSaveItem['texts'] = {
  btnOk: 'Create',
  btnOking: 'Creating...',
  btnCancel: 'Cancel',
};

export const PromptSaveItem: FC<IPromptSaveItem> = ({
  header,
  label = 'Name',
  placeholder,
  texts,
  value,
  collection,
  onClose,
  validator,
  executor,
  onResolve,
  onError,
}) => {
  const [state, setState] = useState({
    isOpen: true,
    isExecuting: false,
    inputValue: value,
    itemId: '',
    error: '',
  });
  const _close = (e) => {
    setState((s) => ({ ...s, isOpen: false }));
    setTimeout(() => {
      onClose(e);
    }, 500);
  };
  const _onChangeValue = (e) => {
    const { value } = e.target;
    setState((s) => ({ ...s, inputValue: value, error: '' }));
  };
  const _onClickOk = async (e) => {
    e.preventDefault();
    const value = state.inputValue.trim();
    const result = { value, itemId: state.itemId };
    let _validator: { isValid: boolean; message?: string } = { isValid: true };
    if (typeof validator == 'function')
      _validator = validator({ value, itemId: state.itemId });
    // console.log(_validator, '_validator');
    if (_validator.isValid == false) {
      setState((s) => ({ ...s, error: _validator.message }));
      if (typeof onError == 'function') onError(new Error(_validator.message));
    } else {
      if (typeof executor == 'function') {
        setState((s) => ({ ...s, error: '', isExecuting: true }));
        executor(result)
          .then((res) => {
            onResolve(res);
            // finally close the prompt on success
            setState((s) => ({ ...s, isOpen: false, isExecuting: false }));
          })
          .catch((e) => {
            if (typeof onError == 'function') {
              console.error(e);
              onError(e);
            }
            setState((s) => ({
              ...s,
              isExecuting: false,
              error: e?.response?.data?.message || e.message,
            }));
          });
      } else {
        onResolve(result);
        // finally close the prompt on success
        setState((s) => ({ ...s, error: '', isOpen: false }));
      }
    }
  };
  texts = { ..._texts, ...texts };
  return (
    <Modal
      isOpen={state.isOpen}
      onClose={_close}
      width={'400px'}
      className="p-6"
    >
      <ProgressBar active={state.isExecuting} />
      <Modal.Header>
        <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
          {header || `THIS IS A HEADER PLACE`}
        </label>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="mt-4">
            <Input
              autoFocus={true}
              label={label}
              placeholder={placeholder}
              name={'prompInput'}
              value={state.inputValue}
              onChange={_onChangeValue}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={state.error}
            />
          </div>
          <PathSelector
            onSelect={(itemId) => {
              // console.log({ itemId });
              setState((s) => ({ ...s, itemId }));
            }}
            collection={collection}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="!pt-4">
        <TabHeader className="!px-0">
          <TabHeader.Right>
            <Button
              text={texts?.btnCancel || `Cancel`}
              onClick={_close}
              sm
              secondary
              transparent
              ghost
            />
            <Button
              text={
                state.isExecuting ? texts?.btnOking : texts?.btnOk || 'Create'
              }
              onClick={_onClickOk}
              disabled={state.isExecuting}
              primary
              sm
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </Modal>
  );
};

const PathSelector: FC<{
  onSelect: (itemId: string) => void;
  collection: IPromptSaveItem['collection'];
}> = ({ onSelect, collection = { items: [], rootOrders: [] } }) => {
  if (!collection?.items?.length) return <></>;
  const [path, setPath] = useState('');
  const { items, rootOrders } = collection;
  const dataProvider = useRef(new TreeDataProvider(items, rootOrders));
  const onItemSelect = (itemIds: string[], treeId: string) => {
    if (!itemIds?.length) return;
    const itemId = itemIds[0];
    setPath(pathFinder(itemId));
    onSelect(itemId);
  };
  const pathFinder = (itemId: string) => {
    const findPath = (iId: string, path: string = '') => {
      const item = items.find((i) => i.__ref.id == iId);
      if (!item) return path;
      const pId = item.__ref.folderId || item.__ref.collectionId;
      const _path = path ? `${item.name}/${path}` : `${item.name}`;
      if (!pId) {
        return _path;
      } else {
        return findPath(pId, _path);
      }
    };
    return findPath(itemId);
  };

  return (
    <Container className="max-h-48 mb-14 !h-fit">
      <label className="text-appForeground text-sm mb-1 block">Save at</label>
      <div className="border border-appBorder">
        <Container.Body className="save-modal-collection pane-body  visible-scrollbar overflow-visible">
          <UncontrolledTreeEnvironment
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
            getItemTitle={(item) => item.data?.name}
            viewState={{}}
            // renderItemTitle={({ title }) => <span>{title}</span>}
            renderItemArrow={treeRenderer.renderItemArrow}
            // renderItemTitle={treeRenderer.renderItemTitle}
            renderItem={treeRenderer.renderItem}
            // renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
            // renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
          >
            <Tree
              treeId="selector-save-item"
              rootItem="root"
              treeLabel={'Save Item'}
            />
          </UncontrolledTreeEnvironment>
        </Container.Body>
        <Container.Header className="bg-focus2 !p-1 text-appForegroundInActive leading-3 whitespace-pre text-ellipsis !overflow-hidden text-sm">
          {`./${path}`}
        </Container.Header>
      </div>
    </Container>
  );
};
