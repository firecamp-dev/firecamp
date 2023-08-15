import { useState } from 'react';
import PropTypes from 'prop-types';
import { GraphQLSchema, isType } from 'graphql';

import FieldDoc from './FieldDoc';
import SchemaDoc from './SchemaDoc';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import TypeDoc from './TypeDoc';

const initialNav: any = {
  name: 'Schema',
  title: 'Documentation Explorer',
};

/**
 * DocExplorer
 *
 * Shows documentations for GraphQL definitions from the schema.
 *
 * Props:
 *
 *   - schema: A required GraphQLSchema instance that provides GraphQL document
 *     definitions.
 *
 * Children:
 *
 *   - Any provided children will be positioned in the right-hand-side of the
 *     top bar. Typically this will be a "close" button for temporary explorer.
 *
 */
export function DocExplorer({ schema, children }) {
  let [state, setState] = useState({ navStack: [initialNav] });

  // Public API
  const showDoc = (typeOrField: any) => {
    const navStack = state.navStack;
    const topNav: any = navStack[navStack.length - 1];
    if (topNav.def !== typeOrField) {
      setState({
        navStack: navStack.concat([
          {
            name: typeOrField.name,
            def: typeOrField,
          },
        ]),
      });
    }
  };

  // Public API
  const showDocForReference = (reference) => {
    if (reference.kind === 'Type') {
      showDoc(reference.type);
    } else if (reference.kind === 'Field') {
      showDoc(reference.field);
    } else if (reference.kind === 'Argument' && reference.field) {
      showDoc(reference.field);
    } else if (reference.kind === 'EnumValue' && reference.type) {
      showDoc(reference.type);
    }
  };

  // Public API
  const showSearch = (search) => {
    const navStack = state.navStack.slice();
    const topNav = navStack[navStack.length - 1];
    navStack[navStack.length - 1] = { ...topNav, search };
    setState({ navStack });
  };

  const reset = () => {
    setState({ navStack: [initialNav] });
  };

  const handleNavBackClick = () => {
    if (state.navStack.length > 1) {
      setState({ navStack: navStack.slice(0, -1) });
    }
  };

  const handleClickTypeOrField = (typeOrField) => {
    showDoc(typeOrField);
  };

  const handleSearch = (value) => {
    showSearch(value);
  };

  const navStack = state.navStack;
  const navItem = state.navStack[navStack.length - 1];

  let content;
  if (schema === undefined) {
    // Schema is undefined when it is being loaded via introspection.
    content = (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  } else if (!schema) {
    // Schema is null when it explicitly does not exist, typically due to
    // an error during introspection.
    content = <div className="error-container">{'No Schema Available'}</div>;
  } else if (navItem.search) {
    content = (
      <SearchResults
        searchValue={navItem.search}
        withinType={navItem.def}
        schema={schema}
        onClickType={handleClickTypeOrField}
        onClickField={handleClickTypeOrField}
      />
    );
  } else if (navStack.length === 1) {
    content = (
      <SchemaDoc schema={schema} onClickType={handleClickTypeOrField} />
    );
  } else if (isType(navItem.def)) {
    content = (
      <TypeDoc
        schema={schema}
        type={navItem.def}
        onClickType={handleClickTypeOrField}
        onClickField={handleClickTypeOrField}
      />
    );
  } else {
    content = (
      <FieldDoc field={navItem.def} onClickType={handleClickTypeOrField} />
    );
  }

  const shouldSearchBoxAppear =
    navStack.length === 1 || (isType(navItem.def) && navItem.def.getFields);

  let prevName;
  if (navStack.length > 1) {
    prevName = navStack[navStack.length - 2].name;
  }

  return (
    <section
      className="doc-explorer"
      key={navItem.name}
      aria-label="Documentation Explorer"
    >
      <div className="doc-explorer-title-bar 22">
        {prevName && (
          <button
            className="doc-explorer-back"
            onClick={handleNavBackClick}
            aria-label={`Go back to ${prevName}`}
          >
            {prevName}
          </button>
        )}
        <div className="doc-explorer-title">
          {navItem.title || navItem.name}
        </div>
        <div className="doc-explorer-rhs">{children}</div>
      </div>
      <div className="doc-explorer-contents">
        {shouldSearchBoxAppear && (
          <SearchBox
            value={navItem.search}
            placeholder={`Search ${navItem.name}...`}
            onSearch={handleSearch}
          />
        )}
        {content}
      </div>
    </section>
  );
}

DocExplorer.propTypes = {
  schema: PropTypes.instanceOf(GraphQLSchema),
};
