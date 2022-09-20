import { IRest } from '@firecamp/types';
import HTTPSnippet from 'httpsnippet';
import transformRequest from './har-transformer';
import { ESnippetTargets, TTargetClients } from './types';

export * from './types';

export default (
  request: IRest,
  target: ESnippetTargets,
  client: TTargetClients
): string => {
  // transform REST request into HAR format
  const harRequest = transformRequest(request);

  // return code snippet for specific target and it's client
  return new HTTPSnippet(harRequest).convert(target, client) as any;
};
