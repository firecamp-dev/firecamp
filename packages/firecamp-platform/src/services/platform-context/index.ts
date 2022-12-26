import { request } from './request';
import { confirm, promptInput, promptSaveItem } from './prompt.service';
import AppService from '../app.service';
import { environment } from './environment';

export default {
  app: AppService,
  request,
  environment,
  window: {
    confirm,
    promptInput,
    promptSaveItem,
  },
};

export type { IPlatformRequestService } from './request';
export type {
  IPlatformEnvironmentService,
  IPlatformVariables,
} from './environment';
