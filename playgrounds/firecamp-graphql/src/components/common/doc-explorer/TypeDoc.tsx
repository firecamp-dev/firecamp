import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
} from 'graphql';

import Argument from './Argument';
import MarkdownContent from './MarkdownContent';
import TypeLink from './TypeLink';
import DefaultValue from './DefaultValue';

function TypeDoc({ schema, type, onClickType, onClickField }) {
  let [state, setState] = useState({ showDeprecated: false });

  const handleShowDeprecated = () => setState({ showDeprecated: true });

  let typesTitle;
  let types;
  if (type instanceof GraphQLUnionType) {
    typesTitle = 'possible types';
    types = schema.getPossibleTypes(type);
  } else if (type instanceof GraphQLInterfaceType) {
    typesTitle = 'implementations';
    types = schema.getPossibleTypes(type);
  } else if (type instanceof GraphQLObjectType) {
    typesTitle = 'implements';
    types = type.getInterfaces();
  }

  let typesDef;
  if (types && types.length > 0) {
    typesDef = (
      <div className="doc-category">
        <div className="doc-category-title">{typesTitle}</div>
        {types.map((subtype) => (
          <div key={subtype.name} className="doc-category-item">
            <TypeLink type={subtype} onClick={onClickType} />
          </div>
        ))}
      </div>
    );
  }

  // InputObject and Object
  let fieldsDef;
  let deprecatedFieldsDef;
  if (type.getFields) {
    const fieldMap = type.getFields();
    const fields = Object.keys(fieldMap).map((name) => fieldMap[name]);
    fieldsDef = (
      <div className="doc-category">
        <div className="doc-category-title">{'fields'}</div>
        {fields
          .filter((field) => !field.isDeprecated)
          .map((field) => (
            <Field
              key={field.name}
              type={type}
              field={field}
              onClickType={onClickType}
              onClickField={onClickField}
            />
          ))}
      </div>
    );

    const deprecatedFields = fields.filter((field) => field.isDeprecated);
    if (deprecatedFields.length > 0) {
      deprecatedFieldsDef = (
        <div className="doc-category">
          <div className="doc-category-title">{'deprecated fields'}</div>
          {!state.showDeprecated ? (
            <button className="show-btn" onClick={handleShowDeprecated}>
              {'Show deprecated fields...'}
            </button>
          ) : (
            deprecatedFields.map((field) => (
              <Field
                key={field.name}
                type={type}
                field={field}
                onClickType={onClickType}
                onClickField={onClickField}
              />
            ))
          )}
        </div>
      );
    }
  }

  let valuesDef;
  let deprecatedValuesDef;
  if (type instanceof GraphQLEnumType) {
    const values = type.getValues();
    valuesDef = (
      <div className="doc-category">
        <div className="doc-category-title">{'values'}</div>
        {values
          .filter((value) => !value.isDeprecated)
          .map((value) => (
            <EnumValue key={value.name} value={value} />
          ))}
      </div>
    );

    const deprecatedValues = values.filter((value) => value.isDeprecated);
    if (deprecatedValues.length > 0) {
      deprecatedValuesDef = (
        <div className="doc-category">
          <div className="doc-category-title">{'deprecated values'}</div>
          {!state.showDeprecated ? (
            <button className="show-btn" onClick={handleShowDeprecated}>
              {'Show deprecated values...'}
            </button>
          ) : (
            deprecatedValues.map((value) => (
              <EnumValue key={value.name} value={value} />
            ))
          )}
        </div>
      );
    }
  }

  return (
    <div>
      <MarkdownContent
        className="doc-type-description"
        markdown={type.description || 'No Description'}
      />
      {type instanceof GraphQLObjectType && typesDef}
      {fieldsDef}
      {deprecatedFieldsDef}
      {valuesDef}
      {deprecatedValuesDef}
      {!(type instanceof GraphQLObjectType) && typesDef}
    </div>
  );
}
export default memo(TypeDoc);

function Field({ type, field, onClickType, onClickField }) {
  return (
    <div className="doc-category-item">
      <a
        className="field-name"
        onClick={(event) => onClickField(field, type, event)}
      >
        {field.name}
      </a>
      {field.args &&
        field.args.length > 0 && [
          '(',
          <span key="args">
            {field.args.map((arg) => (
              <Argument key={arg.name} arg={arg} onClickType={onClickType} />
            ))}
          </span>,
          ')',
        ]}
      {': '}
      <TypeLink type={field.type} onClick={onClickType} />
      <DefaultValue field={field} />
      {field.description && (
        <MarkdownContent
          className="field-short-description"
          markdown={field.description}
        />
      )}
      {field.deprecationReason && (
        <MarkdownContent
          className="doc-deprecation"
          markdown={field.deprecationReason}
        />
      )}
    </div>
  );
}

Field.propTypes = {
  type: PropTypes.object,
  field: PropTypes.object,
  onClickType: PropTypes.func,
  onClickField: PropTypes.func,
};

function EnumValue({ value }) {
  return (
    <div className="doc-category-item">
      <div className="enum-value">{value.name}</div>
      <MarkdownContent
        className="doc-value-description"
        markdown={value.description}
      />
      {value.deprecationReason && (
        <MarkdownContent
          className="doc-deprecation"
          markdown={value.deprecationReason}
        />
      )}
    </div>
  );
}

EnumValue.propTypes = {
  value: PropTypes.object,
};
