import { Collection } from '@firecamp/types';

const firecampToHar = (collection: Partial<Collection>): any => {
  return {};
};

const harToFirecamp = (): Partial<Collection> => {
  return { requests: [] };
};

export { firecampToHar, harToFirecamp };
