import * as React from 'react';
import PropTypes from 'prop-types';

const css = require('./ErrorMsg.scss');

const ErrorMsg = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={css.errorMsg}>
      {message}
    </div>
  );
};

ErrorMsg.propTypes = {
  message: PropTypes.string,
};

ErrorMsg.defaultProps = {
  message: '',
};

export default ErrorMsg;
