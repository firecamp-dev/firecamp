import { FC, useRef, useState } from 'react';
import { Button, Container, Input, ProgressBar, TabHeader } from '@firecamp/ui';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui/src/tree';
import { TreeDataProvider } from './tree/dataProvider';
import treeRenderer from './tree/itemRenderer';
import { IPromptSaveItem } from './types';
import { itemPathFinder } from '@firecamp/utils/dist/misc';

const _btnLabels: IPromptSaveItem['btnLabels'] = {
  ok: 'Create',
  oking: 'Creating...',
  cancel: 'Cancel',
};

export const PromptSaveItem: FC<IPromptSaveItem> = ({
  label = 'Name',
  placeholder,
  btnLabels,
  value,
  collection,
  onClose,
  validator,
  executor,
  onResolve,
  onError,
}) => {
  const [state, setState] = useState({
    isExecuting: false,
    inputValue: value,
    itemId: '',
    error: '',
  });
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
            setState((s) => ({ ...s, isExecuting: false }));
            onClose();
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
  const l = { ..._btnLabels, ...btnLabels };
  return (
    <>
      <ProgressBar active={state.isExecuting} />
      <>
        <div className="h-[340px] pt-4">
          <div className="mt-4">
            <Input
              label={label}
              placeholder={placeholder}
              name={'promptInput'}
              value={state.inputValue}
              onChange={_onChangeValue}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={state.error}
              data-autofocus
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
      </>
      <div className="!pt-4">
        <TabHeader className="!px-0">
          <TabHeader.Right>
            <Button
              text={l?.cancel || `Cancel`}
              onClick={() => onClose()}
              ghost
              xs
            />
            <Button
              text={state.isExecuting ? l?.oking : l?.ok || 'Create'}
              onClick={_onClickOk}
              disabled={state.isExecuting}
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </div>
    </>
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
    const { path } = itemPathFinder(items, itemId);
    setPath(path);
    onSelect(itemId);
  };

  return (
    <Container className="max-h-48 mb-14 !h-fit">
      <label className="text-app-foreground text-sm mb-1 block">Save at</label>
      <div className="border border-app-border">
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
        <Container.Header className="bg-focus2 !p-1 text-app-foreground-inactive leading-3 whitespace-pre text-ellipsis !overflow-hidden text-sm">
          {`./${path}`}
        </Container.Header>
      </div>
    </Container>
  );
};
