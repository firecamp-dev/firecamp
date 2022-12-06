import { IUrl } from '@firecamp/types';
import { _array, _object } from '@firecamp/utils';

import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';

import {
  EPushActionMetaKeys,
  EPushActionUrlKeys,
  EPushAction_metaKeys,
  EPushAction_rootKeys,
} from '../../types';

const PushActionService = {
  // TODO: add below function as common logic for all clients
  prepareRootPushAction: (
    lastRequest: any,
    request: any,
    existingPushAction?: Array<EPushAction_rootKeys>
  ) => {
    let pushAction: Array<EPushAction_rootKeys> = existingPushAction || [];

    if (!lastRequest || !request) return [];

    Object.keys(request).forEach((key: EPushAction_rootKeys) => {
      if (!equal(lastRequest[key], request[key])) {
        /**
         * Push request key in commit action
         * If updated request and lastRequest value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key)) {
        pushAction = _array.without(pushAction, key) as EPushAction_rootKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepareUrlPushAction: (
    lastUrl: IUrl,
    url: IUrl,
    existingPushAction?: Array<EPushActionUrlKeys>
  ) => {
    let pushAction: Array<EPushActionUrlKeys> = existingPushAction || [];

    if (!lastUrl || !url) return pushAction;

    Object.keys(url).forEach((key: EPushActionUrlKeys) => {
      if (!equal(lastUrl[key], url[key])) {
        /**
         * Push url key in commit action
         * If updated url and lastUrl value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key)) {
        pushAction = _array.without(pushAction, key) as EPushActionUrlKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepareMetaPushAction: (
    lastMeta: any,
    __meta: any,
    existingPushAction?: Array<EPushActionMetaKeys>
  ) => {
    let pushAction: Array<EPushActionMetaKeys> = existingPushAction || [];

    if (!lastMeta || !__meta) return [];

    Object.keys(__meta).forEach((key: EPushActionMetaKeys) => {
      if (!equal(lastMeta[key], __meta[key])) {
        /**
         * Push __meta key in commit action
         * If updated __meta and lastMeta value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key)) {
        pushAction = _array.without(pushAction, key) as EPushActionMetaKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepare_MetaPushAction: (
    last_Meta: any,
    __rrf: any,
    existingPushAction?: Array<EPushAction_metaKeys>
  ) => {
    let pushAction: Array<EPushAction_metaKeys> = existingPushAction || [];
    if (!last_Meta || !__rrf) return [];

    Object.keys(__rrf).forEach((key: EPushAction_metaKeys) => {
      if (!equal(last_Meta[key], __ref[key])) {
        /**
         * Push __ref key in commit action
         * If updated __ref and last_Meta value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key)) {
        pushAction = _array.without(pushAction, key) as EPushAction_metaKeys[];
      }
    });

    return _array.uniq(pushAction);
  },
};

export default PushActionService;
