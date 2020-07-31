import React, { useEffect, useState, useContext } from 'react';
import UploadsService from '../services/UploadsService';
import ReviewsService from '../services/ReviewsService';
import ReviewCard from './ReviewCard';
import { AuthContext } from '../contexts/AuthContext';
import { latestReviews, outdatedReviews } from '../utils/ReviewsUtils';
import constants from '../constants';







const ReviewBox = (props) => {

    const [comment, setComment] = useState("");
    const [positive, setPositive] = useState(false);
    const authContext = useContext(AuthContext);

    
    const canComment = () => {
        return authContext.user._id !== props.upload.author._id;
    }

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
            props.history.push(`/home`);
            props.history.push(`/upload/${props.upload._id}`);
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

const ReviewsSection = (props) => {

    return (
        <>
            <div className="col-12 text-center pb-4">
                <h2 className="">Latest comments</h2>
            </div>
            <ReviewsGroup upload={props.upload} reviews={props.upload.reviews} process={latestReviews} history={props.history} />

            <div className="col-12 pt-4 pb-4 border-bottom">
                <ReviewBox upload={props.upload} history={props.history} />
            </div>
        

            <div className="col-12 text-center pt-4 pb-4">
                <h2 className="">Outdated comments</h2>
            </div>
            <ReviewsGroup upload={props.upload} reviews={props.upload.reviews} process={outdatedReviews} history={props.history} />
        </>
    );
};

const ReviewsGroup = (props) => {
    const [reviewsJSX, setReviewsJSX] = useState([]);


    useEffect(() => {

        const res = props.process(props.reviews).map( review =>
            <ReviewCard upload={props.upload} review={review} history={props.history} />
        );
        setReviewsJSX(res);
            
    }, []);

    return <>{reviewsJSX}</>;


}


const CoreStatus = (props) => {
    const [reviewsStatus, setReviewsStatus] = useState({});

    useEffect(() => {
        let allReviews = latestReviews(props.upload.reviews).filter(review => review);

        if(allReviews.length === 0) {
            setReviewsStatus({flag: 0, message: "0/0 No reviews"});
        } else {
            const positiveReviews = allReviews.filter(review => review.positive === true);

            if(positiveReviews.length === allReviews.length) {
                setReviewsStatus({flag: 1, message: `${positiveReviews.length}/${allReviews.length} Ready`});
            } else {
                setReviewsStatus({flag: 2, message: `${positiveReviews.length}/${allReviews.length} Requires changes`});
            }
        }
        

    }, []);

    const getStatusVariant = (flag) => {
        if(flag === 0) return "warning";
        else if(flag === 1) return "success";
        else if(flag === 2) return "danger";
    };

    return (
        <div className={props.className}>
            {
            props.upload.integrated?
            <h6 className={`card-subtitle text-${getStatusVariant(reviewsStatus.flag)} mb-2`}>In Notebook</h6> : 
            <div className={`alert alert-${getStatusVariant(reviewsStatus.flag)} d-block mb-2 w-100`}>
                <span className="d-block text-center align-middle">{reviewsStatus.message}</span>
            </div> 
            }
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

    return <div className={props.className}>{tagsJSX}</div>;
};

const CoreInfo = (props) => {

    const [deleteText, setDeleteText] = useState("Delete");
    const authContext = useContext(AuthContext);

    const confirmAndDelete = (e) => {
        if(deleteText === "Delete") {
            setDeleteText("Confirm again");
            setTimeout(() => {
                setDeleteText("Delete");
            }, 2000);
        } else {
            UploadsService.deleteUpload(props.upload._id).then(data => {
                if(data.success) {
                    props.history.push('/uploads');
                } else {
                    /* TODO */
                }
                
            });
            
        }
    };
    

    const onIntegrationChangeHandler = (event) => {
    

        const changeFunction = async (event) => {
            let data;
            if(event.target.name === "optionNotIntegrated") {
                data = await UploadsService.updateUploadIntegration(props.upload._id, false);
            } else if(event.target.name === "optionIntegrated") {
                data = await UploadsService.updateUploadIntegration(props.upload._id, true);
            }

            if(data.success) {
                /* TODO */
            } else {
                /* TODO */
            }

            props.history.push(`/home`);
            props.history.push(`/upload/${props.upload._id}`);
        }

        changeFunction(event);

        
    };

    
    return (
        <>
            
            <div className="col-12 col-md-5 border-right" style={{borderColor: "gray"}}>
                <div className="col">
                    <div className="row">
                        <div className="col p-0">
                            <h2 className="text-center text-md-left">{props.upload.name}</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col p-0">
                            <h6 className="mb-2 text-muted text-center text-md-left">Posted by: {props.upload.author.username}</h6>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col p-0 mb-3">
                            <Tags className="text-center text-md-left" upload={props.upload} />
                        </div>
                       
                    </div>

                    <div className="row">
                        <div className="col p-0">
                            <CoreStatus className="text-center text-md-left" upload={props.upload} />
                        </div>
                        
                    </div>
                    
                    <div className="d-s-none pb-2"></div>
                </div>
                
            </div>

            <div className="col-12 col-md-5">
                <div className="row h-100 align-content-center">
                    <div className="col-12">
                        <a href={`http://${constants.IP_ADDRESS}:5002/uploads/download/` + props.upload.name} type="button" className="btn btn-primary btn-block float-right">Download</a>
                        {
                        authContext.user.role === "admin"?
                        <div className="btn-group btn-group-toggle w-100 mt-2 mb-2">
                            <label className={`btn btn-secondary${!props.upload.integrated ? " active" : ""}`}>
                                <input type="radio" name="optionNotIntegrated" autoComplete="off" defaultChecked={!props.upload.integrated} onChange={onIntegrationChangeHandler} />Not Integrated
                            </label>
                            <label className={`btn btn-secondary${props.upload.integrated ? " active" : ""}`}>
                                <input type="radio" name="optionIntegrated" autoComplete="off" defaultChecked={props.upload.integrated} onChange={onIntegrationChangeHandler} />Integrated
                            </label>
                        </div> : null
                        }
                        
                        {authContext.user._id === props.upload.author._id? <button type="button" className="btn btn-danger btn-block float-right" onClick={confirmAndDelete}>{deleteText}</button> : null }
                        
                    </div>
                    
                </div>      
            </div>
        </>
    );
}

const UploadDash = (props) => {

    const [upload, setUpload] = useState({});
    const [hasFetched, setHasFetched] = useState(false);


    useEffect(() => {

        UploadsService.getUpload(props.match.params.id).then((data) => {
            if(data.success) {
                console.log(data.upload);
                setUpload(data.upload);
                
            } else {
                /* TODO: ServerMessage */
            }
            
            setHasFetched(true);
        });


        
    }, []);
    
    const FetchedView = () => {
        return (
            <div className="p-2">
                <div className="row mt-3 mb-4 pb-1 justify-content-center align-items-stretch border-bottom">
                    <CoreInfo upload={upload} history={props.history} />
                </div>


                <div className="row">
                    <ReviewsSection upload={upload} history={props.history} />
                </div>

                
            </div>
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
