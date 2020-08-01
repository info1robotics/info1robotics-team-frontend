import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { latestReviews } from '../utils/ReviewsUtils';
import constants from '../constants';
import Tags from './Tags';


const UploadCard = (props) => {
    const [status, setStatus] = useState({flag: -1, message: "fetching..."});

    
    useEffect(() => {
        let allLatestReviews = latestReviews(props.upload.reviews);

        
        console.log(allLatestReviews);


        if(allLatestReviews.length === 0) {
            setStatus({flag: 0, message: "0/0"});
        } else {
            const positiveReviews = allLatestReviews.filter(review => review.positive === true);

            if(positiveReviews.length === allLatestReviews.length) {
                setStatus({flag: 1, message: `${positiveReviews.length}/${allLatestReviews.length}`});
            } else {
                setStatus({flag: 2, message: `${positiveReviews.length}/${allLatestReviews.length}`});
            }
        }


        
    }, []);

    const getStatusVariant = (flag) => {
        if(flag === 0) return "warning";
        else if(flag === 1) return "success";
        else if(flag === 2) return "danger";
    };

    return (
        <div className="col-12 col-md-6 mb-4">
            <div className={`card border-${getStatusVariant(status.flag)}`} style={{width: "100%", borderWidth: "2px"}}>
                <div className="card-body">
                    <div className="row ">
                        <div className="col-12 col-md-8">
                            <h5 className="card-title">{props.upload.name}</h5>
                            <h6 className="card-subtitle text-muted mb-2">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                </svg>{props.upload.author.username}</h6>
                            {props.upload.integrated? <h6 className={`card-subtitle text-${getStatusVariant(status.flag)} mb-2`}>
                                In Notebook
                                </h6> : null }
                        </div>
                        <div className="col-12 col-md-4">
                            <span className={`float-right font-weight-bold text-${getStatusVariant(status.flag)}`}>{status.message}</span>
                        </div>
                    </div>
                    
                    <span><Tags upload={props.upload} /></span>
                    <h5></h5> { /* pentru separarea intre tag-uri si butoane */}
                    <a href={`http://${constants.IP_ADDRESS}:5002/uploads/download/` + props.upload.name} className="card-link" download>Download</a> {/* TODO: trebuie neaparat sa vad cum sa folosesc proxy-ul pt file download */}
                    <Link to={`/upload/${props.upload._id}`} className="card-link">Details</Link>
                </div>
            </div>
        </div>
        
    );
};

export default UploadCard;