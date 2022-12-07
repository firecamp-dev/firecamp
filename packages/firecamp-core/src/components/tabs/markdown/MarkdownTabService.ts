import CleanDeep from 'clean-deep';
import { ERequestTypes } from '@firecamp/types';
import { nanoid as id } from 'nanoid';

import { FirecampContext as FCtx } from '../../../services/firecamp-functions';
import { _array, _object } from '@firecamp/utils';

const INSERT = 'i',
  UPDATE = 'u';

class MarkdownTabService {
  constructor(tab) {
    this.tab = tab;

    this.syncAction = {
      // [INSERT]: true,
      // [UPDATE]: { _root: [ 'body','type']}
    };
  }

  setProps = (tab = {}) => {
    this.tab = Object.assign({}, this.tab, tab);
  };

  getCurrentState = () => {
    return this.syncAction;
  };

  applyTabRefresh = () => {
    this.syncAction = {};
    FCtx.tab.update.__meta(this.tab, {
      hasChange: false,
      isFresh: true,
      isDeleted: false,
    });
  };

  applyTabRefreshNSaved = (request) => {
    this.syncAction = {};
    FCtx.tab.update.requestAndMeta(
      this.tab.id,
      { hasChange: false, isFresh: true, isSaved: true, isDeleted: false },
      request
    );
  };

  applyTabDirty = () => {
    let hasChange = false;

    // console.log(this.syncAction)

    for (let k in this.syncAction) {
      switch (k) {
        case INSERT:
          if (typeof this.syncAction[k] === 'boolean') hasChange = true;
          break;
        case UPDATE:
          if (this.syncAction[k]?._root?.length) hasChange = true;
          break;
      }
    }

    FCtx.tab.update.__meta(this.tab, { hasChange });
  };

  /**
   * tab action functions for keeping history for syncing
   */
  action = {
    /**
     * reset the syncAction and make tab fresh
     */
    reset: () => {
      this.syncAction = {};
      this.applyTabRefresh();
    },

    /**
     * Update action: will occur for only url and config changes for the MarkdownTab
     * @param data
     * @param data_type
     */
    update: (data, data_type) => {
      // console.log(url, config);
      let { meta, request } = this.tab;
      if (!meta.isSaved) return;

      let {
        data: propData,
        meta: { data_type: propDataType },
      } = request;

      let isDataUpdated, isDataTypeUpdated;
      if (data) {
        isDataUpdated = data != propData; //todo: need to check exact type in future, like obj==obj, array==array
      }
      if (data_type) {
        isDataTypeUpdated = data_type != propDataType;
      }

      let updatedKeys = [];
      if (isDataUpdated) updatedKeys.push('data');

      let _root = this.syncAction[UPDATE]
        ? this.syncAction[UPDATE]._root || []
        : [];
      let changedMetaKeys = this.syncAction[UPDATE]
        ? this.syncAction[UPDATE].__meta || []
        : [];

      _root = _array.uniq([..._root, ...updatedKeys]);
      changedMetaKeys = _array.uniq([...changedMetaKeys, 'data_type']);

      //if changes is identical then remove previously added _root
      if (data && !isDataUpdated) {
        _root = _array.without(_root, 'data');
      }
      if (data_type && !isDataTypeUpdated) {
        changedMetaKeys = _array.without(changedMetaKeys, 'data_type');
      }

      let action = { [UPDATE]: {} };

      if (isDataUpdated) {
        action[UPDATE] = Object.assign(action[UPDATE], { _root });
      }
      if (isDataTypeUpdated) {
        action[UPDATE] = Object.assign(action[UPDATE], {
          meta: changedMetaKeys,
        });
      }
      this.syncAction = CleanDeep(Object.assign({}, this.syncAction, action));

      this.applyTabDirty();
    },
  };

  db = {
    /**
     * 1. Add Request
     * @param tabRequest
     * @returns {Promise.<T>}
     */
    addRequest: async (request) => {
      if (!_object.size(request)) return Promise.reject('no request found');

      try {
        let reqId = id();
        if (_object.size(request)) {
          request['__ref'] = Object.assign({}, request['__ref'], {
            id: reqId,
            createdAt: new Date().valueOf(),
            // createdBy: F.userMeta.id
          });

          request['meta'] = Object.assign({}, request['meta'], {
            type: ERequestTypes.File,
          });

          // await F.db.request.add(request, true);

          // if (F.userMeta.isLoggedIn) {
          //   // Sync local changes
          //   F.mitt.emit('PUSH');
          // }
        }

        // F.appStore.project.fetchAndSetAll();

        // let req = await F.db.request.populateFromDB(reqId);

        // if (req) {
        //   this.applyTabRefreshNSaved(req);

        //   return Promise.resolve(req);
        // } else {
        //   return Promise.reject({});
        // }
      } catch (error) {
        console.log('error');
        return Promise.length.reject('Invlaid request');
      }
    },
    updateRequest: async (state) => {
      let {
        meta: { hasChange, isFresh },
        request: {
          __ref: { id: reqId, collectionId },
        },
      } = this.tab;
      let { panel } = state;

      if (!hasChange || _object.isEmpty(this.syncAction[UPDATE])) return;

      let updatedInfo = {
        updatedAt: new Date().valueOf(),
        // updatedBy: F.userMeta.id
      };

      if (this.syncAction[UPDATE]._root || this.syncAction[UPDATE].__ref) {
        let { _root = [], meta = [] } = this.syncAction[UPDATE];
        let payload = {};
        _root.map((k) => {
          if (k === 'data') {
            payload[k] = panel.source['body'];
          }
        });
        meta.map((k) => {
          if (k === 'data_type') {
            payload['meta'] = {
              ['data_type']: panel.source['type'],
            };
          }
        });
        // console.log("payload--->", payload)

        payload['_meta'] = {
          ...(payload['_meta'] || {}),
          id: reqId,
          ...updatedInfo,
        };

        if (
          !_object.isEmpty(payload) &&
          !_object.isEmpty(this.syncAction[UPDATE])
        ) {
          // F.db.request
          //   .update(payload, ERequestTypes.File)
          //   .then(r => {
          //     console.log(r);
          //   })
          //   .catch(e => {
          //     console.log(`e`, e);
          //   });
        }
      }

      let commitActionsPayload = {
        action:
          {
            ...this.syncAction[UPDATE],
            _meta: ['updatedAt', 'updatedBy'],
          } || {},
        id: id(),
        item_type: 'R',
        request_type: ERequestTypes.File,
        type: UPDATE,
        itemId: reqId,
        collectionId,
        // workspaceId: F.appStore.Preferences.active_workspace
      };

      // await F.db.request
      //   .addUpdateCommitAction(commitActionsPayload)
      //   .then(r => {
      //     // console.log(r);
      //     this.action.reset();
      //   })
      //   .catch(e => {
      //     console.log(`e`, e);
      //   });

      // if (F.userMeta.isLoggedIn) {
      //   console.log(`call to server`);

      //   // Sync local changes
      //   F.mitt.emit('PUSH');
      // }
      // F.appStore.project.fetchAndSetAll();

      // let req = await F.db.request.populateFromDB(reqId);

      // if (req) {
      //   this.applyTabRefreshNSaved(req);

      //   return Promise.resolve(req);
      // } else {
      //   return Promise.reject({});
      // }
    },
  };
}

export default MarkdownTabService;
