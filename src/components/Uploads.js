import React, { useState, useEffect, useRef, useContext } from 'react';

import UploadsService from '../services/UploadsService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ServerMessage from './ServerMessage';
import ReviewsService from '../services/ReviewsService';

const UploadCard = (props) => {
    const [status, setStatus] = useState({flag: -1, message: "fetching..."});
    const [reviews, setReviews] = useState([]);
    const [tagsJSX, setTagsJSX] = useState([]);

    
    useEffect(() => {
        
        // TAGS

        let aux = [];

        for(var i = 0; i < props.upload.tags.length; i++) {
            aux.push(<h5 className="pr-1" style={{display: "inline"}}><span className="badge badge-primary">{props.upload.tags[i]}</span></h5>);
        };

        setTagsJSX(aux);


        // GET REVIEWS

        ReviewsService.getUploadReviews(props.upload._id).then((data) => {
            if(data.success) {
                setReviews(data.reviews);

                // REVIEW STATUS

                let allReviews = data.reviews;

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
            }
        });

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
                            <h6 className="card-subtitle mb-2 text-muted">{props.upload.author.username}</h6>
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

const Uploads = (props) => {
    
    const [myUploadsJSX, setMyUploadsJSX] = useState([]);
    const [allUploadsJSX, setAllUploadsJSX] = useState([]);
    const authContext = useContext(AuthContext);


    useEffect( () => {
        if(!authContext.isAuthenticated) props.history.push('/home');
        else {

            // MY UPLOADS
            UploadsService.getMyUploads().then(data => {
                const {uploads} = data;
        
                let aux = [];
                for(var i = 0; i < uploads.length; i++) {
                    aux.push(<UploadCard upload={uploads[i]} />);
                }
        
                if(aux.length !== 0) setMyUploadsJSX(aux);
                else setMyUploadsJSX((
                    <ServerMessage clsName={"ml-3"} message={{success: true, msgBody: "You haven't uploaded anything yet."}} />
                ));
                
            });


            //ALL UPLOADS

            UploadsService.getAllUploads().then(data => {
                const {uploads} = data;
        
                let aux = [];
                for(var i = 0; i < uploads.length; i++) {
                    aux.push(<UploadCard upload={uploads[i]} />);
                }
        
                setAllUploadsJSX(aux);
                
            });
        }
    }, []);
    

    return (
        <>
        <div className="row pt-3 justify-content-center pb-3">
            <div className="col-12 text-center">
                <h2 className="">My Uploads</h2>
                <Link to="/uploads/new" type="button" className="btn btn-primary float-center">New Upload</Link>
            </div>
        </div>

        <div className="row justify-content-center">
            {myUploadsJSX}
        </div>

        <div className="row pt-3 justify-content-center pb-3">
            <div className="col-6 text-center">
                <h2 className="">All Uploads</h2>
            </div>
        </div>

        <div className="row justify-content-center">
            {allUploadsJSX}
        </div>
            
            
        </>
    );
};

export default Uploads;