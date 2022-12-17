import { request } from './request';
import { promptInput } from './prompt.service';
import AppService from '../../services/app';
import { environment } from './environment';

export default {
  app: AppService,
  request,
  environment,
  window: {
    promptInput,
  },
};

export type { IPlatformRequestService } from './request';
export type { IPlatformEnvironmentService, IPlatformVariables } from './environment';
