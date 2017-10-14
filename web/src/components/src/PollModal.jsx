import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePolls } from '../../actions/dashboard.js';
import Button from './Button.jsx';
import styles from './PollModal.scss';

class PollModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poll: {
        type: 'poll',
        state: 'inactive',
        text: '',
        options: [],
      },
      tempAnswer: '',
    };
    this.onSavePoll = this.onSavePoll.bind(this);
  }
  onSavePoll() {
    const { tempAnswer, poll } = this.state;
    const { pollData, updatePollsAction, onClose } = this.props;
    if (tempAnswer.length > 0) {
      this.setState({
        tempAnswer: '',
        poll: {
          ...poll,
          options: [
            ...poll.options,
            { text: tempAnswer, votes: 0 },
          ],
        },
      }, () => {
        const newData = [...pollData, this.state.poll];
        updatePollsAction(newData);
        onClose();
      });
    } else {
      const newData = [...pollData, poll];
      updatePollsAction(newData);
      onClose();
    }
  }
  render() {
    const { poll, tempAnswer } = this.state;
    const { onClose } = this.props;

    return (
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.title}>
            Create a new poll
          </div>
          <div className={styles.pollQuestion}>
            <input
              type="text"
              onChange={e => this.setState({ poll: { ...poll, text: e.target.value } })}
              value={poll.text}
              placeholder={'Enter your poll question'}
            />
          </div>
          {poll.options.map((o, idx) => (
            <div className={styles.pollQuestion} key={o.text + idx}>
              {o.text}
            </div>
          ))}
          <div className={styles.pollQuestion}>
            <input
              type="text"
              onChange={(e) => {
                this.setState({
                  tempAnswer: e.target.value,
                });
              }}
              value={tempAnswer}
              placeholder={'Enter an answer to your poll'}
            />
          </div>
          <div className={styles.buttons}>
            <div><Button text={'Cancel'} onClick={onClose} /></div>
            <div><Button text={'Save'} onClick={this.onSavePoll} /></div>
            <div>
              <Button
                text={'Add Another Answer'}
                onClick={() => {
                  if (tempAnswer.length === 0) {
                    return;
                  }
                  this.setState({
                    tempAnswer: '',
                    poll: {
                      ...poll,
                      options: [
                        ...poll.options,
                        { text: tempAnswer, votes: 0 },
                      ],
                    },
                  });
                }}
              /></div>
          </div>
        </div>
      </div>
    );
  }
}

PollModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  pollData: PropTypes.array.isRequired,
  updatePollsAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  updatePollsAction: data => dispatch(updatePolls(data)),
});

export default connect(null, mapDispatchToProps)(PollModal);
