import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./Profile.scss');

const Profile = ({ personname, avatarmedium, realname }) => (
  <div>
    <div className={css.avatar} style={{ backgroundImage: `url(${avatarmedium})` }} />
    <div className={css.info}>
      <div className={css.name}>{personname}</div>
      <div className={css.realname}>{realname}</div>
    </div>
  </div>
);

Profile.propTypes = {
  personname: PropTypes.string,
  avatarmedium: PropTypes.string,
  realname: PropTypes.string,
};

Profile.defaultProps = {
  personname: '',
  avatarmedium: '',
  realname: '',
};
