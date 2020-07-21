import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UploadCard = (props) => {
    const [status, setStatus] = useState({flag: -1, message: "fetching..."});
    const [tagsJSX, setTagsJSX] = useState([]);

    
    useEffect(() => {
        
        // TAGS

        let aux = [];

        for(var i = 0; i < props.upload.tags.length; i++) {
            aux.push(<h5 className="pr-1" style={{display: "inline"}}><span className="badge badge-primary">{props.upload.tags[i]}</span></h5>);
        };

        setTagsJSX(aux);

        let allReviews = props.upload.reviews;

        if(allReviews.length === 0) {
            setStatus({flag: 0, message: "0/0"});
        } else {
            const positiveReviews = allReviews.filter(review => review.positive === true);

            if(positiveReviews.length === allReviews.length) {
                setStatus({flag: 1, message: `${positiveReviews.length}/${allReviews.length}`});
            } else {
                setStatus({flag: 2, message: `${positiveReviews.length}/${allReviews.length}`});
            }
        }


        
    }, []);

    const getStatusVariant = (flag) => {
        if(flag === 0) return "warning";
        else if(flag === 1) return "success";
        else if(flag === 2) return "danger";
    };

    return (
        <div className="col-12 col-md-4 p-2">
            <div className={`card border-${getStatusVariant(status.flag)}`} style={{width: "100%"}}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <h5 className="card-title">{props.upload.name}</h5>
                            <h6 className="card-subtitle text-muted mb-2">{props.upload.author.username}</h6>
                            {props.upload.integrated? <h6 className={`card-subtitle text-${getStatusVariant(status.flag)} mb-2`}>In Notebook</h6> : null }
                        </div>
                        <div className="col-12 col-md-4">
                            <span className={`float-right font-weight-bold text-${getStatusVariant(status.flag)}`}>{status.message}</span>
                        </div>
                    </div>
                    
                    {tagsJSX}
                    <h5></h5> { /* pentru separarea intre tag-uri si butoane */}
                    <a href={"http://localhost:5002/uploads/download/" + props.upload.name} className="card-link" download>Download</a> {/* TODO: trebuie neaparat sa vad cum sa folosesc proxy-ul pt file download */}
                    <Link to={`/upload/${props.upload._id}`} className="card-link">Details</Link>
                </div>
            </div>
        </div>
        
    );
};

export default UploadCard;