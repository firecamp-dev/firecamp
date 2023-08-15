import { confirm, promptInput, promptSaveItem } from './prompt.service';
import AppService from '../app.service';
import { tab } from './tab';
import { request } from './request';
import { collection } from './collection';
import { environment } from './environment';
import { platform } from './platform';


export default {
  app: AppService,
  request,
  platform,
  collection,
  tab,
  environment,
  window: {
    confirm,
    promptInput,
    promptSaveItem,
  },
};

export type { IPlatformRequestService } from './request';
export type { IPlatformCollectionService } from './collection';
export type { IPlatformEnvironmentService } from './environment';
