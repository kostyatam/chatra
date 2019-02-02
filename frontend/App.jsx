import * as React from 'react';
import * as axios from 'axios';
import Search from './components/Search/Search';
import ProfilesList from './components/ProfilesList/ProfilesList';
import Games from './components/Games/Games';

const css = require('./App.scss');

export default class App extends React.Component {
  state = {
    userLoading: false,
    searchValue: '',
    playerErrMsg: '',
    players: [],
    games: [],
    gamesLoading: false,
    gamesErrMsg: '',
  }

  handleRemove = (e) => {
    const { steamid } = e.target.dataset;
    const { players } = this.state;

    this.setState({
      players: players.filter(player => player.steamid !== steamid),
    });
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
      const { players, errorMessage } = this.state;
      const isAlreadyAdded = players.some(({ steamid }) => steamid === player.steamid);

      if (isAlreadyAdded) {
        this.setState({
          userLoading: false,
        });
        return;
      }

      this.setState({
        players: players.concat(player),
        searchValue: '',
        userLoading: false,
        playerErrMsg: errorMessage,
      });
    })
      .catch(({ response: { data: { errorMessage } } }) => {
        this.setState({
          userLoading: false,
          playerErrMsg: errorMessage,
        });
      });
  }

  handleGamesSearch = () => {
    const { players } = this.state;
    const steamIds = players.map(player => player.steamid).join(',');

    this.setState({
      gamesLoading: true,
    });

    axios.get(`/api/getMultiplayerGames?steamIds=${steamIds}`).then(({ data }) => {
      const { games, errorMessage } = data;
      this.setState({
        games,
        gamesLoading: false,
        gamesErrMsg: errorMessage,
      });
    })
      .catch(({ response: { data: { errorMessage } } }) => {
        this.setState({
          gamesLoading: false,
          games: [],
          gamesErrMsg: errorMessage,
        });
      });
  }

  render() {
    const {
      searchValue, players, userLoading, games,
      gamesLoading, playerErrMsg, gamesErrMsg,
    } = this.state;
    const gamesSearchDisabled = players.length < 2 || gamesLoading;
    return (
      <div className={css.app}>
        <div className={css.row}>
          <Search
            onChange={this.handleChange}
            onSearch={this.handleSearch}
            value={searchValue}
            progress={userLoading}
            errMsg={playerErrMsg}
          />
        </div>
        <div className={css.row}>
          <ProfilesList
            players={players}
            onRemove={this.handleRemove}
          />
        </div>
        <div className={css.row}>
          <Games
            games={games}
            disabled={gamesSearchDisabled}
            onSearch={this.handleGamesSearch}
            progress={gamesLoading}
            errMsg={gamesErrMsg}
          />
        </div>
      </div>
    );
  }
}
