import { TId, ISocketIOEmitter, EPushActionType } from '@firecamp/types';

import PushActionService from '../../../services/push-actions';

interface IPushActionEmitterSlice {
  prepareCollectionEmittersPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastEmitter?: ISocketIOEmitter,
    emitter?: ISocketIOEmitter
  ) => void;
}

const createPushActionEmitterSlice = (set, get): IPushActionEmitterSlice => ({
  prepareCollectionEmittersPushAction: (
    id: TId,
    pushActionType: EPushActionType,
    lastEmitter?: ISocketIOEmitter,
    emitter?: ISocketIOEmitter
  ) => {
    let emitterPushAction =
      PushActionService.prepareCollectionEmittersPushAction(
        id,
        pushActionType,
        lastEmitter,
        emitter,
        get().pushAction?.emitters
      );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        emitters: emitterPushAction,
      },
    }));
  },
});
export { IPushActionEmitterSlice, createPushActionEmitterSlice };
