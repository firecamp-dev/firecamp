import { Rest } from '@firecamp/cloud-apis';
import { useWorkspaceStore } from '../../store/workspace';

interface IPlatformCollectionService {
  // request items
  import: (collectionPayload: any) => Promise<any>;
}

const collection: IPlatformCollectionService = {
  import: async (collectionPayload: any) => {
    return Rest.collection.import(collectionPayload).then((res) => {
      // after successful collection import, re-fetch the explorer artifacts
      useWorkspaceStore.getState().fetchExplorer();
      //@ts-ignore TODO: change return type to AxiosResponse instead of { flag: boolean }
      return res.data;
    });
  },
};

export { IPlatformCollectionService, collection };
