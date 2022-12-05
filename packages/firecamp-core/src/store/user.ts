import { Rest } from '@firecamp/cloud-apis';
import { TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import create from 'zustand';

export interface IUserStore {
  isGuest: boolean;
  user: {
    name: string;
    username: string;
    email: string;
    provider?: any; //TODO: check type here
    __ref?: {
      id: TId;
    };
  };
  setUser: (user: any) => void;
  setGuestUser: () => void;
  update: (payload: TUpdateUserPayload) => Promise<any>;
  changePassword: (payload: TChangePasswordPayload) => Promise<any>;

  // common
  dispose: () => void;
}

const initialState = {
  isGuest: true,
  user: {
    name: 'Guest',
    username: 'guest',
    email: 'guest@firecamp.com',
  },
};

export const useUserStore = create<IUserStore>((set, get) => ({
  ...initialState,

  setUser: (user: any) => {
    set((s) => ({ user, isGuest: false }));
  },
  setGuestUser: () => {
    set((s) => ({ user: initialState.user, isGuest: true }));
  },
  update: async (payload: TUpdateUserPayload) => {
    try {
      const response = await Rest.user.updateProfile(payload);
      if ([200, 201].includes(response?.status)) {
      }
      // console.log({ response });
      return Promise.resolve(response);
    } catch (e) {
      // console.log({error});
      return Promise.reject(e);
    }
  },

  /**
   * change password
   */
  changePassword: async (payload: TChangePasswordPayload) => {
    return Rest.user.changePassword(payload);
  },

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));

type TChangePasswordPayload = { old_password: string; new_password: string };
type TUpdateUserPayload = { name: string; username?: string }; //TODO: check types here
