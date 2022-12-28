import shallow from 'zustand/shallow';
import { Response as ResponsePanel } from '@firecamp/ui-kit';
import { IStore, useStore } from '../../../../store';

const Response = () => {
  const { playground, activePlayground, isRequestRunning } = useStore(
    (s: IStore) => {
      const pId = s.runtime.activePlayground;
      return {
        playground: s.playgrounds[pId],
        activePlayground: pId,
        isRequestRunning: s.runtime.playgroundsMeta[pId].isRequestRunning,
      };
    },
    shallow
  );
  const { response } = playground;
  return (
    <ResponsePanel
      id={activePlayground}
      response={response}
      isRequestRunning={isRequestRunning}
    />
  );
};
export default Response;
