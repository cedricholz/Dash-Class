import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'halogen/ringloader';
import firebase from 'firebase';
import { Link } from 'react-router';
import * as api from '../actions/colors.js';
import styles from './app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    const config = {
      apiKey: 'AIzaSyD8znqS3A56dxWQM7ErR2b4Ix0cgF60qeY',
      authDomain: 'dash-class.firebaseapp.com',
      databaseURL: 'https://dash-class.firebaseio.com',
      projectId: 'dash-class',
      storageBucket: 'dash-class.appspot.com',
      messagingSenderId: '912068390452',
    };

    try {
      firebase.initializeApp(config);
    } catch (e) {
      // App reloaded, so firebase did not re-initialize
    }
  }
  componentDidMount() {
    this.props.generateColor();
  }
  render() {
    const { color, children, roomId } = this.props;
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.loader}>
              <Loader size={'20'} color={color} />
            </div>
            <div className={styles.logo}>Dash Class</div>
            {roomId !== '00000' &&
              <div className={styles.roomId}>Class Code: {roomId}</div>
            }
            <Link to="/" className={styles.exit}>Exit</Link>
          </div>
          <div className={styles.body}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  color: '#000000',
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  generateColor: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  color: state.colors.color,
  roomId: state.dashboard.roomId,
});

const mapDispatchToProps = dispatch => ({
  generateColor: () => {
    dispatch(api.generateColor());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
