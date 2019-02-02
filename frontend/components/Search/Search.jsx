import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./Search.scss');

export default class Search extends React.Component {
  handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  handleSearch = () => {
    const { value, onSearch } = this.props;
    if (!value) return;
    onSearch(value);
  }

  render() {
    const { value, onChange, progress } = this.props;
    return (
      <div className={css.search}>
        <input
          type="text"
          className={css.input}
          onChange={onChange}
          onKeyUp={this.handleEnterKey}
          value={value}
          disabled={progress}
          placeholder="Steam url or account name"
        />
        <div className={`${css.btn} ${progress ? css.btn_loading : ''}`} onClick={this.handleSearch} />
      </div>
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  progress: PropTypes.bool,
};

Search.defaultProps = {
  onSearch: () => {},
  onChange: () => {},
  value: '',
  progress: false,
};
