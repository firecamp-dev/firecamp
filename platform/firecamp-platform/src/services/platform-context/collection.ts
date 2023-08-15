import { Rest } from '@firecamp/cloud-apis';
import { useExplorerStore } from '../../store/explorer';

interface IPlatformCollectionService {
  // request items
  import: (collectionPayload: any) => Promise<any>;
}

const collection: IPlatformCollectionService = {
  import: async (collectionPayload: any) => {
    return Rest.collection.import(collectionPayload).then((res) => {
      // after successful collection import, re-fetch the explorer artifacts
      useExplorerStore.getState().fetchExplorer();
      //@ts-ignore TODO: change return type to AxiosResponse instead of { flag: boolean }
      return res.data;
    });
  },
};

export { IPlatformCollectionService, collection };
