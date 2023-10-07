import { create } from 'zustand';
import { EPlatformModalTypes } from '../types';

export interface IModalStore {
  currentOpenModalType: EPlatformModalTypes;
  isOpen: boolean;
  activeTab?: string; //TODO: check this type later
  __meta?: any; //meta holds the extra information of currentOpenModal

  open: (modalType: EPlatformModalTypes, meta?: any) => void;
  close: () => void;

  // common
  dispose: () => void;
}

const initialState = {
  currentOpenModalType: EPlatformModalTypes.None,
  isOpen: false,
  activeTab: '',
  __meta: {},
};

export const useModalStore = create<IModalStore>((set, get) => ({
  ...initialState,

  open: (modalType: EPlatformModalTypes, __meta?: any) => {
    set((s) => ({
      currentOpenModalType: modalType,
      isOpen: true,
      __meta: __meta || {},
    }));
  },

  close: () => {
    set((s) => ({
      currentOpenModalType: EPlatformModalTypes.None,
      isOpen: false,
      activeTab: '',
      __meta: {},
    }));
  },

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
