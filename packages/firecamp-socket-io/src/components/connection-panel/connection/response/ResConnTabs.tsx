const _getResConnTabs = (
  connections = {},
  connectionsMessages = {},
  prevTabs = [],
  resActiveConn = ''
) => {
  let tabs = [];

  if (connections) {
    [...connections.values()].map((c, i) => {
      let messages_count = 0;
      let tab = {
        id: c.id || i,
        name: c.name
      };

      if (prevTabs) {
        let found_conn = prevTabs.find(tab => tab.id === c.id);
        if (found_conn) {
          let connectionMessages = connectionsMessages.get(c.id);
          if (c.id !== resActiveConn) {
            messages_count =
              (connectionMessages &&
                connectionMessages.length - found_conn.seen) ||
              0;
            tab = Object.assign({}, tab, {
              count: messages_count || 0,
              seen: found_conn.seen || 0
            });
            if (messages_count < 1) {
              delete tab['count'];
            }
          } else {
            tab = Object.assign({}, tab, found_conn, {
              count: 0,
              seen: connectionMessages ? connectionMessages.length : 0
            });
          }
        }
      }

      tabs.push(tab);
    });
  }

  // console.log(`tabs`, tabs);
  return tabs;
};

const ResConnTabs = ({ isFS = false, setFS = (is) => {} }) => {
  
  return (
    <div className="chatboard-align">
    <div className="icon-open" onClick={e => setFS(!isFS)}></div>
  </div>
  );
};

export default ResConnTabs;
