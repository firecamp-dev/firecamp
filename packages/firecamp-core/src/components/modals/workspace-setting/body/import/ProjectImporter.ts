import { _object } from '@firecamp/utils';
import { importCollection } from '../../../../../../services/collection';

let META_KEY = {
  EXPORT_TIME: '__export_time',
  EXPORT_APP: '__export_app',
  EXPORT_VERSION: '__export_version',
};

export default class ProjectImporter {
  static importProject = async (payload, source) => {
    try {
      if (!_object.isEmpty(payload) && !!source) {
        if (source === 'firecamp') {
          let isSame = [];
          Object.values(META_KEY).map((k, i) => {
            isSame.push(_object.has(payload.meta, k));
          });
          if (isSame.length) {
            if (!isSame.includes(false)) {
              return importCollection(payload);
            } else {
              return Promise.reject('please import correct file!');
            }
          }
        }
      } else {
        return Promise.reject();
      }
    } catch (error) {
      return Promise.reject({
        API: 'ProjectImporter',
        args: { payload, source },
        error,
      });
    }
  };
}
