import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import CardForm from './CardForm';
import { getCardFromId } from '../selectors/cards';
import HeaderTitle from './HeaderTitle';
import { startEditCard, startRemoveCard } from '../actions/cards';

class EditCard extends React.Component {
  state = { userPressedSubmit: false };

  onHandleSubmit = () => {
    this.setState(() => ({ userPressedSubmit: true }));
  };

  onHandleRemoveCard = () => {
    this.props.startRemoveCard(this.props.card.id);
    this.onHandleSubmit();
  };

  updateCardInStore = (textFront, textBack) => {
    const card = {
      dateModified: moment().valueOf(),
      textBack,
      textFront
    };

    this.props.startEditCard(this.props.card.id, card);
    this.onHandleSubmit();
  };

  render() {
    const userPressedSubmit = this.state.userPressedSubmit;
    const hasCard = this.props.card;

    if (!hasCard) {
      return <Redirect to={'/404'} />;
    }

    if (userPressedSubmit) {
      return <Redirect to={`/collection/${this.props.card.collectionId}`} />;
    }

    return (
      <div>
        <HeaderTitle title="Edit Card" subtitle={this.props.card.collectionName} />
        <CardForm
          textFront={this.props.card.textFront}
          textBack={this.props.card.textBack}
          handleSubmit={this.updateCardInStore}
        />
        <button onClick={this.onHandleRemoveCard}>Remove card</button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const card = getCardFromId(state.cards, props.match.params.cardId);
  return { card };
};

const mapDispatchToProps = dispatch => ({
  startEditCard: (cardId, updates) => dispatch(startEditCard(cardId, updates)),
  startRemoveCard: cardId => dispatch(startRemoveCard(cardId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCard);
