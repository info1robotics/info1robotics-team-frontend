import React, { useEffect, useState, useContext } from 'react';
import UploadsService from '../services/UploadsService';
import ReviewsService from '../services/ReviewsService';
import ReviewCard from './ReviewCard';
import { AuthContext } from '../contexts/AuthContext';

const ReviewBox = (props) => {

    const [comment, setComment] = useState("");
    const [positive, setPositive] = useState(false);
    const [review, setReview] = useState(null);
    const authContext = useContext(AuthContext);

    
    const canComment = () => {
        return authContext.user._id !== props.upload.author._id;
    }

    useEffect(() => {
        ReviewsService.getUserReview(props.upload._id).then(data => {
            if(data.success) {
                if(data.review) {
                    setReview(data.review);
                    setComment(data.review.comment);
                    setPositive(data.review.positive);
                }
            } else {
                /* TODO */
            }
            
        });

        
    }, []);

    const getBtnStyle = (positive) => {
        if(positive) return "btn-success";
        else return "btn-danger";
    };

    const onCommentChangeHandler = (e) => {
      setComment(e.target.value);
    };

    const onRemarkChangeHandler = (e) => {
        if(e.target.name === "positive") {
            setPositive(true);
        } else if(e.target.name === "negative") setPositive(false);
    };

    const submitReview = () => {
        ReviewsService.newReview({comment, positive, upload: props.upload}).then(data => {
            props.dash.history.push(`/home`);
            props.dash.history.push(`/upload/${props.upload._id}`);
        });
    };

    return (
        <div className="input-group">
            <input type="text" className="form-control" defaultValue={comment} name="comment" onChange={onCommentChangeHandler} placeholder="Type your comment here." disabled={!canComment()}/>
            <div className="input-group-append">
                <button type="button" className={`btn ${getBtnStyle(positive)}`} onClick={submitReview} disabled={!canComment()}>Update</button>
                <button type="button" className={`btn ${getBtnStyle(positive)} dropdown-toggle dropdown-toggle-split`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={!canComment()}>
                <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu">
                <button className="dropdown-item" name="positive" href="#" onClick={onRemarkChangeHandler} disabled={!canComment()}>Positive</button>
                <button className="dropdown-item" name="negative" href="#" onClick={onRemarkChangeHandler} disabled={!canComment()}>Negative</button>
                </div>
            </div>
        </div>
  );

}

const ReviewsGroup = (props) => {
    const [reviewsJSX, setReviewsJSX] = useState([]);


    useEffect(() => {
        let aux = [];
        for(var i = 0; i < props.reviews.length; i++) {
            aux.push(<ReviewCard review={props.reviews[i]} />);
        }
        setReviewsJSX(aux);
    }, []);

    return <>{reviewsJSX}</>;


}

const ReviewsStatus = (props) => {
    const [status, setStatus] = useState({});

    useEffect(() => {
        let allReviews = props.reviews.filter(review => review);

        if(allReviews.length === 0) {
            setStatus({flag: 0, message: "0/0 No reviews"});
        } else {
            const positiveReviews = allReviews.filter(review => review.positive === true);

            if(positiveReviews.length === allReviews.length) {
                setStatus({flag: 1, message: `${positiveReviews.length}/${allReviews.length} Ready`});
            } else {
                setStatus({flag: 2, message: `${positiveReviews.length}/${allReviews.length} Requires changes`});
            }
        }
        

    }, []);

    const getAlertClass = (flag) => {
        if(flag === 0) return "alert-warning";
        else if(flag === 1) return "alert-success";
        else if(flag === 2) return "alert-danger";
    };

    return (
        <div class={`alert ${getAlertClass(status.flag)} d-block`}>
            <span className="d-block text-center">{status.message}</span>
        </div>
    );
};

const Tags = (props) => {

    let [tagsJSX, setTagsJSX] = useState([]);


    useEffect(() => {
        let aux = [];
        for(var i = 0; i < props.upload.tags.length; i++) {
            aux.push(<h5 className="pr-1" style={{display: "inline"}}><span className="badge badge-primary">{props.upload.tags[i]}</span></h5>);
        };

        setTagsJSX(aux);
    }, []);

    return <>{tagsJSX}</>;
};

const CoreInfo = (props) => {

    const [deleteText, setDeleteText] = useState("Delete");
    const authContext = useContext(AuthContext);

    const confirmAndDelete = (e) => {
        if(deleteText === "Delete") {
            setDeleteText("Confirm again");
        } else {
            UploadsService.deleteUpload(props.upload._id).then(data => {
                if(data.success) {
                    props.dash.history.push('/uploads');
                } else {
                    /* TODO */
                }
                
            });
            
        }
    };

    
    return (
        <>
            <div className="col-12 col-md-2">
                <ReviewsStatus reviews={props.reviews} />
            </div>
            
            <div className="col-12 col-md-6">
                <h2 className="">{props.upload.name}</h2>
                <h6 className="mb-2 text-muted">{props.upload._id}</h6>
                <Tags upload={props.upload} />
            </div>

            <div className="col-12 col-md-2">
                <div className="row">
                    <a href={"http://localhost:5002/uploads/download/" + props.upload.name} type="button" className="btn btn-primary btn-block float-right">Download</a>
                    {authContext.user._id === props.upload.author._id? <button type="button" className="btn btn-danger btn-block float-right"onClick={confirmAndDelete}>{deleteText}</button> : null }
                </div>           
            </div>
        </>
    );
}

const UploadDash = (props) => {

    const [upload, setUpload] = useState({});
    const [hasFetched, setHasFetched] = useState(false);
    const [reviews, setReviews] = useState([]);


    useEffect(() => {

        // GENERAL DETAILS

        UploadsService.getUpload(props.match.params.id).then((data) => {
            if(data.success) {
                setUpload(data.upload);
                ReviewsService.getUploadReviews(data.upload._id).then((data) => {
                    if(data.success) {
                        setReviews(data.reviews);
                        setHasFetched(true);
                    }
                });
            } else {
                /* TODO: SeverMessage */
            }
            
        });


        
    }, []);
    
    const FetchedView = () => {
        return (
            <>
                <div className="row pt-3 pb-5 justify-content-center align-items-center">
                    <CoreInfo upload={upload} dash={props} reviews={reviews} />
                </div>
                <div className="row">
                    <ReviewsGroup upload={upload} reviews={reviews} />
                </div>

                <div className="row">
                    <ReviewBox upload={upload} reviews={reviews} dash={props} />
                </div>
                
            </>
        );
    };


    const UnfetchedView = () => {
        return <h1>Loading...</h1>
    }


    
    return (
        <>
        {hasFetched? FetchedView() : UnfetchedView()}
        </>
    );

};

export default UploadDash;
