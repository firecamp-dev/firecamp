import { request } from './request';
import { promptInput, promptSaveItem } from './prompt.service';
import AppService from '../../services/app';
import { environment } from './environment';

export default {
  app: AppService,
  request,
  environment,
  window: {
    promptInput,
    promptSaveItem,
  },
};

export type { IPlatformRequestService } from './request';
export type {
  IPlatformEnvironmentService,
  IPlatformVariables,
} from './environment';
