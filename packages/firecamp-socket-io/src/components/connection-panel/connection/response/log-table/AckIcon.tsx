const AckIcon = ({ selectedConnection = '', toolTip = '' }) => {
  return (
    <div
      className="ACK-icon"
      id={`socket-io-response-log-${selectedConnection}-${toolTip}`}
      data-tip={toolTip || ''}
    >
      <span className="iconv2-from-server-icon ACK-icon-receive"></span>
      <span className="iconv2-to-server-icon ACK-icon-send"></span>
    </div>
  );
};

export default AckIcon;
