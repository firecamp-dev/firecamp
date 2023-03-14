import { Rest } from '@firecamp/cloud-apis';

interface IPlatformCollectionService {
  // request items
  import: (collectionPayload: any) => Promise<any>;
}

const collection: IPlatformCollectionService = {
  import: async (collectionPayload: any) => {
    //@ts-ignore TODO: change return type to AxiosResponse instead of { flag: boolean }
    return Rest.collection.import(collectionPayload).then((res) => res.data);
  },
};

export { IPlatformCollectionService, collection };
