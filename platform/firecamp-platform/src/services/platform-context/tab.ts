import { TId } from '@firecamp/types';
import { IRequestTab } from '../../components/tabs/types';
import { useTabStore } from '../../store/tab';

interface IPlatformTabService {
  // on change request, update tab __meta
  changeMeta: (tabId: TId, tabMeta: IRequestTab['__meta']) => void;
}

const tab: IPlatformTabService = {
  // on change request
  changeMeta: (tabId: TId, tabMeta: IRequestTab['__meta']) => {
    // console.log({ tabMeta });
    useTabStore.getState().changeMeta(tabId, tabMeta);
  },
};

export { IPlatformTabService, tab };
