import { useState } from 'react';
import PropTypes from 'prop-types';
import { _misc } from '@firecamp/utils';

function SearchBox({ value, placeholder, onSearch }) {
  let [state, setState] = useState({ value });
  let debouncedOnSearch = _misc.debounce(200, onSearch);

  const handleChange = (event) => {
    const value = event.target.value;
    setState({ value });
    debouncedOnSearch(value);
  };

  const handleClear = () => {
    setState({ value: '' });
    onSearch('');
  };

  return (
    <label className="search-box">
      <div className="search-box-icon" aria-hidden="true">
        {'\u26b2'}
      </div>
      <input
        value={state.value}
        onChange={handleChange}
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {state.value && (
        <button
          className="search-box-clear"
          onClick={handleClear}
          aria-label="Clear search input"
        >
          {'\u2715'}
        </button>
      )}
    </label>
  );
}

SearchBox.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchBox;
