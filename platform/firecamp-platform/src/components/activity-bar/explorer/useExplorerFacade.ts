import shallow from 'zustand/shallow';
import { useExplorerStore } from '../../../store/explorer';

const useExplorerFacade = () => {
  return useExplorerStore(
    (s) => ({
      explorer: s.explorer,
      fetchExplorer: s.fetchExplorer,
      updateCollection: s.updateCollection,
      updateFolder: s.updateFolder,
      moveRequest: s.moveRequest,
      moveFolder: s.moveFolder,
      changeWorkspaceMetaOrders: s.changeWorkspaceMetaOrders,
      changeCollectionChildrenPosition: s.changeCollectionChildrenPosition,
      changeFolderChildrenPosition: s.changeFolderChildrenPosition,
      // deleteCollection: s.deleteCollection,
      // deleteFolder: s.deleteFolder,
      // deleteRequest: s.deleteRequest,
    }),
    shallow
  );
};

export default useExplorerFacade;
