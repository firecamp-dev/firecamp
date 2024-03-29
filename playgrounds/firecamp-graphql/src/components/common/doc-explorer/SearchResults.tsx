import { memo } from 'react';
import PropTypes from 'prop-types';

import Argument from './Argument';
import TypeLink from './TypeLink';

function SearchResults({
  schema,
  withinType,
  searchValue,
  onClickType,
  onClickField,
}) {
  const matchedWithin = [];
  const matchedTypes = [];
  const matchedFields = [];

  const typeMap = schema.getTypeMap();
  let typeNames = Object.keys(typeMap);

  // Move the within type name to be the first searched.
  if (withinType) {
    typeNames = typeNames.filter((n) => n !== withinType.name);
    typeNames.unshift(withinType.name);
  }

  for (const typeName of typeNames) {
    if (
      matchedWithin.length + matchedTypes.length + matchedFields.length >=
      100
    ) {
      break;
    }

    const type = typeMap[typeName];
    if (withinType !== type && isMatch(typeName, searchValue)) {
      matchedTypes.push(
        <div className="doc-category-item" key={typeName}>
          <TypeLink type={type} onClick={onClickType} />
        </div>
      );
    }

    if (type.getFields) {
      const fields = type.getFields();
      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        let matchingArgs;

        if (!isMatch(fieldName, searchValue)) {
          if (field.args && field.args.length) {
            matchingArgs = field.args.filter((arg) =>
              isMatch(arg.name, searchValue)
            );
            if (matchingArgs.length === 0) {
              return;
            }
          } else {
            return;
          }
        }

        const match = (
          <div className="doc-category-item" key={typeName + '.' + fieldName}>
            {withinType !== type && [
              <TypeLink key="type" type={type} onClick={onClickType} />,
              '.',
            ]}
            <a
              className="field-name"
              onClick={(event) => onClickField(field, type, event)}
            >
              {field.name}
            </a>
            {matchingArgs && [
              '(',
              <span key="args">
                {matchingArgs.map((arg) => (
                  <Argument
                    key={arg.name}
                    arg={arg}
                    onClickType={onClickType}
                    showDefaultValue={false}
                  />
                ))}
              </span>,
              ')',
            ]}
          </div>
        );

        if (withinType === type) {
          matchedWithin.push(match);
        } else {
          matchedFields.push(match);
        }
      });
    }
  }

  if (matchedWithin.length + matchedTypes.length + matchedFields.length === 0) {
    return <span className="doc-alert-text">{'No results found.'}</span>;
  }

  if (withinType && matchedTypes.length + matchedFields.length > 0) {
    return (
      <div>
        {matchedWithin}
        <div className="doc-category">
          <div className="doc-category-title">{'other results'}</div>
          {matchedTypes}
          {matchedFields}
        </div>
      </div>
    );
  }

  return (
    <div>
      {matchedWithin}
      {matchedTypes}
      {matchedFields}
    </div>
  );
}

function isMatch(sourceText, searchValue) {
  try {
    const escaped = searchValue.replace(/[^_0-9A-Za-z]/g, (ch) => '\\' + ch);
    return sourceText.search(new RegExp(escaped, 'i')) !== -1;
  } catch (e) {
    return sourceText.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
  }
}

SearchResults.propTypes = {
  schema: PropTypes.object,
  withinType: PropTypes.object,
  searchValue: PropTypes.string,
  onClickType: PropTypes.func,
  onClickField: PropTypes.func,
};

export default memo(SearchResults);
