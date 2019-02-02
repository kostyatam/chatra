import * as React from 'react';
import PropTypes from 'prop-types';
import Profile from '../Profile/Profile';

const css = require('./ProfilesList.scss');

const ProfilesList = ({ players, onRemove }) => (
  <div className={css.profilesList}>
    {
      players.map(player => (
        <Profile
          key={player.steamid}
          onRemove={onRemove}
          {...player}
        />
      ))
    }
  </div>
);

ProfilesList.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object),
  onRemove: PropTypes.func,
};

ProfilesList.defaultProps = {
  players: [],
  onRemove: () => {},
};

export default ProfilesList;
