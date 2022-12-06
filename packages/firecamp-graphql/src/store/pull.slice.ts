import { ERequestTypes, IGraphQL } from '@firecamp/types';
import { _object } from '@firecamp/utils';

import { IPushAction, IPushPayload } from './pushAction.slice';

/**
 * @reference:
 */

interface IPullSlice {
  pull?: IPushPayload;

  /**
   * Handle pull payload by keys and updated request payload
   */
  getMergedRequestByPullAction?: (
    pullPayload: IPushPayload
  ) => Promise<IGraphQL> | PromiseRejectedResult; //define type for pullPayload here
}

const createPullActionSlice = (set, get): IPullSlice => ({
  pull: {
    _action: {
      type: 'u',
      item_id: '',
      item_type: 'R',
      requestType: ERequestTypes.GraphQL,
      collectionId: '',
      workspaceId: '',
      keys: {},
    },
  },

  getMergedRequestByPullAction: (pullActionPayload: IPushPayload) => {
    if (
      pullActionPayload &&
      pullActionPayload._action &&
      pullActionPayload._action.type === 'u' &&
      pullActionPayload._action.keys
    ) {
      let pullPayload = _object.omit(pullActionPayload, ['_action']);
      let existingRequest: IGraphQL = get().request;
      let updatedRequest: IGraphQL = existingRequest;
      let pullAction: IPushAction = pullActionPayload._action.keys;

      for (let key in pullAction) {
        switch (key) {
          // manage _root keys
          case '_root':
            updatedRequest = Object.assign(
              updatedRequest,
              _object.pick(pullPayload, pullAction[key])
            );
            break;

          // case '__ref':
          case '__meta':
          case 'url':
            if (key in pullPayload) {
              updatedRequest[key] = _object.mergeDeep(
                updatedRequest[key],
                _object.pick(pullPayload[key], pullAction[key])
              ) as IGraphQL;
            }
            break;

          // manage removed body and auth payload
          case '_removed':
            break;
          default:
          // do noting
        }
      }
      console.log('getMergedRequestByPullAction:', { updatedRequest });

      return Promise.resolve(updatedRequest);
    }
    return Promise.reject('Invalid pull payload');
  },
});

export { IPullSlice, createPullActionSlice };
