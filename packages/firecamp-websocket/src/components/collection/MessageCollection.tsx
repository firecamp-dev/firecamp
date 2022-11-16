import {
  useState,
  useRef,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  Input,
  Container,
  Column,
  TabHeader,
  Button,
  Resizable
} from '@firecamp/ui-kit';
import classnames from 'classnames';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import shallow from 'zustand/shallow';


import { WebsocketContext } from '../WebSocket.context';
import { EMessagePayloadTypes } from '../../constants';

import CollectionDNDfn from '@firecamp/ui-kit/src/components/collection/utils/dnd/Collection';

import { useWebsocketStore } from '../../store';

const MessageCollection = ({ tabData = {} }) => {
  let CollectionAPI = useRef({});
  let { ctx_playgroundMessageFns, ctx_updateCollectionFns } =
    useContext(WebsocketContext);

  let { addNewMessage } = ctx_playgroundMessageFns;

  let {
    updateMessage,
    deleteMessage,
    addDirectory,
    updateDirectory,
    deleteDirectory,
  } = ctx_updateCollectionFns;

  let {
    collection: prop_collection,
    meta,
    playground,
    activePlayground,
    changeMeta,
    setSelectedCollectionMessage,
  } = useWebsocketStore(
    (s) => ({
      collection: s.collection,
      meta: s.request.meta,
      playground: s.playgrounds[s.runtime.activePlayground],
      activePlayground: s.runtime.activePlayground,
      changeMeta: s.changeMeta,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
    }),
    shallow
  );

  let selectedMessageId = useMemo(
    () => playground.selectedCollectionMessage,
    [playground, activePlayground]
  );

  let [collection, setCollection] = useState();
  // prepare(
  //   prop_collection.directories || [],
  //   prop_collection.messages || [],
  //   meta
  // ).collection
  let [activeDir, setActiveDir] = useState({ path: './', _meta: { id: '' } });
  let [selectedMessage, selectMessage] = useState(selectedMessageId);
  let [showCollection, toggleShowCollection] = useState(true);

  useEffect(() => {
    // console.log(`prop_collection.messages `, prop_collection.messages)
    let { collection: newCollection } = prepare();
    // prop_collection.directories || [],
    // prop_collection.messages || [],
    // meta
    setCollection(newCollection);
  }, [prop_collection.directories, prop_collection.messages, meta]);

  useEffect(() => {
    if (!playground?.message?._meta?.id) {
      setActiveDir({ path: './', _meta: { id: '' } });
      selectMessage({});
    }
  }, [playground]);

  useEffect(() => {
    CollectionAPI?.current?._clearSelections();
    CollectionAPI?.current?._setSelection([selectedMessageId]);
  }, [selectedMessageId]);

  let _addDirectory = (dir) => {
    addDirectory(dir);
  };

  let _onNodeFocus = (collectionNode = {}) => {
    if (collectionNode._meta.id === selectedMessageId) {
      return;
    }

    if (!!collectionNode.children) {
      setActiveDir({
        path: collectionNode._meta._relative_path,
        _meta: { id: collectionNode._meta.id },
      });
      selectMessage(null);

      if (collectionNode && !collectionNode._meta.id && !collectionNode.meta) {
        _resetPlayground();
      }
    } else {
      selectMessage(collectionNode);
      _onSelectMsg(
        collectionNode,
        collectionNode._meta._relative_path,
        false,
        true,
        false
      );
    }
  };

  let _onSelectMsg = (
    msg = {},
    path = '',
    setOriginal = false,
    appendExistingPayload = false,
    sendMessage = false
  ) => {
    setSelectedMessage(
      Object.assign({}, msg, { path }),
      false,
      setOriginal,
      appendExistingPayload,
      sendMessage
    );
  };

  let _onSendMessage = (payload = {}, path = '') => {
    // onSendMessage(payload);

    // console.log(`paylaod`, payload)
    if (payload) {
      let playgroundMessage = {};
      if (payload.hasOwnProperty('message')) {
        playgroundMessage = Object.assign({}, playgroundMessage, {
          body: payload.message,
        });
      }

      if (payload.hasOwnProperty('type')) {
        playgroundMessage = Object.assign({}, playgroundMessage, {
          meta: Object.assign({}, playgroundMessage.meta, {
            type: payload.type,
          }),
        });
      }

      if (payload.hasOwnProperty('envelope')) {
        playgroundMessage = Object.assign({}, playgroundMessage, {
          meta: Object.assign({}, playgroundMessage.meta, {
            envelope: payload.envelope,
          }),
        });
      }

      if (
        playgroundMessage.meta &&
        (playgroundMessage.meta.type === EMessagePayloadTypes.arraybufferview ||
          playgroundMessage.meta.type === EMessagePayloadTypes.arraybuffer) &&
        (playgroundMessage.meta.envelope === '' ||
          !playgroundMessage.meta.envelope)
      ) {
        playgroundMessage = Object.assign({}, playgroundMessage, {
          meta: Object.assign({}, playgroundMessage.meta, {
            envelope: 'Int8Array',
          }),
        });
      }

      _onSelectMsg(
        Object.assign({}, playgroundMessage, { _meta: payload._meta }),
        path,
        false,
        true,
        true
      );
    }
  };

  let _onRemoveMessage = (msg = {}) => {
    if (msg._meta.id === selectedMessageId) {
      _resetPlayground();
    }
    deleteMessage(msg._meta.id);
  };

  let _onRemoveDirectory = (dir) => {
    if (!dir._meta.id) {
      return;
    }
    deleteDirectory(dir._meta.id);
    if (activeDir && activeDir._meta.id === dir._meta.id) {
      setActiveDir({ path: './', _meta: { id: '' } }); //TODO: enhance later
    }
  };

  let _resetPlayground = () => {
    addNewMessage();
    setSelectedMessage({ _meta: { id: '' } }, true);
  };

  let _resetPathOnCloseAddDir = () => {
    setActiveDir({ path: './', _meta: { id: '' } });
  };

  let _onRenameCollectionNode = async (node = {}) => {
    if (!node) return;
    // console.log(`node`, node);

    if (node.hasOwnProperty('children')) {
      if (node._meta.id && node.name) {
        let name = node.name.trim();
        updateDirectory(node._meta.id, {
          key: 'name',
          value: name,
        });
      }
    } else {
      if (node._meta.id && node.name) {
        let name = node.name.trim();
        let path = node._meta ? node._meta._relative_path || '' : '';
        await updateMessage(node._meta.id, {
          key: 'name',
          value: name,
        });
        await updateMessage(node._meta.id, {
          key: 'path',
          value: path,
        });
      }
    }
  };

  //@deprecated: Check method arrangeItem again
  let handleCollectionDND = async ({ from, to, intent }, parentNode = '') => {
    let orderType = intent.type === 'DIR' ? 'dir_orders' : 'leaf_orders';

    // console.log(` from`, from)
    // console.log(` to`, to)
    // console.log(` intent `, intent)

    /**
     * getFromNto: Get original source and targets from prop data
     * @param sourceId: <type: string>// source id from which intent if picked
     * @param targetId: <type: string>// target id at which intent is dropped
     * @returns {{source: *, target: *}}
     */
    let getFromNto = (sourceId = '', targetId = '') => {
      // console.log(`meta`, meta)

      let source = prop_collection.directories
        ? prop_collection.directories.find((d) => d._meta.id === sourceId)
        : undefined;
      let target = prop_collection.directories
        ? prop_collection.directories.find((d) => d._meta.id === targetId)
        : undefined;

      if (parentNode === 'DIR' && from._meta.id !== to._meta.id) {
        let ordersLength =
          target.meta && target.meta[orderType]
            ? target.meta[orderType].length
            : 0;

        // console.log(`yeah!! ordersLength `, ordersLength)

        to.index = ordersLength;
      }

      return { source, target };
    };

    let fromNTo = getFromNto(from._meta.id, to._meta.id);

    // console.log(`fromNTo`, fromNTo);

    if (fromNTo) {
      let DNDResult = await CollectionDNDfn.arrangeItems(
        {
          from: {
            id: from._meta.id,
            orders:
              from.isRoot && !fromNTo.source
                ? {
                    dir_orders: meta.dir_orders,
                    leaf_orders: meta.leaf_orders,
                  }
                : fromNTo.source
                ? fromNTo.source.meta
                : {},
            index: from.index,
          },
          to: {
            id: to._meta.id,
            orders:
              to.isRoot && !fromNTo.target
                ? {
                    dir_orders: meta.dir_orders,
                    leaf_orders: meta.leaf_orders,
                  }
                : fromNTo.target
                ? fromNTo.target.meta
                : {},
            index: to.index,
          },
          intent,
        },
        { sortInline: true }
      );

      // console.log(`DNDResult`, DNDResult)

      if (DNDResult) {
        let sourceOrders =
          DNDResult.from && DNDResult.from.orders
            ? DNDResult.from.orders[orderType] || []
            : [];
        let targetOrders =
          DNDResult.to && DNDResult.to.orders
            ? DNDResult.to.orders[orderType] || []
            : [];

        if (from.isRoot === true && to.isRoot === true) {
          changeMeta({ key: orderType, value: sourceOrders });
        } else if (
          from._meta.id === to._meta.id &&
          from.isRoot !== true &&
          to.isRoot !== true
        ) {
          updateDirectory(from._meta.id, {
            key: 'meta',
            value: { ...from.meta, [orderType]: sourceOrders },
          });
        } else if (from.isRoot === true && to.isRoot !== true && to._meta.id) {
          changeMeta({ key: orderType, value: sourceOrders });
          updateDirectory(to._meta.id, {
            key: 'meta',
            value: { ...to.meta, [orderType]: targetOrders },
          });
        } else if (
          from.isRoot !== true &&
          to.isRoot === true &&
          from._meta.id
        ) {
          updateDirectory(from._meta.id, {
            key: 'meta',
            value: { ...from.meta, [orderType]: sourceOrders },
          });
          changeMeta({ key: orderType, value: targetOrders });
        } else {
          updateDirectory(from._meta.id, {
            key: 'meta',
            value: { ...from.meta, [orderType]: sourceOrders },
          });
          updateDirectory(to._meta.id, {
            key: 'meta',
            value: { ...to.meta, [orderType]: targetOrders },
          });
        }

        /**
         * Update parent_id in dragged node (intent)
         */
        if (intent.parent_id !== to._meta.id) {
          if (intent.type === 'DIR') {
            updateDirectory(intent._meta.id, {
              key: 'parent_id',
              value: to._meta.id,
            });
          } else {
            updateMessage(intent._meta.id, {
              key: 'parent_id',
              value: to._meta.id,
            });
          }
        }
      }
    }
  };

  // console.log(`collection`, collection)

  return (
    <Resizable
      width="200px"
      minWidth={100}
      maxWidth={400}
      height="100%"
      flex="none"
      right={true}
      className={classnames({ 'fc-collapsed': !showCollection })}
    >
      <Column>
        <Container className="with-divider">
          <Container.Header>
            <MessageCollectionHeader
              isCollectionEmpty={(collection || []).length == 0}
              path={activeDir.path}
              parentId={activeDir._meta.id}
              id={`add-collection-${tabData.id}`}
              onAddDirectory={_addDirectory}
              resetPathOnCloseAddDir={_resetPathOnCloseAddDir}
            />
          </Container.Header>
          <Container.Body>
   
          </Container.Body>
        </Container>
      </Column>
      <div
        className="fc-btn-collapse"
        onClick={() => {
          toggleShowCollection(!showCollection);
        }}
      >
        <span className="icon-caret"></span>
      </div>
    </Resizable>
  );
};

export default MessageCollection;

const MessageCollectionHeader = ({
  isCollectionEmpty = true,
  path = '',
  parentId = '',
  onAddDirectory = () => {},
  resetPathOnCloseAddDir = () => {},
  id = '',
}) => {
  const [directoryName, setDirectoryName] = useState('');
  const [showAddDirCmp, toggleAddDirCmp] = useState(false);
  const [focusedNode, setFocusedNode] = useState({ _relative_path: './' });

  /*useEffect(() => {
   toggleAddDirCmp(!!isCollectionEmpty);
   }, [isCollectionEmpty]);*/

   const _handleChangeName = (e) => {
    e.preventDefault();
    let { value } = e.target;
    setDirectoryName(value);
  };

  const _onAdd = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!directoryName.length) return;

    onAddDirectory({ name: directoryName, parent_id: parentId });
    // toggle_popover(!showAddDirCmp);
    setDirectoryName('');
  };

  const _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      _onAdd(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      _toggleAddDirCmp(false);
    }
  };

  const _toggleAddDirCmp = (value = false) => {
    toggleAddDirCmp(value);
    if (value === false) {
      setFocusedNode({ _relative_path: './' });
      resetPathOnCloseAddDir();
    }
  };

  return (
    <div key={id}>
      <TabHeader className="height-small border-b border-appBorder">
        <div className="message-collection-header-title">Collection</div>
        <TabHeader.Right>
          <Button
            icon={<VscNewFolder className="toggle-arrow" size={12} />}
            id={`add_directory_icon-${id}`}
            onClick={() => _toggleAddDirCmp(!showAddDirCmp)}
            tooltip={'add directory'}
            secondary
            sm
            transparent
            ghost
            iconLeft
          />
        </TabHeader.Right>
      </TabHeader>
      {showAddDirCmp === true ? (
        <div className="fc-inline-popup">
          <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70">
            Add Directory<span>({path})</span>
          </div>
          <Input
            className="flex"
            autoFocus={true}
            type="text"
            name="status"
            id="status"
            placeholder="Directory name"
            value={directoryName}
            onChange={_handleChangeName}
            onKeyDown={_onKeyDown}
            postComponents={[
              <Button
                key={'directory-add-button'}
                text="Add"
                onClick={_onAdd}
                secondary
                sm
              />,
            ]}
          />
          <div className="text-xs text-appForeground ">{`> hit enter to add directory`}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
