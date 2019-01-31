import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./Profile.scss');

const Profile = ({ personname, avatarmedium }) => (
  <div>
    <div className={css.avatar} style={{ backgroundImage: `url(${avatarmedium})` }} />
    <div className={css.name}>{personname}</div>
  </div>
);

Profile.propTypes = {
  personname: PropTypes.string,
  avatarmedium: PropTypes.string,
};

Profile.defaultProps = {
  personname: '',
  avatarmedium: '',
};
