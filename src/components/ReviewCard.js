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
        <div className={getClassName(props.review.positive) + "mb-2 shadow"}>
            <div className="card-header">
                {getBeautyDate(new Date(props.review.updatedAt))}
                { authContext.user._id === props.review.author._id? <button type="button" class="btn btn-warning btn-sm float-right" aria-label="Close" onClick={onDeleteButtonClickHandler}>
                <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-trash-fill mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                </svg>
                DELETE
                </button> : null }
            </div>
            <div className="card-body">
                <h5 className="card-title">{props.review.author.username}</h5>
                <p className="card-text">{props.review.comment}</p>
            </div>
        </div>
    );
};

export default ReviewCard;