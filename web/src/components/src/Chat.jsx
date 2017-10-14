import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
import { updateChat } from '../../actions/dashboard.js';
import styles from './Chat.scss';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      message: '',
    };
    this.onSend = this.onSend.bind(this);
  }
  componentDidUpdate() {
    if (this.chatArea) {
      this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }
  }
  onSend(e) {
    e.preventDefault();
    const { message } = this.state;
    const { chatData, userId } = this.props;
    const newMessage = {
      text: message,
      username: userId,
      timestamp: Math.floor(Date.now() / 1000),
    };
    const newData = [...chatData, newMessage];
    this.setState({ message: '' });
    this.props.updateChatAction(newData);
  }
  render() {
    const { isOpen, message } = this.state;
    const { chatData } = this.props;
    return (
      <div className={styles.container}>
        <div
          className={styles.header}
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <div className={styles.titleBar}>
            Chat
          </div>
          <div className={styles.toggleArrow}>
            {isOpen ?
              <FaAngleDown size="22px" color="#aaa" />
              :
              <FaAngleUp size="22px" color="#aaa" />
            }
          </div>
        </div>
        {isOpen &&
          <div className={styles.chat}>
            <div className={styles.messageArea} ref={(ref) => { this.chatArea = ref; }}>
              {chatData.map(msg => (
                <div key={msg.timestamp + msg.text} className={styles.message}>
                  <span
                    className={styles.username}
                    style={{ color: msg.username.split(' ')[0] }}
                  >{msg.username}: </span>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className={styles.input}>
              <form onSubmit={this.onSend}>
                <input
                  type="text"
                  onChange={e => this.setState({ message: e.target.value })}
                  value={message}
                  placeholder={'Say hi to your classmates'}
                />
              </form>
            </div>
          </div>
        }
      </div>
    );
  }
}

Chat.defaultProps = {
  userId: '000',
};

Chat.propTypes = {
  chatData: PropTypes.array.isRequired,
  updateChatAction: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

const mapStateToProps = state => ({
  chatData: state.dashboard.chatData,
  userId: state.dashboard.userId,
});

const mapDispatchToProps = dispatch => ({
  updateChatAction: data => dispatch(updateChat(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
