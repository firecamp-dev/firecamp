import { FC, useRef, useState } from 'react';
import {
  Input,
  TextArea,
  Container,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  Modal,
  IModal,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';

import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import { CollectionDataProvider } from './collection/CollectionDataProvider';
import treeRenderer from './collection/treeItemRenderer';

import { useWorkspaceStore } from '../../../../store/workspace';
import { useRequestStore } from '../../../../store/request';

const SaveRequest: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
  height = '732px',
  width = '500px',
}) => {
  const [request, setRequest] = useState({
    name: '',
    description: '',
    collection_id: '',
    folder_id: '',
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState({ name: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name) setError({ name: '' });
    setRequest((r) => ({ ...r, [name]: value }));
  };

  const onCreate = () => {
    if (isRequesting) return;
    const name = request.name.trim();
    if (!name || name.length < 3) {
      setError({ name: 'The request name must have minimun 3 characters' });
      return;
    }
    const _request = {
      ...request,
      name,
      description: request?.description?.trim(),
    };

    setIsRequesting(true);
    // console.log({ _request });

    useRequestStore.getState().onSaveRequest(_request);

    // createRequest(_request)
    //   .then((r)=> {

    //     console.log(r, "r......")
    //     AppService.modals.close();
    //   })
    //   .catch((e)=> {
    //     console.log(e.response, e.response?.data)
    //     AppService.notify.alert(e?.response?.data?.message || e.message )
    //   })
    //   .finally(()=> {
    //     setIsRequesting(false);
    //   });
  };

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium display-block">
          Save Request
          {/* <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mt-2">
              ENTER A NEW REQUEST INFO
            </label> */}
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="p-6 !pb-0">
          <div className="">
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Request name"
              name={'name'}
              value={request.name}
              onChange={onChange}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
              // iconPosition="right"
              // icon={<VscEdit />}
            />
          </div>

          <PathSelector
            onSelect={(_meta) => {
              // console.log({ _meta });

              setRequest((r) => ({ ...r, ..._meta }));
            }}
          />

          <TextArea
            type="text"
            minHeight="200px"
            label="Description (optional)"
            labelClassname="fc-input-label"
            placeholder="Description"
            note="Markdown supported in description"
            name={'description'}
            value={request.description}
            onChange={onChange}
            // disabled={true}
            // iconPosition="right"
            // icon={<VscEdit />}
          />
        </div>
      </Modal.Body>

      <Modal.Footer className="!py-3 border-t border-appBorder">
        <TabHeader className="px-6">
          <TabHeader.Right>
            <Button
              text="Cancel"
              secondary
              transparent={true}
              sm
              onClick={(e) => onClose()}
              ghost={true}
            />
            <Button
              text={isRequesting ? 'Creating...' : 'Create'}
              primary
              sm
              onClick={onCreate}
              disabled={isRequesting}
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};

export default SaveRequest;

const PathSelector: FC<{ onSelect: (_: any) => void }> = ({ onSelect }) => {
  let {
    explorer: { collections, folders },
  } = useWorkspaceStore.getState();

  const dataProvider = useRef(new CollectionDataProvider(collections, folders));

  const onItemSelect = (itemIds: string[], treeId: string) => {
    if (!itemIds?.length) return;
    const selectedItem = itemIds[0];
    const item = collections.find((i) => i._meta.id == selectedItem);

    // console.log({ item });

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
    <Container className="max-h-48 mb-14 !h-fit">
      <label className="text-appForeground text-sm mb-1 block">
        Select collection or folder
      </label>
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
      </div>
    </Container>
  );
};
