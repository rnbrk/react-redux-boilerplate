import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ActionButton from './ActionButton';
import ButtonRow from './ButtonRow';
import ProgressBar from './ProgressBar';
import StudyCard from './StudyCard';
import {
  filterCardsCollectionId,
  filterCardsDue,
  getNumOfCardsRepeated,
  getNumOfCardsStudied
} from '../selectors/cards';
import { getCollectionFromId } from '../selectors/collections';
import { startAnswerCard } from '../actions/cards';
import HeaderTitle from './HeaderTitle';

class StudySession extends React.Component {
  state = {
    userHasReadFrontOfCard: false
  };

  onHandleToggle = () => {
    this.setState(() => ({ userHasReadFrontOfCard: !this.state.userHasReadFrontOfCard }));
  };

  onHandleAnswer = grade => {
    this.props.startAnswerCard(this.props.currentCard, grade);
    this.onHandleToggle();
  };

  createProgressBarText = () => `Cards: 
    ${this.props.numCardsStudied} studied. 
    ${this.props.numCardsDue} due.
    ${this.props.numCardsRepeated} to repeat.
    `;

  render() {
    const doneStudying = !this.props.currentCard && this.props.numCards > 0;
    const hasActiveCollection = this.props.activeCollectionId;
    const hasCardsInCollection = this.props.currentCard && this.props.numCards > 0;

    if (!hasActiveCollection) {
      return <Redirect to={'/404'} />;
    }

    if (doneStudying) {
      return <span>Done!</span>;
    }

    if (!hasCardsInCollection) {
      return <span>Please add cards to study.</span>;
    }

    return (
      <div>
        <HeaderTitle title="Study" subtitle={this.props.collection.name} />

        <ProgressBar
          displayText={this.createProgressBarText()}
          numDone={this.props.numCardsStudied}
          numTotal={this.props.numCards}
          numFailed={this.props.numCardsRepeated}
        />

        <form onSubmit={this.handlesubmit}>
          <StudyCard
            textFront={this.props.currentCard.textFront}
            textBack={this.props.currentCard.textBack}
            isVisible={this.state.userHasReadFrontOfCard}
          />

          {this.state.userHasReadFrontOfCard || (
            <ActionButton handleActionButtonPress={this.onHandleToggle} />
          )}

          {this.state.userHasReadFrontOfCard && (
            <ButtonRow buttonObjects={this.props.buttonRow} onHandleClick={this.onHandleAnswer} />
          )}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const activeCollectionId = state.appState.activeCollection;
  const collection = getCollectionFromId(state.collections, activeCollectionId);
  const cards = filterCardsCollectionId(state.cards, activeCollectionId);
  const cardsDue = filterCardsDue(cards);

  const numCards = cards.length;
  const numCardsDue = cardsDue.length;
  const numCardsStudied = getNumOfCardsStudied(cards);
  const numCardsRepeated = getNumOfCardsRepeated(cards);

  const { 0: currentCard } = cardsDue;

  return {
    activeCollectionId,
    cards,
    cardsDue,
    collection,
    currentCard,
    numCards,
    numCardsDue,
    numCardsStudied,
    numCardsRepeated
  };
};

StudySession.defaultProps = {
  buttonRow: [
    { buttonText: 'Easy', returnValue: 5 },
    { buttonText: 'Correct', returnValue: 4 },
    { buttonText: 'Hard', returnValue: 3 },
    { buttonText: 'Incorrect', returnValue: 2 },
    { buttonText: 'Again', returnValue: 1 }
  ]
};

const mapDispatchToProps = dispatch => ({
  startAnswerCard: (card, grade) => dispatch(startAnswerCard(card, grade))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudySession);
