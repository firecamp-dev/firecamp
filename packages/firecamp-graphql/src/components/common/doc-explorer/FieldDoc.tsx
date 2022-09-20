import { memo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import Argument from './Argument';
import MarkdownContent from './MarkdownContent';
import TypeLink from './TypeLink';

const FieldDoc = ({ field, onClickType }) => {
  const renderArgsDef = useCallback(() => {
    if (field.args && field.args.length > 0) {
      return (
        <div className="doc-category">
          <div className="doc-category-title">{'arguments'}</div>
          {field.args.map((arg) => (
            <div key={arg.name} className="doc-category-item">
              <div>
                <Argument arg={arg} onClickType={onClickType} />
              </div>
              <MarkdownContent
                className="doc-value-description"
                markdown={arg.description}
              />
            </div>
          ))}
        </div>
      );
    }
  }, [field, onClickType]);

  return (
    <div>
      <MarkdownContent
        className="doc-type-description"
        markdown={field.description || 'No Description'}
      />
      {field.deprecationReason && (
        <MarkdownContent
          className="doc-deprecation"
          markdown={field.deprecationReason}
        />
      )}
      <div className="doc-category">
        <div className="doc-category-title">{'type'}</div>
        <TypeLink type={field.type} onClick={onClickType} />
      </div>
      {renderArgsDef()}
    </div>
  );
};

FieldDoc.propTypes = {
  field: PropTypes.object,
  onClickType: PropTypes.func,
};

export default memo(FieldDoc);
