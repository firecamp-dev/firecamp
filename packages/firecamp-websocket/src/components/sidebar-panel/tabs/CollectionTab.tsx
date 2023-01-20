import { useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import { Pane, ToolBar, Empty } from '@firecamp/ui-kit';
import { TId } from '@firecamp/types';
import treeRenderer from './collection-tree/treeItemRenderer';
import { useStore, useStoreApi, IStore } from '../../../store';

const CollectionTab = () => {
  const { context, isRequestSaved, createFolder } = useStore(
    (s: IStore) => ({
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      createFolder: s.createFolder,
    }),
    shallow
  );

  const _createFolderPrompt = async (parentFolderId?: TId) => {
    if (typeof parentFolderId != 'string') parentFolderId = undefined;
    if (!isRequestSaved) {
      return context.app.notify.info(
        'Please save the websocket request first.'
      );
    }
    context.window
      .promptInput({
        header: 'Create A New Folder',
        lable: 'Folder Name',
        placeholder: '',
        texts: { btnOking: 'Creating...' },
        value: '',
        // validator: (val) => {
        //   if (!val || val.length < 3) {
        //     return {
        //       isValid: false,
        //       message: 'The folder name must have minimum 3 characters.',
        //     };
        //   }
        //   const isValid = RE.NoSpecialCharacters.test(val);
        //   return {
        //     isValid,
        //     message:
        //       !isValid &&
        //       'The folder name must not contain any special characters.',
        //   };
        // },
        executor: (name) => createFolder(name, parentFolderId),
        onError: (e) => {
          context.app.notify.alert(e?.response?.data?.message || e.message);
        },
      })
      .then((res) => {
        // console.log(res, 1111);
      });
  };

  return (
    <Pane
      expanded={true}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span>Message Collection</span>;
      }}
      headerActionRenderer={() => {
        return (
          <ToolBar>
            <div className="action">
              <VscRefresh size={14} className="cursor-pointer" />
            </div>
            <div>
              <VscNewFolder
                size={14}
                className="cursor-pointer"
                onClick={() => _createFolderPrompt()}
              />
            </div>
          </ToolBar>
        );
      }}
      bodyRenderer={({ expanded }) => {
        return <Collection openCreateFolderPrompt={_createFolderPrompt} />;
      }}
    />
  );
};

export default CollectionTab;

const Collection = ({ openCreateFolderPrompt }) => {
  const treeRef = useRef();
  const { context, tdpInstance } = useStore(
    (s: IStore) => ({
      context: s.context,
      tdpInstance: s.collection.tdpInstance,
      __manualUpdates: s.collection.__manualUpdates,
    }),
    shallow
  );
  const {
    // openPlayground,
    registerTDP,
    unRegisterTDP,
    deleteItem,
  } = useStoreApi().getState() as IStore;

  useEffect(() => {
    registerTDP();
    return unRegisterTDP;
  }, []);

  const openPlg = (plgId) => {
    // get a fresh copy of state
    // const item = items.find((i) => i.__ref.id == plgId);
    // console.log(item, 1100099);
    // openPlayground(plgId);
  };
  const deletePlg = (plgId: string) => {
    context.window
      .confirm({
        title: 'Are you sure to delete the playground?',
        texts: {
          btnConfirm: 'Yes, delete it.',
        },
      })
      .then((isConfirmed) => {
        if (isConfirmed) deleteItem(plgId);
      });
  };

  if (!tdpInstance) return <></>;
  console.log(tdpInstance, tdpInstance.isEmpty(), 5655555);
  if (tdpInstance.isEmpty()) {
    return (
      <div className="items-center">
        <Empty
          // icon={<VscFolder size="40" />}
          title="No saved messages"
          message="This WebSocket request does not have any saved messages.."
        />
      </div>
    );
  }

  return (
    <UncontrolledTreeEnvironment
      canRename={true}
      canReorderItems={true}
      canDragAndDrop={true}
      canDropOnFolder={true}
      keyboardBindings={{
        renameItem: ['enter', 'f2'],
        abortRenameItem: ['esc'],
      }}
      dataProvider={tdpInstance}
      onStartRenamingItem={(a) => {
        console.log(a, 'onStartRenamingItem');
      }}
      // onSelectItems={onSelectItems}
      getItemTitle={(item) => item.data?.name}
      viewState={{}}
      renderItemArrow={treeRenderer.renderItemArrow}
      renderItem={(props) =>
        treeRenderer.renderItem({
          ...props,
          openPlg,
          deletePlg,
          createFolder: openCreateFolderPrompt,
        })
      }
    >
      <Tree
        treeId="fc-environment-tree"
        rootItem="root"
        treeLabel="WebSocket Message Collection"
        ref={treeRef}
      />
    </UncontrolledTreeEnvironment>
  );
};
