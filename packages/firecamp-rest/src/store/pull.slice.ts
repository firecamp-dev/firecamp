import { EPushActionType, ERequestTypes, IUiAuth } from '@firecamp/types';
import { _object, _auth } from '@firecamp/utils';

import { IPushAction, IPushPayload } from './pushAction.slice';
import { IRestClientRequest } from '../types';

/**
 * Referance: https://github.com/firecamp-io/firecamp-collaboration-json-examples/blob/main/push/v3/requests/rest/rest.u.json
 */

interface IPullslice {
  pull?: IPushPayload;

  /**
   * Handle pull payload by keys and updated request payload
   */
  getMergedRequestByPullAction?: (
    pullPayload: IPushPayload
  ) => Promise<IRestClientRequest> | PromiseRejectedResult; //define type for pullPayload here
}

const createPullActionSlice = (set, get): IPullslice => ({
  pull: {
    _action: {
      type: EPushActionType.Update,
      item_id: '',
      item_type: 'R',
      request_type: ERequestTypes.Rest,
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
      let existingRequest: IRestClientRequest = get().request;
      let updatedReqeust: IRestClientRequest = existingRequest;
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
          case 'body':
          case 'scripts':
            let updates = _object.pick(
              pullPayload[key],
              pullAction[key]
            ) as IRestClientRequest;
            if (key in pullPayload) {
              updatedReqeust[key] = _object.mergeDeep(
                updatedReqeust[key],
                updates
              ) as IRestClientRequest;
            }
            break;
          case 'auth':
            if (key in pullPayload) {
              // normalize auth
              let normalizedAuth: IUiAuth = _auth.normalizeToUi(
                _object.pick(pullPayload[key], pullAction[key])
              );

              // merge existing auth with normalized auth
              updatedReqeust[key] = _object.mergeDeep(
                updatedReqeust[key],
                normalizedAuth
              ) as IUiAuth;
            }
            break;

          // manage removed body and auth payload
          case '_removed':
            for (let removedKey in pullAction[key]) {
              if (removedKey === 'body' && updatedReqeust['body']) {
                for (let removedBody of pullAction[key][removedKey]) {
                  if (updatedReqeust['body'][removedBody]) {
                    updatedReqeust['body'][removedBody]['value'] = '';
                  }
                }
              } else if (removedKey === 'auth' && updatedReqeust['auth']) {
                for (let removedAuth of pullAction[key][removedKey]) {
                  updatedReqeust['auth'][removedAuth] =
                    _auth.defaultAuthState[removedAuth];
                }
              }
            }
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
