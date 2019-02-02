import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./Profile.scss');

const Profile = ({
  steamid,
  personaname,
  avatarmedium,
  realname,
  onRemove,
}) => (
  <div className={css.profile}>
    <div className={css.avatar} style={{ backgroundImage: `url(${avatarmedium})` }} />
    <div className={css.info}>
      <div className={css.name}>{personaname}</div>
      <div className={css.realname}>{realname}</div>
    </div>
    <div
      className={css.remove}
      onClick={onRemove}
      data-steamid={steamid}
    />
  </div>
);

Profile.propTypes = {
  steamid: PropTypes.string,
  personaname: PropTypes.string,
  avatarmedium: PropTypes.string,
  realname: PropTypes.string,
  onRemove: PropTypes.func,
};

Profile.defaultProps = {
  steamid: '',
  personaname: '',
  avatarmedium: '',
  realname: '',
  onRemove: () => {},
};

export default Profile;
