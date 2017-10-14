import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.scss';

const Button = ({ active, text, onClick }) => (
  <div
    className={styles.button}
    data-active={active}
    onClick={onClick}
  >
    {text}
  </div>
);

Button.defaultProps = {
  active: false,
};

Button.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default Button;
