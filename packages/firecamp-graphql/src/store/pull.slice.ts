import { EPushActionType, ERequestTypes, IGraphQL } from '@firecamp/types';
import { _object } from '@firecamp/utils';

import { IPushAction, IPushPayload } from './pushAction.slice';

/**
 * Referance:
 */

interface IPullslice {
  pull?: IPushPayload;

  /**
   * Handle pull payload by keys and updated request payload
   */
  getMergedRequestByPullAction?: (
    pullPayload: IPushPayload
  ) => Promise<IGraphQL> | PromiseRejectedResult; //define type for pullPayload here
}

const createPullActionSlice = (set, get): IPullslice => ({
  pull: {
    _action: {
      type: EPushActionType.Update,
      item_id: '',
      item_type: 'R',
      request_type: ERequestTypes.GraphQL,
      collection_id: '',
      workspace_id: '',
      keys: {},
    },
  },

  getMergedRequestByPullAction: (pullActionPayload: IPushPayload) => {
    if (
      pullActionPayload &&
      pullActionPayload._action &&
      pullActionPayload._action.type === EPushActionType.Update &&
      pullActionPayload._action.keys
    ) {
      let pullPayload = _object.omit(pullActionPayload, ['_action']);
      let existingRequest: IGraphQL = get().request;
      let updatedReqeust: IGraphQL = existingRequest;
      let pullAction: IPushAction = pullActionPayload._action.keys;

      for (let key in pullAction) {
        switch (key) {
          // manage _root keys
          case '_root':
            updatedReqeust = Object.assign(
              updatedReqeust,
              _object.pick(pullPayload, pullAction[key])
            );
            break;

          // case '_meta':
          case 'meta':
          case 'url':
            if (key in pullPayload) {
              updatedReqeust[key] = _object.mergeDeep(
                updatedReqeust[key],
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
      console.log('getMergedRequestByPullAction:', { updatedReqeust });

      return Promise.resolve(updatedReqeust);
    }
    return Promise.reject('Invalid pull payload');
  },
});

export { IPullslice, createPullActionSlice };
