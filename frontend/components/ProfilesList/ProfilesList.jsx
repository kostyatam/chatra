import * as React from 'react';
import PropTypes from 'prop-types';
import Profile from '../Profile/Profile';

const css = require('./ProfilesList.scss');

const ProfilesList = ({ players }) => (
  <div className={css.profilesList}>
    {
      players.map(player => (
        <Profile
          key={player.steamid}
          {...player}
        />
      ))
    }
  </div>
);

ProfilesList.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object),
};

ProfilesList.defaultProps = {
  players: [],
};

export default ProfilesList;
