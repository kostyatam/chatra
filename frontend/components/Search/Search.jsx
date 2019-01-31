import * as React from 'react';
const css = require('./Search.scss');

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value | ''
    }
  }

  handleChange = (e) => {
    const {value} = e.target;
    this.setState({value});
  }

  handleSearch = (e) => {
    const {value} = this.state;
    if (!value) return;
    if (e.keyCode === 13) {
      this.props.onSearch(value);
    }
  }

  render() {
    return (
      <div className={css.search}>
        <input type="text"
          onChange={this.handleChange}
          onKeyUp={this.handleSearch}
        />
      </div>
    )
  }
}