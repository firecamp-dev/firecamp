import { Har } from 'har-format';
import { Collection } from '@firecamp/types';

const firecampToHar = (collection: Partial<Collection>): any => {
  return {};
};

const harToFirecamp = (har: Har): Partial<Collection> => {
  return { requests: [] };
};

export { firecampToHar, harToFirecamp };
