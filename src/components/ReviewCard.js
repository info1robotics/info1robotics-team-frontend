import React, { useContext } from 'react';
import ReviewsService from '../services/ReviewsService';
import {AuthContext} from '../contexts/AuthContext';


const getClassName = (positive) => {
    return `card text-white bg-${positive? "success" : "danger"} mb-3 w-100 mb-3`;
}

const getBeautyDate = (date) => {
    return convertUTCDateToLocalDate(date).toISOString().substr(0, 19).replace("T", " ");
}

const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

const ReviewCard = (props) => {

    const authContext = useContext(AuthContext);

    const onDeleteButtonClickHandler = () => {
        ReviewsService.deleteReview(props.upload._id, props.review._id).then(data => {
            if(data.success) {
                props.history.push('/home');
                props.history.goBack();
            }
        });
    };


    return (
        <div className={getClassName(props.review.positive)}>
            <div className="card-header">
                {getBeautyDate(new Date(props.review.updatedAt))}
                { authContext.user._id === props.review.author._id? <button type="button" class="btn btn-warning btn-sm float-right" aria-label="Close" onClick={onDeleteButtonClickHandler}>DELETE</button> : null }
            </div>
            <div className="card-body">
                <h5 className="card-title">{props.review.author.username}</h5>
                <p className="card-text">{props.review.comment}</p>
            </div>
        </div>
    );
};

export default ReviewCard;