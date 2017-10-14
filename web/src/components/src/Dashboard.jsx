import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chat from './Chat.jsx';
import Polls from './Polls.jsx';
import PollsAdmin from './PollsAdmin.jsx';
import QuestionQueue from './QuestionQueue.jsx';
import QuestionQueueAdmin from './QuestionQueueAdmin.jsx';
import styles from './Dashboard.scss';

const Dashboard = ({ isAdmin }) => (
  <div className={styles.container}>
    <div className={styles.section}>
      {isAdmin ?
        <QuestionQueueAdmin />
        :
        <QuestionQueue />
      }
    </div>
    <div className={styles.section}>
      {isAdmin ?
        <PollsAdmin />
        :
        <Polls />
      }
      <Chat />
    </div>
  </div>
);

Dashboard.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAdmin: state.dashboard.isAdmin,
});

export default connect(mapStateToProps)(Dashboard);
