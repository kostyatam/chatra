import * as React from 'react';
import * as axios from 'axios';
import Search from './components/Search/Search';
import Profile from './components/Profile/Profile';

export default class App extends React.Component {
  state = {
    searchValue: '',
    players: [],
  }

  handleSearch = (value) => {
    const [name] = value.match(/(?:https:\/\/steamcommunity\.com\/id\/)?(\w+)/i);
    axios.get(`/api/getUserInfo?name=${name}`).then((res) => {
      const { players } = res;
      this.setState({
        players,
      });
    });
  }

  render() {
    const { searchValue, players } = this.state;
    return (
      <div>
        <Search
          onSearch={this.handleSearch}
          value={searchValue}
        />
        {players.map(player => <Profile {...player} />)}
      </div>
    );
  }
}
