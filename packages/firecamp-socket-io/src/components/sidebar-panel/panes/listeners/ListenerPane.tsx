import { Pane } from '@firecamp/ui';
import PaneBody from './PaneBody';
import './listeners.scss';

const ListenerPane = () => {
  return (
    <Pane
      expanded={true}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span>Listeners</span>;
      }}
      headerActionRenderer={() => {
        return <></>;
      }}
      bodyRenderer={({ expanded }) => {
        return <PaneBody />;
      }}
    />
  );
};

export default ListenerPane;
