import { TId, IWebSocketMessage } from '@firecamp/types';

import PushActionService from '../../../services/push-actions';

interface IPushActionMessageSlice {
  prepareCollectionMessagesPushAction: (
    id: TId,
    pushActionType: string,
    lastMessage?: IWebSocketMessage,
    message?: IWebSocketMessage
  ) => void;
}

const createPushActionMessageSlice = (set, get): IPushActionMessageSlice => ({
  prepareCollectionMessagesPushAction: (
    id: TId,
    pushActionType: string,
    lastMessage?: IWebSocketMessage,
    message?: IWebSocketMessage
  ) => {
    let messagesPushAction =
      PushActionService.prepareCollectionMessagesPushAction(
        id,
        pushActionType,
        lastMessage,
        message,
        get().pushAction?.messages
      );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        messages: messagesPushAction,
      },
    }));
  },
});
export { IPushActionMessageSlice, createPushActionMessageSlice };
