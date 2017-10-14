import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { joinRoom, createRoom } from '../../actions/dashboard.js';
import styles from './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabName: 'join',
      joinCode: '',
      joinText: 'Enter class code to join',
    };
    this.onJoin = this.onJoin.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }
  onJoin(e) {
    e.preventDefault();
    const { joinCode } = this.state;

    firebase.database().ref('/rooms/').once('value').then((snapshot) => {
      if (snapshot.hasChild(joinCode)) {
        this.props.joinAction(this.state.joinCode);
      } else {
        this.setState({ joinText: 'Invalid entry code' });
      }
    });
  }
  onCreate(e) {
    e.preventDefault();
    this.props.createAction();
  }
  render() {
    const { tabName, joinCode, joinText } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div className={styles.tabs}>
            <div
              className={styles.tab}
              data-active={tabName === 'join'}
              onClick={() => this.setState({ tabName: 'join' })}
            >
              Join
            </div>
            <div
              className={styles.tab}
              data-active={tabName === 'create'}
              onClick={() => this.setState({ tabName: 'create' })}
            >
              Create
            </div>
          </div>
          {tabName === 'join' ?
            <div className={styles.content}>
              <div>{joinText}</div>
              <form onSubmit={this.onJoin}>
                <input
                  type="text"
                  onChange={event => this.setState({ joinCode: event.target.value })}
                  value={joinCode}
                  placeholder={'ex: XY78K'}
                />
              </form>
            </div>
            :
            <div className={styles.content}>
              <div>Start a new classroom session</div>
              <div
                className={styles.button}
                onClick={this.onCreate}
              >
                Create
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  joinAction: PropTypes.func.isRequired,
  createAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  joinAction: roomId => dispatch(joinRoom(roomId)),
  createAction: () => dispatch(createRoom()),
});

export default connect(null, mapDispatchToProps)(Login);
