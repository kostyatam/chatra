import * as React from 'react';
import * as axios from 'axios';
import Search from './components/Search/Search';
import ProfilesList from './components/ProfilesList/ProfilesList';

const css = require('./app.scss');

export default class App extends React.Component {
  state = {
    userLoading: false,
    searchValue: '',
    players: [],
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  handleSearch = (value) => {
    const matches = value.match(/(?:https:\/\/steamcommunity\.com\/id\/)?(\w+)/i);
    const name = (matches && matches.pop()) || value;
    this.setState({
      userLoading: true,
    });
    axios.get(`/api/getUserInfo?name=${name}`).then(({ data }) => {
      const { player } = data;
      const { players } = this.state;
      this.setState({
        players: players.concat(player),
        searchValue: '',
        userLoading: false,
      });
    })
      .catch(() => {
        this.setState({
          userLoading: false,
        });
      });
  }

  render() {
    const { searchValue, players, userLoading } = this.state;
    return (
      <div>
        <Search
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          value={searchValue}
          progress={userLoading}
        />
        <ProfilesList players={players} />
      </div>
    );
  }
}
