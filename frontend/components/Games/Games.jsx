import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./Games.scss');


const Games = ({ onSearch, games, disabled, progress }) => (
  <div className={css.games}>
    <button
      type="button"
      className={`${css.btn} ${progress ? css.btn_loading : ''}`}
      onClick={onSearch}
      disabled={disabled}
      title="Add at least two players to find common games"
    >
      Which games we can play together?
    </button>
    <div className="gamesList">
      {games.map((game) => {
        const { appid, name, img_logo_url: hash } = game;
        const logoUrl = `url(http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg)`;
        return (
          <div key={appid} className={css.game}>
            <div className={css.gameLogo} style={{ backgroundImage: logoUrl }} />
            <div className={css.gameName}>{name}</div>
          </div>
        );
      })}
    </div>
  </div>
);

Games.propTypes = {
  onSearch: PropTypes.func,
  games: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  progress: PropTypes.bool,
};

Games.defaultProps = {
  onSearch: () => {},
  games: [],
  disabled: true,
  progress: false,
};

export default Games;
