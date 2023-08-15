import PropTypes from 'prop-types';
import { GraphQLList, GraphQLNonNull } from 'graphql';

function renderType(type, onClick) {
  if (type instanceof GraphQLNonNull) {
    return (
      <span>
        {renderType(type.ofType, onClick)}
        {'!'}
      </span>
    );
  }
  if (type instanceof GraphQLList) {
    return (
      <span>
        {'['}
        {renderType(type.ofType, onClick)}
        {']'}
      </span>
    );
  }
  return (
    <a
      className="type-name"
      onClick={(event) => {
        event.preventDefault();
        onClick(type, event);
      }}
      href="#"
    >
      {type.name}
    </a>
  );
}

function TypeLink({ type, onClick }) {
  return renderType(type, onClick);
}

TypeLink.propTypes = {
  type: PropTypes.object,
  onClick: PropTypes.func,
};

export default TypeLink;
