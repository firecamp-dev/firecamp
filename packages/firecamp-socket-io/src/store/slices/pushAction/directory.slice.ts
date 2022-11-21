import { TId, IDirectory, EPushActionType } from '@firecamp/types';

import PushActionService from '../../../services/push-actions';

interface IPushActionDirectorySlice {
  prepareCollectionDirectoriesPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastDirectory: IDirectory,
    directory: IDirectory
  ) => void;
}

const createPushActionDirectorySlice = (
  set,
  get
): IPushActionDirectorySlice => ({
  prepareCollectionDirectoriesPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastDirectory: IDirectory,
    directory: IDirectory
  ) => {
    let directoriesPushAction =
      PushActionService.prepareCollectionDirectoriesPushAction(
        id,
        pushActionType,
        lastDirectory,
        directory,
        get().pushAction?.directories
      );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        directories: directoriesPushAction,
      },
    }));
  },
});
export { IPushActionDirectorySlice, createPushActionDirectorySlice };
