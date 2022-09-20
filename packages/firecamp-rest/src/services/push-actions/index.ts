import { EAuthTypes, ERestBodyTypes, IUrl } from '@firecamp/types';
import { _array, _object, _auth } from '@firecamp/utils';
import cleanDeep from 'clean-deep';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';

import {
  EPushActionMetaKeys,
  EPushActionScriptsKeys,
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
      } else if (
        pushAction.includes(key) &&
        equal(lastRequest[key], request[key])
      ) {
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

    if (!lastUrl || !url) return [];

    Object.keys(url).forEach((key: EPushActionUrlKeys) => {
      if (!equal(lastUrl[key], url[key])) {
        /**
         * Push url key in commit action
         * If updated url and lastUrl value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key) && equal(lastUrl[key], url[key])) {
        pushAction = _array.without(pushAction, key) as EPushActionUrlKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  prepareAuthPushAction: (
    lastAuth: any,
    auth: any,
    authType: EAuthTypes,
    existingPushAction?: {
      auth: Array<EAuthTypes>;
      _removed: { auth: Array<EAuthTypes> };
    }
  ) => {
    let pushAction: {
      auth: Array<EAuthTypes>;
      _removed: { auth: Array<EAuthTypes> };
    } = existingPushAction || { auth: [], _removed: { auth: [] } };

    auth = _cloneDeep(auth);

    // console.log({ existingPushAction, pushAction });

    if (!equal(lastAuth, auth)) {
      /**
       * Add type key in commit action auth
       * If updated auth and lastAuth value are not same
       */
      pushAction['auth'].push(authType);

      let isEmpty = equal(
        cleanDeep(auth),
        cleanDeep(_cloneDeep(_auth.defaultAuthState[authType]))
      );

      // Check if auth empty or not
      if (isEmpty) {
        // if updated auth type exist in push action then remove it from push action
        if (pushAction['auth'].includes(authType)) {
          pushAction['auth'] = _array.without(
            pushAction['auth'],
            authType
          ) as EAuthTypes[];
        }

        // Add auth type in _removed.auth if auth is empty
        pushAction['_removed']['auth'].push(authType);
      } else if (
        !isEmpty &&
        pushAction['_removed']['auth'].includes(authType)
      ) {
        // If auth is not empty and _removed.auth has auth type then remove from _removed.auth
        pushAction['_removed']['auth'] = _array.without(
          pushAction['_removed']['auth'],
          authType
        ) as EAuthTypes[];
      }
    } else if (equal(lastAuth, auth)) {
      // If last and updated auth are same and push action has auth type then remove from push action
      if (pushAction['auth'].includes(authType))
        pushAction['auth'] = _array.without(
          pushAction['auth'],
          authType
        ) as EAuthTypes[];

      // If last and updated auth are same and _removed.auth has auth type then remove from _removed.auth
      if (pushAction['_removed']['auth'].includes(authType))
        pushAction['_removed']['auth'] = _array.without(
          pushAction['_removed']['auth'],
          authType
        ) as EAuthTypes[];
    }

    pushAction['auth'] = _array.uniq(pushAction['auth']);
    pushAction['_removed']['auth'] = _array.uniq(
      pushAction['_removed']['auth']
    );
    // console.log({ pushAction });

    return pushAction;
  },

  prepareScriptsPushAction: (
    lastScripts: any,
    scripts: any,
    existingPushAction?: Array<EPushActionScriptsKeys>
  ) => {
    let pushAction: Array<EPushActionScriptsKeys> = existingPushAction || [];

    if (!lastScripts || !scripts) return [];

    Object.keys(scripts).forEach((key: EPushActionScriptsKeys) => {
      if (!equal(lastScripts[key], scripts[key])) {
        /**
         * Push script key in commit action
         * If updated script and lastScripts value are not same
         */
        pushAction.push(key);
      } else if (
        pushAction.includes(key) &&
        equal(lastScripts[key], scripts[key])
      ) {
        pushAction = _array.without(
          pushAction,
          key
        ) as EPushActionScriptsKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepareMetaPushAction: (
    lastMeta: any,
    meta: any,
    existingPushAction?: Array<EPushActionMetaKeys>
  ) => {
    let pushAction: Array<EPushActionMetaKeys> = existingPushAction || [];

    if (!lastMeta || !meta) return [];

    Object.keys(meta).forEach((key: EPushActionMetaKeys) => {
      if (!equal(lastMeta[key], meta[key])) {
        /**
         * Push meta key in commit action
         * If updated meta and lastMeta value are not same
         */
        pushAction.push(key);
      } else if (pushAction.includes(key) && equal(lastMeta[key], meta[key])) {
        pushAction = _array.without(pushAction, key) as EPushActionMetaKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  // TODO: add below function as common logic for all clients
  prepare_MetaPushAction: (
    last_Meta: any,
    _meta: any,
    existingPushAction?: Array<EPushAction_metaKeys>
  ) => {
    let pushAction: Array<EPushAction_metaKeys> = existingPushAction || [];
    if (!last_Meta || !_meta) return [];

    Object.keys(_meta).forEach((key: EPushAction_metaKeys) => {
      if (!equal(last_Meta[key], _meta[key])) {
        /**
         * Push _meta key in commit action
         * If updated _meta and last_Meta value are not same
         */
        pushAction.push(key);
      } else if (
        pushAction.includes(key) &&
        equal(last_Meta[key], _meta[key])
      ) {
        pushAction = _array.without(pushAction, key) as EPushAction_metaKeys[];
      }
    });

    return _array.uniq(pushAction);
  },

  prepareBodyPushAction: (
    lastBody: any,
    body: any,
    bodyType: ERestBodyTypes,
    existingPushAction?: {
      body?: Array<ERestBodyTypes>;
      _removed?: { body?: Array<ERestBodyTypes> };
    }
  ) => {
    let pushAction: {
      body?: Array<ERestBodyTypes>;
      _removed?: { body?: Array<ERestBodyTypes> };
    } = existingPushAction || {
      body: [],
      _removed: { body: [] },
    };

    if (!equal(lastBody, body)) {
      /**
       * Add type key in commit action body
       * If updated body and lastBody value are not same
       */
      pushAction['body'].push(bodyType);

      let isEmpty = !_object.size(cleanDeep(body) || {});

      // Check if body is empty or not
      if (isEmpty) {
        // if updated body type exist in push action then remove it from push action
        if (pushAction['body'].includes(bodyType)) {
          pushAction['body'] = _array.without(
            pushAction['body'],
            bodyType
          ) as ERestBodyTypes[];
        }

        // Add body type in _removed.body if body is empty
        pushAction['_removed']['body'].push(bodyType);
      } else if (
        !isEmpty &&
        pushAction['_removed']['body'].includes(bodyType)
      ) {
        // If body is not empty and _removed.body has body type then remove from _removed.body
        pushAction['_removed']['body'] = _array.without(
          pushAction['_removed']['body'],
          bodyType
        ) as ERestBodyTypes[];
      }

      // console.log({ isEmpty, 1: cleanDeep(body), body });
    } else if (equal(lastBody, body)) {
      // If last and updated body are same and push action has body type then remove from push action
      if (pushAction['body'].includes(bodyType))
        pushAction['body'] = _array.without(
          pushAction['body'],
          bodyType
        ) as ERestBodyTypes[];
      // If last and updated body are same and _removed.body has body type then remove from _removed.body
      if (pushAction['_removed']['body'].includes(bodyType))
        pushAction['_removed']['body'] = _array.without(
          pushAction['_removed']['body'],
          bodyType
        ) as ERestBodyTypes[];
    }

    pushAction['body'] = _array.uniq(pushAction['body']);
    pushAction['_removed']['body'] = _array.uniq(
      pushAction['_removed']['body']
    );
    // console.log({ pushAction });

    return pushAction;
  },
};

export default PushActionService;
