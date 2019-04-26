/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const CardItem = ({ id, dateAdded, front, back }) => {
  console.log(dateAdded);
  console.log(moment(dateAdded).format('DD MMM YYYY hh:mm'));

  return (
    <Link to={`/edit${id}`}>
      <div className="card-container" id={id} role="button" tabIndex="0">
        <div>Added: {moment(dateAdded).format('DD MMM YYYY hh:mm')}</div>
        <div>
          <div>{front}</div>
          <div>{back}</div>
        </div>
      </div>
    </Link>
  );
};

export default CardItem;