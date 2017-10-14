import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateQuestions } from '../../actions/dashboard.js';
import Button from './Button.jsx';
import styles from './QuestionQueueAdmin.scss';

const QuestionQueueAdmin = ({ questionData, updateQuestionsAction }) => {
  const data = questionData.filter(q => (!q.answered));
  const markAsAnswered = (text) => {
    const newData = questionData.map((q) => {
      if (q.text === text) {
        return { ...q, answered: true };
      }
      return q;
    });
    updateQuestionsAction(newData);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Question Queue
      </div>
      <div className={styles.questionQueue}>
        {data.map((ques, idx) => (
          <div className={styles.question} key={ques.text + idx}>
            <div className={styles.upvotesNumber}>
              {ques.upvotes}
            </div>
            <div className={styles.questionText}>
              {ques.text}
            </div>
            <div className={styles.buttonContainer}>
              <Button text={'Answered'} onClick={() => markAsAnswered(ques.text)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

QuestionQueueAdmin.propTypes = {
  updateQuestionsAction: PropTypes.func.isRequired,
  questionData: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  isAdmin: state.dashboard.isAdmin,
  questionData: state.dashboard.questionData,
});

const mapDispatchToProps = dispatch => ({
  updateQuestionsAction: newList => dispatch(updateQuestions(newList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionQueueAdmin);
