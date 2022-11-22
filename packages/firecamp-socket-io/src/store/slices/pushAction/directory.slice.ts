import { TId, IRequestFolder, EPushActionType } from '@firecamp/types';
import PushActionService from '../../../services/push-actions';

interface IPushActionDirectorySlice {
  prepareCollectionDirectoriesPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastDirectory: IRequestFolder,
    directory: IRequestFolder
  ) => void;
}

const createPushActionDirectorySlice = (
  set,
  get
): IPushActionDirectorySlice => ({
  prepareCollectionDirectoriesPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastDirectory: IRequestFolder,
    directory: IRequestFolder
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
