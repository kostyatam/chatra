import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./Search.scss');

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  handleSearch = (e) => {
    const { value } = this.state;
    const { onSearch } = this.props;
    if (!value) return;
    if (e.keyCode === 13) {
      onSearch(value);
    }
  }

  render() {
    return (
      <div className={css.search}>
        <input
          type="text"
          onChange={this.handleChange}
          onKeyUp={this.handleSearch}
        />
      </div>
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func,
  value: PropTypes.string,
};

Search.defaultProps = {
  onSearch: () => {},
  value: '',
};
