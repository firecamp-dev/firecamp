import { TabHeader } from '@firecamp/ui-kit';

const Head = ({ toggleCollapsed = (bool) => {} }) => {
  return (
    <TabHeader
      className="fc-collapse-btn-v3"
      onClick={() => {
        toggleCollapsed(false);
      }}
    >
      <TabHeader.Left>
        <div className="fc-tab-panel-info p-2 whitespace-pre">
          <label>Listeners</label>
        </div>
      </TabHeader.Left>
      <TabHeader.Right>
        <div className="icon-caret cursor-pointer"></div>
      </TabHeader.Right>
    </TabHeader>
  );
};

export default Head;
