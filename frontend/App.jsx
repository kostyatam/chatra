import * as React from 'react';
import * as axios from 'axios';
import Search from './components/Search/Search';

export default class App extends React.Component {
  state = {
    searchValue: '',
    players: []
  }

  handleSearch = (value) => {
    const [name] = value.match( /(?:https:\/\/steamcommunity\.com\/id\/)?(\w+)/i );
    axios.get(`/api/getUserInfo?name=${name}`).then(res => {
      const {steamId} = res;
      const {players} = this.state;
      this.setState({
        players
      })
    });
  }

  render () {
    const {searchValue} = this.state;
    return (
      <div>
        <Search
          onSearch={this.handleSearch}
          value={searchValue}
        />
      </div>
    )
  }
}