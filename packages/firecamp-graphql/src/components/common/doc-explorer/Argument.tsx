import PropTypes from 'prop-types';
import TypeLink from './TypeLink';
import DefaultValue from './DefaultValue';

export default function Argument({ arg, onClickType, showDefaultValue }) {
  return (
    <span className="arg">
      <span className="arg-name">{arg.name}</span>
      {': '}
      <TypeLink type={arg.type} onClick={onClickType} />
      {showDefaultValue !== false && <DefaultValue field={arg} />}
    </span>
  );
}

Argument.propTypes = {
  arg: PropTypes.object.isRequired,
  onClickType: PropTypes.func.isRequired,
  showDefaultValue: PropTypes.bool,
};
