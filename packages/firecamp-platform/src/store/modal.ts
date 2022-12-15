import create from 'zustand';
import { EPlatformModalTypes } from '../types';

export interface IModalStore {
  currentOpenModalType: EPlatformModalTypes;
  isOpen: boolean;
  activeTab?: string; //TODO: check this type later
  meta?: any; //meta holds the extra information of currentOpenModal

  open: (modalType: EPlatformModalTypes, meta?: any) => void;
  close: () => void;

  // common
  dispose: () => void;
}

const initialState = {
  currentOpenModalType: EPlatformModalTypes.None,
  isOpen: false,
  activeTab: '',
  meta: {},
};

export const useModalStore = create<IModalStore>((set, get) => ({
  ...initialState,

  open: (modalType: EPlatformModalTypes, meta?: any) => {
    set((s) => ({
      currentOpenModalType: modalType,
      isOpen: true,
      meta: meta || {},
    }));
  },

  close: () => {
    set((s) => ({
      currentOpenModalType: EPlatformModalTypes.None,
      isOpen: false,
      activeTab: '',
      meta: {},
    }));
  },

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
