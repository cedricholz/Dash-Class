import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePolls } from '../../actions/dashboard.js';
import Button from './Button.jsx';
import PollModal from './PollModal.jsx';
import styles from './PollsAdmin.scss';

class PollsAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });
    this.changePollState = this.changePollState.bind(this);
  }
  changePollState(poll, newState) {
    const { pollData, updatePollsAction } = this.props;
    const newPoll = { ...poll, state: newState };
    const newData = pollData.map((p) => {
      if (p.text === poll.text) {
        return newPoll;
      }
      return p;
    });
    updatePollsAction(newData);
  }
  render() {
    const { isModalOpen } = this.state;
    const { pollData } = this.props;

    return (
      <div className={styles.container}>
        {isModalOpen &&
          <PollModal pollData={pollData} onClose={this.toggleModal} />
        }
        <div className={styles.pollHeader}>
          <div className={styles.title}>
            Polls
          </div>
          <Button text={'New Poll'} onClick={this.toggleModal} />
        </div>
        <div className={styles.content}>
          {pollData.map((poll, idx) => (
            <div className={styles.poll} key={`${poll.text}${idx}`}>
              <div className={styles.pollText}>{poll.text}</div>
              <div className={styles.pollBtn}>
                <Button
                  active={poll.state === 'open'}
                  text={'Open'}
                  onClick={() => this.changePollState(poll, 'open')}
                />
              </div>
              <div className={styles.pollBtn}>
                <Button
                  active={poll.state === 'result'}
                  text={'Results'}
                  onClick={() => this.changePollState(poll, 'result')}
                />
              </div>
              <div className={styles.pollBtn}>
                <Button
                  active={poll.state === 'inactive'}
                  text={'Close'}
                  onClick={() => this.changePollState(poll, 'inactive')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

PollsAdmin.propTypes = {
  pollData: PropTypes.array.isRequired,
  updatePollsAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  pollData: state.dashboard.pollData,
});

const mapDispatchToProps = dispatch => ({
  updatePollsAction: data => dispatch(updatePolls(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PollsAdmin);
