import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import { updateQuestions } from '../../actions/dashboard.js';
import styles from './QuestionQueue.scss';

class QuestionQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      voted: [],
    };
    this.onAsk = this.onAsk.bind(this);
    this.onVote = this.onVote.bind(this);
  }
  onAsk(e) {
    e.preventDefault();
    const { question } = this.state;
    const { questionData } = this.props;
    const newQuestion = {
      answered: false,
      text: question,
      upvotes: 1,
    };
    this.setState({ question: '' });
    this.props.updateQuestionsAction(questionData.concat(newQuestion));
  }
  onVote(text) {
    const { voted } = this.state;
    if (voted.includes(text)) {
      return;
    }
    const dataCopy = this.props.questionData.map((q) => {
      const copy = { ...q };
      if (q.text === text) {
        copy.upvotes += 1;
      }
      return copy;
    });
    this.setState({ voted: [...voted, text] });
    this.props.updateQuestionsAction(dataCopy);
  }
  render() {
    const { question, voted } = this.state;
    const questionData = this.props.questionData.filter(q => (!q.answered));
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          Question Queue
        </div>
        <div className={styles.input}>
          <form onSubmit={this.onAsk}>
            <input
              type="text"
              onChange={e => this.setState({ question: e.target.value })}
              value={question}
              placeholder={'Ask a question'}
            />
          </form>
        </div>
        <div className={styles.questionQueue}>
          {questionData
            .filter(q => (q.text.toLowerCase().indexOf(question.toLowerCase()) !== -1))
            .map((ques, idx) => (
              <div className={styles.question} key={ques.text + idx}>
                <div className={styles.upvotes}>
                  <div
                    className={styles.arrow}
                    onClick={() => this.onVote(ques.text)}
                  >
                    <FaAngleUp size="15px" />
                  </div>
                  <div
                    data-voted={voted.includes(ques.text)}
                    className={styles.upvotesNumber}
                  >
                    {ques.upvotes}
                  </div>
                </div>
                <div
                  className={styles.questionText}
                  data-voted={voted.includes(ques.text)}
                >
                  {ques.text}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

QuestionQueue.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionQueue);
