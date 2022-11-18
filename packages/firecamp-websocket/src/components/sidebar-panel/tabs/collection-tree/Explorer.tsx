import { FC, useState, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';

import {
  Tree,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from '@firecamp/ui-kit/src/tree';

import { Container, ProgressBar } from '@firecamp/ui-kit';

import treeRenderer from './treeItemRenderer';
// import { CollectionTreeDataProvider } from './CollectionDataProvider';
// import { useWorkspaceStore } from '@firecamp/core/src/lib/store/workspace';

const Explorer: FC<any> = () => {
  const environmentRef = useRef();
  const treeRef = useRef();

  // let { openSavedTab } = useTabStore((s)=> ({ openSavedTab: s.open.saved}));

  // let {
  //   workspace,
  //   treeItems,
  //   fetchExplorer,
  // } = useWorkspaceStore((s)=> ({
  //   workspace: s.workspace,
  //   treeItems: [
  //     ...(s.explorer?.collections || []),
  //     ...(s.explorer.folders || []),
  //     ...(s.explorer.requests || [])
  //   ],
  //   fetchExplorer: s.fetchExplorer,
  // }), shallow);

  // useEffect(()=> {
  //   console.log(workspace, "workspace in collection")
  //   // fetchExplorer()
  // }, []);

  let [searchString] = useState('');

  const _openReqInTab = (request: any) => {
    console.log(`node`, request);
    // openSavedTab(request);
  };

  const _dndFns = {
    /**
     * prepareData: Prepate data for intent, from, and to with respect to Firecamp.
     */
    prepareData: {
      /**
       * intent: intent object to be prepared
       * @param {*} intent : <type: Object> //intent object
       */
      intent: (intent: IDirectoryItem & IRequestItem, updatedInfo = {}) => {
        let intentData = {
          id: intent._meta.id,
          type: intent.meta ? intent.meta.type : '',
          collection_id: intent.meta ? intent.meta.collection_id || '' : '',
          ...updatedInfo,
        };

        if (intent.meta && intent.meta.type === 'R') {
          intentData['request_type'] = intent.meta.request_type;
          intentData['folder_id'] = intent.meta.folder_id || '';
        }
        if (intent.meta && intent.meta.type === 'M') {
          intentData['parent_id'] = intent.meta.parent_id || '';
        }

        return intentData;
      },

      /**
       * from: from object to be prepared
       * @param {*} from : <type: Object> //from object
       */
      from: (
        from: IDirectoryItem | IRequestItem,
        updatedInfo = {},
        intentType = ''
      ) => {
        let fromData = {
          id: from._meta.id,
          orders: intentType
            ? intentType === 'M'
              ? { m_orders: from.meta['dir_orders'] }
              : { r_orders: from.meta['leaf_orders'] }
            : from.meta,
          type: from.meta ? from.meta.type || '' : '',
          ...updatedInfo,
        };

        if (from?.meta?.type === 'M') {
          fromData['collection_id'] = from.meta.collection_id || '';
        }

        return fromData;
      },

      /**
       * to: to object to be prepared
       * @param {*} to : <type: Object> //to object
       */
      to: (
        to: IDirectoryItem & IRequestItem,
        updatedInfo = {},
        intentType = ''
      ) => {
        let toData = {
          id: to._meta.id,
          orders: intentType
            ? intentType === 'M'
              ? { m_orders: to.meta['dir_orders'] }
              : { r_orders: to.meta['leaf_orders'] }
            : to.meta,
          type: to.meta ? to.meta.type || '' : '',
          ...updatedInfo,
        };
        if (to?.meta?.type === 'M') {
          toData['collection_id'] = to.meta.collection_id || '';
        }

        return toData;
      },
    },

    /**
     * DND
     * @param {*} data: <type: Object>// {intent, from, to}// resultant data, will contain updated orders.
     */
    dnd: async (data: {
      from: IDirectoryItem & IRequestItem;
      to: IDirectoryItem & IRequestItem;
      intent: IDirectoryItem & IRequestItem;
    }) => {
      let updatedInfo = {
        updated_by: '', //F.userMeta.id,
        updated_at: new Date().valueOf(),
      };

      const { from, to, intent } = data;
      // console.log(`data`, data);

      if (!from?._meta?.id || !to?._meta?.id) return;

      let dataForFrom = _dndFns.prepareData.from(
        from,
        updatedInfo,
        intent?.meta?.type
      );
      let dataForTo = _dndFns.prepareData.to(
        to,
        updatedInfo,
        intent?.meta?.type
      );
      let dataForIntent = _dndFns.prepareData.intent(intent, updatedInfo);

      if (dataForTo.type === 'P') {
        // Add collection_id and remove folder_id if node is being placed to project.
        dataForIntent['collection_id'] = dataForTo.id || '';
        if (intent?.meta?.type === 'M') {
          dataForIntent['parent_id'] = '';
        } else {
          dataForIntent['folder_id'] = '';
        }
      } else if (dataForTo.type === 'M') {
        // Add collection_id from target (to) node
        if (to.meta && to.meta.collection_id) {
          dataForIntent['collection_id'] = to.meta.collection_id || '';
        }
        // Add folder_id from module id.
        if (intent?.meta?.type === 'M') {
          dataForIntent['parent_id'] = dataForTo.id || '';
        } else {
          dataForIntent['folder_id'] = dataForTo.id || '';
        }
      }

      if (from._meta.id === to._meta.id) {
        //If from and to both are same that time it will be sorting case.
        // console.log(`in if dataForFrom`, dataForFrom);
        // await F.appStore.project.sortItems(dataForFrom);
      } else {
        // console.log(`dataForFrom`, dataForFrom);
        // console.log(`dataForTo`, dataForTo);
        // console.log(`dataForIntent`, dataForIntent);
        // await F.appStore.project.dndItem({
        //   from: dataForFrom,
        //   to: dataForTo,
        //   intent: dataForIntent
        // });
      }
    },

    /** 
       * To Sort project, module, or request
       * @param {*} parent_id: <type: String> // parent id of sorted element. 
       *                                      //In case of root sorting, parent_id will be "root"
       * @param {*} result: <type: Object> // resultant object of parent node which contains sorted element orders.
                                           //In case of root sorting, result will be sorted orders. {"dir_orders":[]}
       * @param {*} isRootDir 
       */
    sort: async (parent_id = '', result, isRootDir = false) => {
      let updatedInfo = {
        // updated_by: F.userMeta.id,
        updated_at: new Date().valueOf(),
      };
      if (isRootDir) {
        //If isRootDir true, then root projects are being sorted.
        let orders = result?.orders ? result.orders['dir_orders'] || [] : [];
        // console.log(`orders`, orders);
        // await F.appStore.project.sortItems({
        //   id: F.appStore.Preferences.active_workspace, //active workspace id as parent id.
        //   orders: { "p_orders": orders }, //updated project orders in key `p_orders`.
        //   type: "WRS", //parent type will be `W` (Workspace).
        //   ...updatedInfo
        // });
      } else {
        if (!result?._meta?.id) return;
        let dataForFrom = _dndFns.prepareData.from(
          result,
          updatedInfo,
          result?.meta?.type
        );
        // console.log(`dataForFrom`, dataForFrom);
        // await F.appStore.project.sortItems(dataForFrom);
      }
    },
  };

  let _onNodeSelect = (nodeIdxs: TreeItemIndex[]) => {
    let nodeIndex = nodeIdxs[0];

    // let colItem = treeItems.find(c=> c._meta.id == nodeIndex);
    // if (colItem && ["A", "G", "W", "S"].includes(colItem.meta.type)) {
    //   _openReqInTab(colItem);
    // }
  };

  return <span />;
  // if(!treeItems?.length) return <span/>

  return (
    <div className="w-full h-full flex flex-row">
      <ProgressBar active={true} />
      <Container>
        <UncontrolledTreeEnvironment
          canRename={true}
          canReorderItems={true}
          canDragAndDrop={true}
          canDropOnItemWithChildren={true}
          ref={environmentRef}
          keyboardBindings={{
            // primaryAction: ['f3'],
            renameItem: ['enter', 'f2'],
            abortRenameItem: ['esc'],
          }}
          // dataProvider={new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }))}
          dataProvider={new CollectionTreeDataProvider([])}
          onStartRenamingItem={(a) => {
            console.log(a, 'onStartRenamingItem');
          }}
          onSelectItems={_onNodeSelect}
          getItemTitle={(item) => item.data.name}
          viewState={{}}
          // renderItemTitle={({ title }) => <span>{title}</span>}
          renderItemArrow={treeRenderer.renderItemArrow}
          // renderItemTitle={treeRenderer.renderItemTitle}
          renderItem={(props) => treeRenderer.renderItem({ ...props, treeRef })}
          // renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
          // renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
        >
          <Tree
            treeId="tree-1"
            rootItem="root"
            treeLabel="Tree Example"
            ref={treeRef}
          />
        </UncontrolledTreeEnvironment>
      </Container>
    </div>
  );
};

export default Explorer;
