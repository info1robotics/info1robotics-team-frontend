import React from 'react';

const getClassName = (positive) => {
    return `card text-white bg-${positive? "success" : "danger"} mb-3 w-100 mb-3`;
}

const getBeautyDate = (date) => {
    return date.toISOString().substr(0, 19).replace("T", " ");
}

const ReviewCard = (props) => {
    return (
        <div className={getClassName(props.review.positive)}>
            <div className="card-header">{getBeautyDate(new Date(props.review.updatedAt))}</div>
            <div className="card-body">
                <h5 className="card-title">{props.review.author.username}</h5>
                <p className="card-text">{props.review.comment}</p>
            </div>
        </div>
    );
};

export default ReviewCard;