import { request } from './request';
import { tab } from './tab';
import { confirm, promptInput, promptSaveItem } from './prompt.service';
import AppService from '../app.service';
import { environment } from './environment';

export default {
  app: AppService,
  request,
  tab,
  environment,
  window: {
    confirm,
    promptInput,
    promptSaveItem,
  },
};

export type { IPlatformRequestService } from './request';
export type { IPlatformEnvironmentService } from './environment';
