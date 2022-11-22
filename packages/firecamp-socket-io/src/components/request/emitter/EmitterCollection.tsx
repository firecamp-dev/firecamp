import { useState, useRef, useContext, useEffect, useMemo } from 'react';
import {
  // Collection,
  Input,
  Container,
  TabHeader,
  Button,
  Column,
  Resizable,
} from '@firecamp/ui-kit';
import classnames from 'classnames';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import shallow from 'zustand/shallow';

// import DirectoryNode from './DirectoryNode';
// import EmitterNode from './EmitterNode';

import { SocketContext } from '../../Socket.context';
import { ISocketStore, useSocketStore } from '../../../store';

const EmitterCollection = ({
  tabData = {},
  _dnp = {},
  setSelectedEmitter = () => {},
  isPlaygroundEmpty = true,
}) => {
  let CollectionAPI = useRef({});
  let { ctx_updateCollectionFns } = useContext(SocketContext);

  let { emitters: emitters_fns, directories: directories_fns } =
    ctx_updateCollectionFns;
  let onSendMessage = () => {};
  let { addNewEmitter } = ctx_playgroundEmitterFns;

  let {
    collection: prop_collection,
    // meta,
    playground,
    activePlayground,
    // changeMeta,
    // setSelectedCollectionEmitter,
  } = useSocketStore(
    (s: ISocketStore) => ({
      collection: s.collection,
      // meta: s.request.meta,
      playground: s.playgrounds[s.runtime.activePlayground],
      activePlayground: s.runtime.activePlayground,
      changeMeta: s.changeMeta,
      setSelectedCollectionEmitter: s.setSelectedCollectionEmitter,
    }),
    shallow
  );

  let selectedemitterId = useMemo(
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
  let [selectedEmitter, selectEmitter] = useState();
  let [is_popover_open, toggle_popover] = useState(false);
  let [showCollection, toggleShowCollection] = useState(true);

  useEffect(() => {
    // let { collection } = prepare(
    //   prop_collection.directories || [],
    //   prop_collection.emitters || [],
    //   meta
    // );
    // setCollection(collection);
  }, [prop_collection.directories, prop_collection.emitters]);

  useEffect(() => {
    if (isPlaygroundEmpty === true) {
      setActiveDir({ path: './', _meta: { id: '' } });
      selectEmitter({});
    }
  }, [isPlaygroundEmpty]);

  useEffect(() => {
    CollectionAPI?.current?._clearSelections();
    CollectionAPI?.current?._setSelection([selectedemitterId]);
  }, [selectedemitterId]);

  let _addDirectory = (dir) => {
    console.log({ dir });
    directories_fns.add(dir);
    // setActiveDir({path: "./", id: ""});
  };

  let _onNodeFocus = (collectionNode = {}) => {
    if (collectionNode._meta.id === selectedemitterId) {
      return;
    }

    if (!!collectionNode.children) {
      setActiveDir({
        path: collectionNode._meta._relative_path,
        _meta: { id: collectionNode._meta.id },
      });
      selectEmitter(null);

      if (collectionNode && !collectionNode._meta.id && !collectionNode.meta) {
        _resetPlayground();
      }
    } else {
      selectEmitter(collectionNode);
      _onSelectEmitter(
        collectionNode,
        collectionNode._meta._relative_path,
        false,
        true,
        false
      );
    }
  };

  let _onSelectEmitter = (
    emitter = {},
    path = '',
    setOriginal = false,
    appendExistingPayload = false,
    sendMessage = false
  ) => {
    // console.log(`path`,path)
    // console.log(`emitter`, emitter)
    setSelectedEmitter(
      Object.assign({}, emitter, { path }),
      false,
      setOriginal,
      appendExistingPayload,
      sendMessage
    );
  };

  let _onEmit = (payload = {}, path = '') => {
    // onSendMessage(payload);

    console.log(`payload`, payload);
    if (payload) {
      _onSelectEmitter(Object.assign({}, payload), path, false, true, true);
    }
  };

  let _onRemoveEmitter = (emitter = {}) => {
    // console.log(`id`, id)
    // console.log(`selectedemitterId`, selectedemitterId)

    if (emitter._meta.id === selectedemitterId) {
      _resetPlayground();
    }
    emitters_fns.remove(emitter._meta.id);
  };

  let _onRemoveDirectory = (dir) => {
    if (!dir._meta.id) {
      return;
    }
    directories_fns.remove(dir._meta.id);
    if (activeDir && activeDir._meta.id === dir._meta.id) {
      setActiveDir({ path: './', _meta: { id: '' } }); //TODO: enhance later
    }
  };

  let _resetPlayground = () => {
    addNewEmitter();
    setSelectedEmitter({ _meta: { id: '' } }, true);
  };

  let _resetPathOnCloseAddDir = () => {
    setActiveDir({ path: './', _meta: { id: '' } });
  };

  let _onRenameCollectionNode = async (node = {}) => {
    if (!node) return;
    // console.log(`node`, node);

    if (node.hasOwnProperty('children')) {
      if (
        directories_fns &&
        directories_fns.update &&
        node._meta.id &&
        node.name
      ) {
        let name = node.name.trim();
        directories_fns.update({
          id: node._meta.id,
          key: 'name',
          value: name,
        });
      }
    } else {
      if (emitters_fns && emitters_fns.update && node._meta.id && node.name) {
        let name = node.name.trim();
        let path = node._meta ? node._meta._relative_path || '' : '';
        await emitters_fns.update({
          id: node._meta.id,
          key: 'name',
          value: name,
        });
        await emitters_fns.update({
          id: node._meta.id,
          key: 'path',
          value: path,
        });
      }
    }
  };

  // console.log(`collection`, collection);

  return (
    <Resizable
      width="200px"
      minWidth={100}
      maxWidth={400}
      height="100%"
      flex="none"
      right={true}
      className={classnames(
        { 'fc-collapsed': !showCollection },
        'fc-collapsable'
      )}
    >
      <Column>
        <Container className="fc-with-divider">
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
            {/*  <Collection
              overflow={'auto'}
              data={collection}
              primaryKey={'id'}
              showTreeLine={true}
              onNodeFocus={_onNodeFocus}
              defaultSelectedIds={[]}
              minHeight="200px"
              nodeRenderer={({
                isDirectory,
                item,
                isExpanded,
                classes,
                getNodeProps,
                toggleRenaming,
                isRenaming,
                renameComp,
              }) => {
                if (isDirectory) {
                  return (
                    <DirectoryNode
                      item={item}
                      isOpen={isExpanded}
                      className={classes}
                      icon="folder"
                      onDelete={_onRemoveDirectory}
                      toggleRenaming={toggleRenaming}
                      {...getNodeProps()}
                      isRenaming={isRenaming}
                      renameComp={renameComp}
                    />
                  );
                  // return <div className={classes}> {item.name}</div>;
                } else {
                  return (
                    <EmitterNode
                      item={item}
                      className={classes}
                      onEmit={_onEmit}
                      onDelete={_onRemoveEmitter}
                      toggleRenaming={toggleRenaming}
                      {...getNodeProps()}
                      isRenaming={isRenaming}
                      renameComp={renameComp}
                    />
                  );
                }
              }}
              onNodeRename={(node) => {
                _onRenameCollectionNode(node);
              }}
              onLoad={(col) => {
                CollectionAPI.current = col;
                col._setSelection([selectedemitterId]);
              }}
            /> */}
          </Container.Body>
        </Container>
      </Column>
      <div
        className="fc-collapse-btn-v2 fc-collapse-btn"
        onClick={() => {
          toggleShowCollection(!showCollection);
        }}
      >
        <span className="icon-caret"></span>
      </div>
    </Resizable>
  );
};

export default EmitterCollection;

const MessageCollectionHeader = ({
  isCollectionEmpty = true,
  path = '',
  parentId = '',
  onAddDirectory = () => {},
  resetPathOnCloseAddDir = () => {},
  id = '',
}) => {
  let [directoryName, setDirectoryName] = useState('');
  let [showAddDirCmp, toggleAddDirCmp] = useState(false);
  let [focusedNode, setFocusedNode] = useState({ _relative_path: './' });

  /* useEffect(() => {
    toggleAddDirCmp(!!isCollectionEmpty);
  }, [isCollectionEmpty]);*/

  let _handleChangeName = (e) => {
    e.preventDefault();
    let { value } = e.target;
    setDirectoryName(value);
  };

  let _onAdd = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!directoryName.length) return;

    onAddDirectory({ name: directoryName, parent_id: parentId });
    // toggle_popover(!showAddDirCmp);
    setDirectoryName('');
  };

  let _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      _onAdd(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      _toggleAddDirCmp(false);
    }
  };

  let _toggleAddDirCmp = (value = false) => {
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
            ghost
            transparent
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
            className="fc-input border small with-button bg-light form-control form-control"
            autoFocus={true}
            type="text"
            name="status"
            id="status"
            placeholder="Directory name"
            value={directoryName}
            onChange={_handleChangeName}
            onKeyDown={_onKeyDown}
            postComponents={
              <Button
                key={'directory-add-button'}
                text="Add"
                onClick={_onAdd}
                secondary
                sm
              />
            }
          />
          <div className="text-xs text-appForeground ">{`> hit enter to add directory`}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
