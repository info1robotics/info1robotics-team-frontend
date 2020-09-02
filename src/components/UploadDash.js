import React, { useEffect, useState, useContext } from 'react';
import UploadsService from '../services/UploadsService';
import ReviewsService from '../services/ReviewsService';
import ReviewCard from './ReviewCard';
import { AuthContext } from '../contexts/AuthContext';
import { latestReviews, outdatedReviews } from '../utils/ReviewsUtils';
import constants from '../constants';
import Fade from 'react-reveal/Fade';
import Tags from './Tags';




const ReviewBox = (props) => {

    const [comment, setComment] = useState("");
    const [positive, setPositive] = useState(false);
    const authContext = useContext(AuthContext);


    const canComment = () => {
        return authContext.user._id !== props.upload.author._id;
    }

    const getBtnStyle = (positive) => {
        if (positive) return "btn-success";
        else return "btn-danger";
    };

    const onCommentChangeHandler = (e) => {
        setComment(e.target.value);
    };

    const onRemarkChangeHandler = (e) => {
        if (e.target.name === "positive") {
            setPositive(true);
        } else if (e.target.name === "negative") setPositive(false);
    };

    const submitReview = () => {
        ReviewsService.newReview({ comment, positive, upload: props.upload }).then(data => {
            props.history.push(`/home`);
            props.history.push(`/upload/${props.upload._id}`);
        });
    };

    return (
        <div className="input-group">
            <input type="text" className="form-control" defaultValue={comment} name="comment" onChange={onCommentChangeHandler} placeholder="Type your comment here." disabled={!canComment()} />
            <div className="input-group-append">
                <button type="button" className={`btn ${getBtnStyle(positive)} shadow mb-2`} onClick={submitReview} disabled={!canComment()}>Update</button>
                <button type="button" className={`btn ${getBtnStyle(positive)} dropdown-toggle dropdown-toggle-split shadow mb-2`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={!canComment()}>
                    <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu border-0 shadow mb-2">
                    <button className="dropdown-item" name="positive" href="#" onClick={onRemarkChangeHandler} disabled={!canComment()}>Positive</button>
                    <button className="dropdown-item" name="negative" href="#" onClick={onRemarkChangeHandler} disabled={!canComment()}>Negative</button>
                </div>
            </div>
        </div>
    );

}

const ReviewsSection = (props) => {

    return (
        <Fade down duration={300} distance={"16px"}>
            <div className="col-12 shadow p-3 mb-5 rounded">
                <div className="text-center mb-5">
                    <h2 className="">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-right-text-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM3.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
                        </svg>  Latest comments</h2>
                </div>
                <ReviewsGroup upload={props.upload} reviews={props.upload.reviews} process={latestReviews} history={props.history} />
                <div className="col-12 p-0">
                    <ReviewBox upload={props.upload} history={props.history} />
                </div>
            </div>



            <div className="col-12 shadow p-3 mb-2 rounded">
                <div className="text-center mb-5">
                    <h2 className="">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-archive-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM6 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z" />
                        </svg>  Outdated comments</h2>
                </div>
                <ReviewsGroup upload={props.upload} reviews={props.upload.reviews} process={outdatedReviews} history={props.history} />

            </div>

        </Fade>
    );
};

const ReviewsGroup = (props) => {
    const [reviewsJSX, setReviewsJSX] = useState([]);


    useEffect(() => {

        const res = props.process(props.reviews).map(review =>
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

        if (allReviews.length === 0) {
            setReviewsStatus({ flag: 0, message: "0/0 No reviews" });
        } else {
            const positiveReviews = allReviews.filter(review => review.positive === true);

            if (positiveReviews.length === allReviews.length) {
                setReviewsStatus({ flag: 1, message: `${positiveReviews.length}/${allReviews.length} Ready` });
            } else {
                setReviewsStatus({ flag: 2, message: `${positiveReviews.length}/${allReviews.length} Requires changes` });
            }
        }


    }, []);

    const getStatusVariant = (flag) => {
        if (flag === 0) return "warning";
        else if (flag === 1) return "success";
        else if (flag === 2) return "danger";
    };

    return (
        <div className={props.className}>
            {
                props.upload.integrated ?
                    <h6 className={`card-subtitle text-${getStatusVariant(reviewsStatus.flag)} mb-2`}>In Notebook</h6> :
                    <div className={`alert alert-${getStatusVariant(reviewsStatus.flag)} d-block mb-2 w-100`}>
                        <span className="d-block text-center align-middle">{reviewsStatus.message}</span>
                    </div>
            }
        </div>
    );
};

const CoreInfo = (props) => {

    const [deleteText, setDeleteText] = useState("Delete");
    const authContext = useContext(AuthContext);

    const confirmAndDelete = (e) => {
        if (deleteText === "Delete") {
            setDeleteText("Confirm again");
            setTimeout(() => {
                setDeleteText("Delete");
            }, 2000);
        } else {
            UploadsService.deleteUpload(props.upload._id).then(data => {
                if (data.success) {
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
            if (event.target.name === "optionNotIntegrated") {
                data = await UploadsService.updateUploadIntegration(props.upload._id, false);
            } else if (event.target.name === "optionIntegrated") {
                data = await UploadsService.updateUploadIntegration(props.upload._id, true);
            }

            if (data.success) {
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
        <Fade down duration={300} distance={"16px"}>
            <div className="col-12 shadow rounded mb-5 p-3">
                <div className="row align-items-center text-center">
                    <h3 className="text-center" style={{ width: "100%", wordWrap: "break-word" }}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-text-fill mb-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2 3a2 2 0 0 1 2-2h5.293a1 1 0 0 1 .707.293L13.707 5a1 1 0 0 1 .293.707V13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zm7 2V2l4 4h-3a1 1 0 0 1-1-1zM4.5 8a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                        </svg>{props.upload.name}
                    </h3>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="col p-0">
                            <h4 className="mb-2 text-muted text-center">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg> {props.upload.author.username}</h4>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col mb-3">
                        <Tags className="text-center" upload={props.upload} />
                    </div>

                </div>

                <div className="row justify-content-center mb-2">
                    <div className="col col-md-6">
                        <CoreStatus className="text-center text-md-left" upload={props.upload} />
                    </div>

                </div>

                <div className="row justify-content-center">
                    <div className="col col-md-6">
                        <a href={`http://${constants.IP_ADDRESS}:5002/uploads/download/` + props.upload.name} type="button" className="btn btn-primary btn-block float-right shadow mb-2">
                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-download float-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z" />
                                <path fill-rule="evenodd" d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z" />
                                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z" />
                            </svg>Download</a>
                        {
                            authContext.user.role === "admin" ?
                                <div className="btn-group btn-group-toggle w-100 shadow rounded mb-2">
                                    <label className={`btn btn-secondary${!props.upload.integrated ? " active" : ""}`} style={{ cursor: "pointer" }}>
                                        <input type="radio" name="optionNotIntegrated" autoComplete="off" defaultChecked={!props.upload.integrated} onChange={onIntegrationChangeHandler} />Not Integrated
                                </label>
                                    <label className={`btn btn-secondary${props.upload.integrated ? " active" : ""}`} style={{ cursor: "pointer" }}>
                                        <input type="radio" name="optionIntegrated" autoComplete="off" defaultChecked={props.upload.integrated} onChange={onIntegrationChangeHandler} />Integrated
                                </label>
                                </div> : null
                        }

                        {
                            authContext.user._id === props.upload.author._id ?
                                <button type="button" className="btn btn-danger btn-block float-right shadow rounded" onClick={confirmAndDelete}>
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash-fill float-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                                    </svg>{deleteText}
                                </button> : null
                        }


                        <div className="mb-n2"/>
                    </div>



                </div>
            </div>

        </Fade>
    );
}

const UploadDash = (props) => {

    const [upload, setUpload] = useState({});
    const [hasFetched, setHasFetched] = useState(false);


    useEffect(() => {

        UploadsService.getUpload(props.match.params.id).then((data) => {
            if (data.success) {
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
            <>
                <div className="row">
                    <CoreInfo upload={upload} history={props.history} />
                </div>


                <div className="row">
                    <ReviewsSection upload={upload} history={props.history} />
                </div>
            </>
        );
    };


    const UnfetchedView = () => {
        return <h1>Loading...</h1>
    }



    return (
        <>
            {hasFetched ? FetchedView() : UnfetchedView()}
        </>
    );

};

export default UploadDash;
